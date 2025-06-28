import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { accounts } from '@/db/schema';

export const getAccountByUserId = async (userId: string) => {
  try {
    const query = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId));

    const data = query[0];
    return data;
  } catch {
    return null;
  }
};
