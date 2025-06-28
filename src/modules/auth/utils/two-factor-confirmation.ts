import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { twoFactorConfirmations } from '@/db/schema';

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const query = await db
      .select()
      .from(twoFactorConfirmations)
      .where(eq(twoFactorConfirmations.userId, userId));

    const data = query[0];
    return data;
  } catch {
    return null;
  }
};
