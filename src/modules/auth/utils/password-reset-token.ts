import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { passwordResetTokens } from '@/db/schema';

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const query = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    const data = query[0];
    return data;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const query = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.email, email));

    const data = query[0];
    return data;
  } catch {
    return null;
  }
};
