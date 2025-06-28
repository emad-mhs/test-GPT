/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { JWT } from 'next-auth/jwt';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import Credentials from 'next-auth/providers/credentials';
import type { DefaultSession, NextAuthConfig } from 'next-auth';

// import { db } from '@/db/drizzle';
import { twoFactorConfirmations, users } from '@/db/schema';

import { db } from './db';
import { getUserByEmail, getUserById } from './modules/auth/utils/user';
import { getTwoFactorConfirmationByUserId } from './modules/auth/utils/two-factor-confirmation';
import { getAccountByUserId } from './modules/auth/utils/account';
import { UserRoles } from './modules/auth/types';

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRoles;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    departmentId: string;
    imageUrl: string;
    isActive?: boolean;
    canAdd?: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    lastLoginAt?: Date;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role: UserRoles;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    departmentId: string;
    imageUrl: string;
    isActive?: boolean;
    canAdd?: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    lastLoginAt?: Date;
  }
}

export default {
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const validatedFields = CredentialsSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return user;
      },
    }),
    // GitHub,
    // Google,
  ],
  session: {
    strategy: 'jwt',
  },
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id!));
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;

      const existingUser = await getUserById(user.id!);

      // Prevent sign-in if inactive
      if (!existingUser?.isActive) return false;

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      // Prevent sign in without two factor confirmation
      if (existingUser.isTwoFactorEnabled) {
        const existingConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!existingConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await db
          .delete(twoFactorConfirmations)
          .where(eq(twoFactorConfirmations.id, existingConfirmation.id!));
      }

      // Update last login
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, user.id!));

      return true;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.departmentId = token.departmentId;
        session.user.isOAuth = token.isOAuth;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.imageUrl = token.imageUrl;
        session.user.isActive = token.canAdd;
        session.user.canAdd = token.canAdd;
        session.user.canUpdate = token.canUpdate;
        session.user.canDelete = token.canDelete;
        session.user.lastLoginAt = token.lastLoginAt;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      if (existingUser) {
        token.isOAuth = !!existingAccount;
        token.id = existingUser.id;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role as UserRoles;
        token.departmentId = existingUser.departmentId as string;
        token.imageUrl = existingUser.imageUrl as string;
        token.isActive = existingUser.isActive as boolean;
        token.canAdd = existingUser.canAdd as boolean;
        token.canUpdate = existingUser.canUpdate as boolean;
        token.canDelete = existingUser.canDelete as boolean;
        token.lastLoginAt = existingUser.lastLoginAt as Date;
      }

      return token;
    },
  },
} satisfies NextAuthConfig;
