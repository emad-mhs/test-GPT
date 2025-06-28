import { TRPCError } from '@trpc/server';

import {
  loginSchema,
  newPasswordSchema,
  resetSchema,
  registerSchema,
} from '@/modules/auth/schema';
import { getUserByEmail } from '@/modules/auth/utils/user';
import {
  generateVerificationToken,
  generateTwoFactorToken,
  generatePasswordResetToken,
} from '@/modules/auth/utils/tokens';
import {
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
  sendPasswordResetEmail,
} from '@/lib/mail';
import { db } from '@/db';
import {
  twoFactorTokens,
  twoFactorConfirmations,
  users,
  passwordResetTokens,
  verificationTokens,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { signIn } from '@/auth'; // دالة NextAuth
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { getPasswordResetTokenByToken } from '../utils/password-reset-token';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { getVerificationTokenByToken } from '../utils/verificiation-token';

export const authRouter = createTRPCRouter({
  register: baseProcedure.input(registerSchema).mutation(async ({ input }) => {
    const { name, email, password } = input;
    // Check if user already exists
    const existing = await getUserByEmail(email);

    if (existing) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'البريد الإلكتروني مستخدم بالفعل',
      });
    }

    // Hash password and insert new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await db
      .insert(users)
      .values({ name, email, departmentId: '', password: hashedPassword });
    // Generate and send verification token
    const { token } = await generateVerificationToken(email);
    await sendVerificationEmail(email, token);
    return {
      status: 'success',
      message: 'تم إرسال رابط التحقق إلى بريدك الإلكتروني',
    };
  }),

  login: baseProcedure.input(loginSchema).mutation(async ({ input }) => {
    const { email, password, code } = input;

    // 1. التحقق من وجود المستخدم
    const user = await getUserByEmail(email);
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'البريد الإلكتروني غير مسجل',
      });
    }

    // 2. التحقق من التفعيل بالبريد
    if (!user.emailVerified) {
      const { token } = await generateVerificationToken(email);
      await sendVerificationEmail(email, token);
      throw new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'يجب تأكيد البريد الإلكتروني أولاً',
      });
    }

    // 3. المصادقة الثنائية
    if (user.isTwoFactorEnabled) {
      // إذا أُرسل رمز مسبقاً و الآن رمز موجود في input
      if (code) {
        const twoFactor = await db
          .select()
          .from(twoFactorTokens)
          .where(eq(twoFactorTokens.email, email))
          .limit(1)
          .then(res => res[0]);

        if (!twoFactor || twoFactor.token !== code) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'رمز التحقق غير صحيح',
          });
        }

        if (new Date(twoFactor.expires) < new Date()) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'انتهت صلاحية رمز التحقق',
          });
        }

        // مسح الرمز السابق وتأكيد المستخدم
        await db
          .delete(twoFactorTokens)
          .where(eq(twoFactorTokens.id, twoFactor.id!));
        await db
          .delete(twoFactorConfirmations)
          .where(eq(twoFactorConfirmations.userId, user.id));
        await db.insert(twoFactorConfirmations).values({ userId: user.id });
      } else {
        // لم يُرسل رمز بعد، أرسله
        const { token } = await generateTwoFactorToken(email);
        await sendTwoFactorTokenEmail(email, token!);
        return {
          status: 'two_factor',
          message: 'تم إرسال رمز التحقق إلى بريدك',
        };
      }
    }

    // 4. تسجيل الدخول النهائي عبر NextAuth
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
        // يمكنك تمرير ctx.req و ctx.res لو احتجت التوجيه
      });
      return { status: 'success' };
    } catch {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'البريد أو كلمة المرور غير صحيحة',
      });
    }
  }),

  reset: baseProcedure.input(resetSchema).mutation(async ({ input }) => {
    const { email } = input;
    // Validate user existence
    const user = await getUserByEmail(email);
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'البريد الإلكتروني غير مسجل',
      });
    }
    // Generate reset token and send email
    const token = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(token.email!, token.token!);
    return {
      status: 'success',
      message: 'تم إرسال رابط إعادة ضبط البريد الإلكتروني',
    };
  }),

  newPassword: baseProcedure
    .input(newPasswordSchema)
    .mutation(async ({ input }) => {
      const { password, token } = input;

      if (!token) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'رابط التحقق غير موجود',
        });
      }

      const existingToken = await getPasswordResetTokenByToken(token);

      if (!existingToken) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'رابط التحقق غير صحيح',
        });
      }

      if (new Date(existingToken.expires) < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'انتهت صلاحية رمز التحقق',
        });
      }

      const user = await getUserByEmail(existingToken.email!);
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'البريد الإلكتروني غير مسجل',
        });
      }

      // hash and update
      const hashed = await bcrypt.hash(password, 12);
      await db
        .update(users)
        .set({ password: hashed })
        .where(eq(users.id, user.id));
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id!));
      return { status: 'success', message: 'تم تحديث كلمة المرور' };
    }),

  newVerification: baseProcedure
    .input(z.string())
    .mutation(async ({ input: token }) => {
      const existingToken = await getVerificationTokenByToken(token);

      if (!existingToken) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'رابط التحقق غير موجود',
        });
      }

      if (new Date(existingToken.expires) < new Date()) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'انتهت صلاحية رمز التحقق',
        });
      }

      const user = await getUserByEmail(existingToken.email);
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'البريد الإلكتروني غير مسجل',
        });
      }

      // update user emailVerified timestamp
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id));
      // delete token
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.id, existingToken.id!));
      return { status: 'success', message: 'تم التحقق من البريد الإلكتروني' };
    }),
});
