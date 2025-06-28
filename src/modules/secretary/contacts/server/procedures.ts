import { db } from '@/db';
import { contacts, users } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { contactInsertSchema, contactUpdateSchema } from '../schema';
import {
  buildContactPermissionFilter,
  buildContactWhereClause,
} from '../utils';
import { logAudit } from '@/lib/audit';
import { TableNames } from '../../audit/types';

export const contactsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    const data = await db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
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
    .query(async ({ input }) => {
      const { cursor, limit, search } = input;

      const data = await db
        .select()
        .from(contacts)
        .where(buildContactWhereClause({ cursor, search }))
        .orderBy(desc(contacts.createdAt), desc(contacts.id))
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
    .input(z.object({ contactId: z.string() }))
    .query(async ({ input }) => {
      const [contact] = await db
        .select({
          id: contacts.id,
          type: contacts.type,
          jobTitle: contacts.jobTitle,
          name: contacts.name,
          email: contacts.email,
          phone: contacts.phone,
          createdAt: contacts.createdAt,
          user: users.name,
        })
        .from(contacts)
        .innerJoin(users, eq(contacts.userId, users.id))
        .where(eq(contacts.id, input.contactId));

      if (!contact) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'لا توجد بيانات' });
      }

      return contact;
    }),

  create: protectedProcedure
    .input(contactInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId, departmentId, canAdd } = ctx.user;

      if (!canAdd) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك بإنشاء جهة اتصال',
        });
      }

      const [contact] = await db
        .insert(contacts)
        .values({
          type: input.type,
          jobTitle: input.jobTitle,
          name: input.name,
          email: input.email,
          phone: input.phone,
          userId,
          departmentId,
        })
        .returning();

      return { contact };
    }),

  update: protectedProcedure
    .input(contactUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId, canUpdate } = ctx.user;

      if (!canUpdate) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك بتعديل جهة الاتصال',
        });
      }

      // 1) Read the existing row
      const [existing] = await db
        .select({
          type: contacts.type,
          jobTitle: contacts.jobTitle,
          name: contacts.name,
          email: contacts.email,
          phone: contacts.phone,
        })
        .from(contacts)
        .where(eq(contacts.id, input.contactId));

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'جهة الاتصال غير موجودة',
        });
      }

      // 2) Perform the actual update
      const [updatedContact] = await db
        .update(contacts)
        .set({
          type: input.type,
          jobTitle: input.jobTitle,
          name: input.name,
          email: input.email,
          phone: input.phone,
        })
        .where(buildContactPermissionFilter(input.contactId, userId, canUpdate))
        .returning();

      if (!updatedContact) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'جهة الاتصال غير موجودة أو لا تملك صلاحية التعديل',
        });
      }

      // 3) Compute a human‐friendly “diff”
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const changes: Record<string, { before: any; after: any }> = {};

      if (existing.jobTitle !== updatedContact.jobTitle) {
        changes['المسمى الوظيفي'] = {
          before: existing.jobTitle,
          after: updatedContact.jobTitle,
        };
      }
      if (existing.name !== updatedContact.name) {
        changes['الاسم'] = {
          before: existing.name,
          after: updatedContact.name,
        };
      }
      if (existing.email !== updatedContact.email) {
        changes['البريد الإلكتروني'] = {
          before: existing.email,
          after: updatedContact.email,
        };
      }
      if (existing.phone !== updatedContact.phone) {
        changes['الهاتف'] = {
          before: existing.phone,
          after: updatedContact.phone,
        };
      }

      // 4) Finally, write the audit‐log entry
      await logAudit(TableNames.CONTACT, input.contactId, userId, changes);

      return { updatedContact };
    }),

  remove: protectedProcedure
    .input(z.object({ contactId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId, canDelete } = ctx.user;

      if (!canDelete) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك بحذف جهة الاتصال',
        });
      }

      const [removedContact] = await db
        .delete(contacts)
        .where(buildContactPermissionFilter(input.contactId, userId, canDelete))
        .returning({ id: contacts.id });

      if (!removedContact) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'جهة الاتصال غير موجودة أو لا تملك صلاحية الحذف',
        });
      }

      return { removedContact };
    }),
});
