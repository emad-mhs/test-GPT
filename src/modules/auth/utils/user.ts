import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { users } from '@/db/schema';

export const getUserById = async (id: string) => {
  try {
    const query = await db.select().from(users).where(eq(users.id, id));

    const user = query[0];
    return user;
  } catch {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const query = await db.select().from(users).where(eq(users.email, email));

    const user = query[0];

    return user;
  } catch {
    return null;
  }
};
