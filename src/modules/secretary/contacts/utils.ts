// import { db } from '@/db';
// import { contacts } from '@/db/schema';
// import { eq } from 'drizzle-orm';

// export const getContactById = async (id: string) => {
//   try {
//     const [data] = await db.select().from(contacts).where(eq(contacts.id, id));

//     return data;
//   } catch {
//     return null;
//   }
// };

import { db } from '@/db';
import { contacts } from '@/db/schema';
import { and, eq, like, lt, or, sql } from 'drizzle-orm';

/**
 * Retrieves a contact by ID from the database.
 * @param id - The contact's unique identifier.
 * @returns The contact object or null if not found or on error.
 */
export const getContactById = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1); // Optional: ensures only one row

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to fetch contact by ID:', error);
    return null;
  }
};

export function buildContactPermissionFilter(
  contactId: string,
  userId: string,
  canModify: boolean | string
) {
  return or(
    and(eq(contacts.id, contactId), eq(contacts.userId, userId)),
    and(eq(contacts.id, contactId), sql`${canModify} = true`)
  );
}

interface ContactFilterOptions {
  search?: string;
  cursor?: { createdAt: Date; id: string } | null;
}

export function buildContactWhereClause(options: ContactFilterOptions) {
  const { search, cursor } = options;

  return and(
    cursor
      ? or(
          lt(contacts.createdAt, cursor.createdAt),
          and(
            eq(contacts.createdAt, cursor.createdAt),
            lt(contacts.id, cursor.id)
          )
        )
      : undefined,
    search
      ? or(
          like(contacts.jobTitle, `%${search}%`),
          like(contacts.name, `%${search}%`)
        )
      : undefined
  );
}
