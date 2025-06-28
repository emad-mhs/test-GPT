import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { verificationTokens } from '@/db/schema';

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const query = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.token, token));

    const data = query[0];
    return data;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const query = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.email, email));

    const data = query[0];
    return data;
  } catch {
    return null;
  }
};
