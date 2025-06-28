import { db } from '@/db';
import { categories, documents, users } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { documentInsertSchema, documentUpdateSchema } from '../schema';
import {
  buildDocumentPermissionFilter,
  buildDocumentWhereClause,
} from '../utils';
import { logAudit } from '@/lib/audit';
import { TableNames } from '../../audit/types';
import { getDateRange } from '../../mails/utils';

export const documentsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
        search: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { departmentId } = ctx.user;
      const { cursor, limit, search, from, to } = input;
      const { startDate, endDate } = getDateRange(from, to);

      const data = await db
        .select({
          id: documents.id,
          subject: documents.subject,
          notes: documents.notes,
          category: categories.name,
          categoryId: documents.categoryId,
          userId: documents.userId,
          createdAt: documents.createdAt,
        })
        .from(documents)
        .innerJoin(users, eq(documents.userId, users.id))
        .leftJoin(categories, eq(documents.categoryId, categories.id))
        .where(
          buildDocumentWhereClause({
            departmentId,
            cursor,
            search,
            from: startDate,
            to: endDate,
          })
        )
        .orderBy(desc(documents.createdAt), desc(documents.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, createdAt: lastItem.createdAt }
        : null;

      return { items, nextCursor };
    }),

  getOne: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { departmentId } = ctx.user;

      const [document] = await db
        .select({
          id: documents.id,
          subject: documents.subject,
          type: documents.type,
          notes: documents.notes,
          fileUrl: documents.fileUrl,
          category: categories.name,
          categoryId: documents.categoryId,
          user: users.name,
          userId: documents.userId,
          departmentId: documents.departmentId,
          createdAt: documents.createdAt,
        })
        .from(documents)
        .innerJoin(users, eq(documents.userId, users.id))
        .leftJoin(categories, eq(documents.categoryId, categories.id))
        .where(eq(documents.id, input.documentId));

      if (!document) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'الوثيقة غير موجودة',
        });
      }

      if (document.departmentId !== departmentId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك صلاحية الوصول لهذه الوثيقة',
        });
      }

      return document;
    }),

  create: protectedProcedure
    .input(documentInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId, departmentId, canAdd } = ctx.user;

      if (!canAdd) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك بإنشاء الوثيقة',
        });
      }

      const [document] = await db
        .insert(documents)
        .values({
          userId,
          departmentId,
          subject: input.subject,
          categoryId: input.categoryId,
          notes: input.notes,
          fileUrl: (input.fileUrl as string) ?? '',
        })
        .returning();

      return { document };
    }),

  update: protectedProcedure
    .input(documentUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId, canUpdate } = ctx.user;

      if (!canUpdate) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك بتعديل الوثيقة',
        });
      }

      // 1) Read the existing row
      const [existing] = await db
        .select({
          subject: documents.subject,
          notes: documents.notes,
          fileUrl: documents.fileUrl,
          categoryId: documents.categoryId,
        })
        .from(documents)

        .where(eq(documents.id, input.documentId));

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'الوثيقة غير موجودة',
        });
      }

      // 2) Fetch old & new category name
      const oldCategoryName = existing.categoryId
        ? ((
            await db
              .select({ name: categories.name })
              .from(categories)
              .where(eq(categories.id, existing.categoryId))
          )[0]?.name ?? null)
        : null;
      const newCategoryName = input.categoryId
        ? ((
            await db
              .select({ name: categories.name })
              .from(categories)
              .where(eq(categories.id, input.categoryId))
          )[0]?.name ?? null)
        : null;

      // 3) Perform the actual update
      const [updatedDocument] = await db
        .update(documents)
        .set({
          subject: input.subject,
          categoryId: input.categoryId,
          notes: input.notes,
          fileUrl: (input.fileUrl as string) ?? '',
        })
        .where(
          buildDocumentPermissionFilter(input.documentId, userId, canUpdate)
        )
        .returning();

      if (!updatedDocument) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'الوثيقة غير موجودة أو لا تملك صلاحية التعديل',
        });
      }

      // 4) Compute a human‐friendly “diff”
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const changes: Record<string, { before: any; after: any }> = {};

      if (existing.subject !== updatedDocument.subject) {
        changes['عنوان الوثيقة'] = {
          before: existing.subject,
          after: updatedDocument.subject,
        };
      }
      if (existing.fileUrl !== updatedDocument.fileUrl) {
        changes['نسخة من الوثيقة'] = {
          before: existing.fileUrl,
          after: updatedDocument.fileUrl,
        };
      }
      if (oldCategoryName !== newCategoryName) {
        changes['اسم المجلد'] = {
          before: oldCategoryName,
          after: newCategoryName,
        };
      }
      if (existing.notes !== updatedDocument.notes) {
        changes['الملاحظات'] = {
          before: existing.notes,
          after: updatedDocument.notes,
        };
      }

      // 5) Finally, write the audit‐log entry
      await logAudit(TableNames.DOCUMENT, input.documentId, userId, changes);
      return { updatedDocument };
    }),

  remove: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId, canDelete } = ctx.user;

      if (!canDelete) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك بحذف الوثيقة',
        });
      }

      const [deletedDocument] = await db
        .delete(documents)
        .where(
          buildDocumentPermissionFilter(input.documentId, userId, canDelete)
        )
        .returning({ id: documents.id });

      if (!deletedDocument) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'الوثيقة غير موجودة أو لا تملك صلاحية الحذف',
        });
      }

      return { deletedDocument };
    }),
});
