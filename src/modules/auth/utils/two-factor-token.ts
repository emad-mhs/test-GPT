import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { twoFactorTokens } from '@/db/schema';

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const query = await db
      .select()
      .from(twoFactorTokens)
      .where(eq(twoFactorTokens.token, token));

    const data = query[0];
    return data;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const query = await db
      .select()
      .from(twoFactorTokens)
      .where(eq(twoFactorTokens.email, email));

    const data = query[0];
    return data;
  } catch {
    return null;
  }
};
