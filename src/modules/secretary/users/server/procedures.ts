import { db } from '@/db';
import { departments, users } from '@/db/schema';
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

import { auth } from '@/auth';
import { buildUserWhereClause, getUserById } from '../utils';
import {
  profileUpdateSchema,
  userInsertSchema,
  userUpdateSchema,
} from '../schema';

export const usersRouter = createTRPCRouter({
  getSession: baseProcedure.query(async () => {
    const session = await auth();
    if (!session) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'يجب تسجيل الدخول',
      });
    }
    return session;
  }),

  getAll: protectedProcedure.query(async () => {
    const data = await db.select().from(users).orderBy(desc(users.createdAt));
    return data;
  }),

  getMany: adminProcedure
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
      })
    )
    .query(async ({ input }) => {
      const { cursor, limit, search } = input;

      const data = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          department: departments.name,
          imageUrl: users.imageUrl,
          role: users.role,
          isTwoFactorEnabled: users.isTwoFactorEnabled,
          canAdd: users.canAdd,
          canUpdate: users.canUpdate,
          canDelete: users.canDelete,
          createdAt: users.createdAt,
        })
        .from(users)
        .innerJoin(departments, eq(users.departmentId, departments.id))
        .where(buildUserWhereClause({ cursor, search }))
        .orderBy(desc(users.createdAt), desc(users.id))
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
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId));

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'المستخدم غير موجود',
        });
      }

      return user;
    }),

  create: adminProcedure.input(userInsertSchema).mutation(async ({ input }) => {
    const [exists] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email));

    if (exists) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'هذا البريد الإلكتروني مستخدم بالفعل',
      });
    }
    const hashedPassword = await bcrypt.hash(input.password, 12);

    const [user] = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        departmentId: input.departmentId,
        role: input.role,
        password: hashedPassword,
        isTwoFactorEnabled: input.isTwoFactorEnabled ?? false,
        canAdd: input.canAdd ?? false,
        canUpdate: input.canUpdate ?? false,
        canDelete: input.canDelete ?? false,
      })
      .returning();

    return { user };
  }),

  update: adminProcedure.input(userUpdateSchema).mutation(async ({ input }) => {
    const [updatedUser] = await db
      .update(users)
      .set({
        name: input.name,
        email: input.email,
        departmentId: input.departmentId,
        role: input.role,
        isTwoFactorEnabled: input.isTwoFactorEnabled ?? false,
        canAdd: input.canAdd ?? false,
        canUpdate: input.canUpdate ?? false,
        canDelete: input.canDelete ?? false,
      })
      .where(eq(users.id, input.id))
      .returning();

    if (!updatedUser) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'المستخدم غير موجود' });
    }

    return { updatedUser };
  }),

  profile: protectedProcedure
    .input(profileUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const existing = await getUserById(input.id);

      if (!existing || existing.id !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'ليس لديك صلاحية تعديل الملف الشخصي',
        });
      }
      const { password, newPassword, confirmPassword, ...dataForUpdate } =
        input;

      let hashedPassword;

      const wantsToChangePassword = password && newPassword && confirmPassword;

      if (wantsToChangePassword && existing?.password) {
        const passwordsMatch = await bcrypt.compare(
          password,
          existing.password
        );
        if (!passwordsMatch) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'كلمة المرور الحالية خاطئة',
          });
        }

        if (newPassword !== confirmPassword) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'كلمتا المرور غير متطابقتين',
          });
        }

        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      const [updatedUser] = await db
        .update(users)
        .set({
          ...dataForUpdate,
          ...(hashedPassword && { password: hashedPassword }),
          imageUrl: input.imageUrl as string,
          departmentId: input.departmentId,
        })
        .where(eq(users.id, input.id))
        .returning();

      if (!updatedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'المستخدم غير موجود',
        });
      }

      return { updatedUser };
    }),

  remove: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const [deletedUser] = await db
        .delete(users)
        .where(eq(users.id, input.userId))
        .returning({ id: users.id });

      if (!deletedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'المستخدم غير موجود',
        });
      }

      return { deletedUser };
    }),
});
