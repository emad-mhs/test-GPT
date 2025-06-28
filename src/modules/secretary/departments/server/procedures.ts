import { db } from '@/db';
import { departments } from '@/db/schema';
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, desc, eq, ne } from 'drizzle-orm';
import { z } from 'zod';
import { departmentInsertSchema, departmentUpdateSchema } from '../schema';
import { buildDepartmentWhereClause } from '../utils';

export const departmentsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    const data = await db
      .select()
      .from(departments)
      .orderBy(desc(departments.createdAt));
    return data;
  }),

  getMany: adminProcedure
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
        .from(departments)
        .where(buildDepartmentWhereClause({ cursor, search }))
        .orderBy(desc(departments.createdAt), desc(departments.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, createdAt: lastItem.createdAt }
        : null;

      return { items, nextCursor };
    }),

  getOne: adminProcedure
    .input(z.object({ departmentId: z.string() }))
    .query(async ({ input }) => {
      const [department] = await db
        .select()
        .from(departments)
        .where(eq(departments.id, input.departmentId));

      if (!department) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'الإدارة غير موجودة',
        });
      }

      return department;
    }),

  create: adminProcedure
    .input(departmentInsertSchema)
    .mutation(async ({ input }) => {
      // Unique rank check
      const existing = await db.query.departments.findFirst({
        where: eq(departments.rank, input.rank),
      });

      if (existing) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'هذا الرقم المميز مستخدم بالفعل',
        });
      }

      const [department] = await db
        .insert(departments)
        .values({
          name: input.name,
          rank: input.rank,
          manager: input.manager,
          email: input.email,
          phone: input.phone,
        })
        .returning();

      return { department };
    }),

  update: adminProcedure
    .input(departmentUpdateSchema)
    .mutation(async ({ input }) => {
      // Unique rank check excluding self
      const isDuplicate = await db.query.departments.findFirst({
        where: and(
          eq(departments.rank, input.rank),
          ne(departments.id, input.id) // ignore current record
        ),
      });

      if (isDuplicate) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'هذا الرقم المميز مستخدم بالفعل',
        });
      }

      const [updatedDepartment] = await db
        .update(departments)
        .set({
          name: input.name,
          rank: input.rank,
          manager: input.manager,
          email: input.email,
          phone: input.phone,
        })
        .where(eq(departments.id, input.id))
        .returning();

      if (!updatedDepartment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'الإدارة غير موجودة',
        });
      }

      return { updatedDepartment };
    }),

  remove: adminProcedure
    .input(z.object({ departmentId: z.string() }))
    .mutation(async ({ input }) => {
      const [deletedDepartment] = await db
        .delete(departments)
        .where(eq(departments.id, input.departmentId))
        .returning({ id: departments.id });

      if (!deletedDepartment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'الإدارة غير موجودة أو تم حذفها مسبقًا',
        });
      }

      return { deletedDepartment };
    }),
});
