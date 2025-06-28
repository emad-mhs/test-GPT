import { db } from '@/db';
import { categories, documents, mails } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { categoryInsertSchema, categoryUpdateSchema } from '../schema';
import {
  buildCategoryPermissionFilter,
  buildCategoryWhereClause,
} from '../utils';

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    const data = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt));
    return data;
  }),

  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
        limit: z.number().min(1).max(100),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { departmentId } = ctx.user;
      const { cursor, limit, search } = input;

      const data = await db
        .select({
          id: categories.id,
          name: categories.name,
          createdAt: categories.createdAt,
        })
        .from(categories)
        .where(buildCategoryWhereClause({ departmentId, cursor, search }))
        .orderBy(desc(categories.createdAt), desc(categories.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, createdAt: lastItem.createdAt }
        : null;

      return { items, nextCursor };
    }),

  getCategoryItems: protectedProcedure
    .input(
      z.object({
        cursor: z.object({ id: z.string(), createdAt: z.date() }).nullish(),
        limit: z.number().min(1).max(100),
        categoryId: z.string(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { departmentId } = ctx.user;
      const { categoryId, cursor, limit, search } = input;

      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId));

      if (!category) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'المجلد غير موجود' });
      }
      if (category.departmentId !== departmentId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك صلاحية الوصول',
        });
      }

      const mailQuery = db
        .select({
          id: mails.id,
          subject: mails.subject,
          type: mails.type,
          createdAt: mails.createdAt,
        })
        .from(mails)
        .innerJoin(categories, eq(mails.categoryId, categories.id))
        .where(
          and(
            buildCategoryWhereClause({ departmentId, cursor, search }),
            eq(mails.categoryId, categoryId)
          )
        );

      const documentQuery = db
        .select({
          id: documents.id,
          subject: documents.subject,
          type: documents.type,
          createdAt: documents.createdAt,
        })
        .from(documents)
        .innerJoin(categories, eq(documents.categoryId, categories.id))
        .where(
          and(
            buildCategoryWhereClause({ departmentId, cursor, search }),
            eq(documents.categoryId, categoryId)
          )
        );

      const combinedResults = await mailQuery
        .unionAll(documentQuery)
        .orderBy(desc(sql`created_at`))
        .limit(limit + 1);

      const hasMore = combinedResults.length > limit;
      const items = hasMore ? combinedResults.slice(0, -1) : combinedResults;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, createdAt: lastItem.createdAt }
        : null;

      return { items, nextCursor };
    }),

  getOne: protectedProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { departmentId } = ctx.user;

      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, input.categoryId));

      if (!category) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'المجلد غير موجود' });
      }
      if (category.departmentId !== departmentId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك صلاحية الوصول',
        });
      }

      return category;
    }),

  create: protectedProcedure
    .input(categoryInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId, departmentId, canAdd } = ctx.user;

      if (!canAdd) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك القيام بهذه العملية',
        });
      }

      const [category] = await db
        .insert(categories)
        .values({ name: input.name, userId, departmentId })
        .returning();
      return { category };
    }),

  update: protectedProcedure
    .input(categoryUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId, canUpdate } = ctx.user;

      if (!canUpdate) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك القيام بهذه العملية',
        });
      }

      const [updatedCategory] = await db
        .update(categories)
        .set({ name: input.name })
        .where(buildCategoryPermissionFilter(input.id, userId, canUpdate))
        .returning();

      if (!updatedCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'المجلد غير موجود أو لا تملك الصلاحية لعرضه',
        });
      }

      return { updatedCategory };
    }),

  remove: protectedProcedure
    .input(z.object({ categoryId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId, canDelete } = ctx.user;

      if (!canDelete) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك القيام بهذه العملية',
        });
      }

      const [deletedCategory] = await db
        .delete(categories)
        .where(
          buildCategoryPermissionFilter(input.categoryId, userId, canDelete)
        )
        .returning({ id: categories.id });

      if (!deletedCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'المجلد غير موجود أو لا تملك الصلاحية لعرضه',
        });
      }

      return { deletedCategory };
    }),
});
