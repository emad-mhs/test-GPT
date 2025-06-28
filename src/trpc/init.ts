import superjson from 'superjson';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema';
import { ratelimit } from '@/lib/ratelimit';
import { initTRPC, TRPCError } from '@trpc/server';
import { db } from '@/db';
import { UserRoles } from '@/modules/auth/types';
import { cache } from 'react';

export const createTRPCContext = cache(async () => {
  const session = await auth();

  return {
    userId: session?.user.id,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// 1) only logged-in users + rate-limit
export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'يجب تسجيل الدخول' });
  }
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, ctx.userId))
    .limit(1);
  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'غير مصرح لك' });
  }
  const { success } = await ratelimit.limit(user.id);
  if (!success) {
    throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
  }
  return next({ ctx: { user } });
});

// 2) only admins
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== UserRoles.ADMIN) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'غير مصرح لك القيام بهذه العملية',
    });
  }
  return next();
});
