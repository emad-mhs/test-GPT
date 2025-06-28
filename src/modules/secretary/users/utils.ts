import { and, eq, like, lt, or } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { UserRoles } from '@/modules/auth/types';

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

/**
 * Converts a UserRoles enum value to a localized label.
 */
export const convertRole = (role: UserRoles): string => {
  const roleMap: Record<UserRoles, string> = {
    [UserRoles.ADMIN]: 'آدمن',
    [UserRoles.MANAGER]: 'مدير',
    [UserRoles.EMPLOYEE]: 'موظف',
    [UserRoles.USER]: 'مستخدم',
  };

  return roleMap[role] ?? '-';
};

// export function isAdminOrThrow(role: string) {
//   if (role !== UserRoles.ADMIN) {
//     throw new TRPCError({
//       code: 'UNAUTHORIZED',
//       message: 'غير مصرح لك القيام بهذه العملية',
//     });
//   }
// }

// export async function checkEmailExists(email: string) {
//   const [existing] = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email));
//   if (existing) {
//     throw new TRPCError({
//       code: 'BAD_REQUEST',
//       message: 'هذا البريد الإلكتروني مستخدم بالفعل',
//     });
//   }
// }

interface UserFilterOptions {
  search?: string;
  cursor?: { createdAt: Date; id: string } | null;
}

export function buildUserWhereClause(options: UserFilterOptions) {
  const { search, cursor } = options;

  const conditions = [
    cursor
      ? or(
          lt(users.createdAt, cursor.createdAt),
          and(eq(users.createdAt, cursor.createdAt), lt(users.id, cursor.id))
        )
      : undefined,

    search ? like(users.name, `%${search}%`) : undefined,
  ].filter(Boolean); // removes any undefined/null

  return conditions.length > 0 ? and(...conditions) : undefined;
}
