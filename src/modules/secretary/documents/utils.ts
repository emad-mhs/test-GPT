// import { getCategoryById } from '../categories/utils';

// export async function generateDocumentPath(categoryId: string | undefined) {
//   const category = await getCategoryById(categoryId!);
//   const path = `المجلدات/${category?.name}`;

//   return path;
// }

import { documents } from '@/db/schema';
import { getCategoryById } from '../categories/utils';
import { and, eq, gte, like, lt, lte, or, sql } from 'drizzle-orm';

export async function generateDocumentPath(categoryId?: string) {
  if (!categoryId) return 'المجلدات/غير مصنف';

  const category = await getCategoryById(categoryId);

  const name = category?.name?.trim() || 'غير مصنف';
  return `المجلدات/${name}`;
}

export function buildDocumentPermissionFilter(
  documentId: string,
  userId: string,
  canModify: boolean | string
) {
  return or(
    and(eq(documents.id, documentId), eq(documents.userId, userId)),
    and(eq(documents.id, documentId), sql`${canModify} = true`)
  );
}

interface DocumentFilterOptions {
  departmentId: string;
  search?: string;
  from?: Date;
  to?: Date;
  cursor?: { createdAt: Date; id: string } | null;
}

export function buildDocumentWhereClause(options: DocumentFilterOptions) {
  const { departmentId, search, cursor, from, to } = options;

  return and(
    eq(documents.departmentId, departmentId),
    from && to
      ? and(gte(documents.createdAt, from), lte(documents.createdAt, to))
      : undefined,
    cursor
      ? or(
          lt(documents.createdAt, cursor.createdAt),
          and(
            eq(documents.createdAt, cursor.createdAt),
            lt(documents.id, cursor.id)
          )
        )
      : undefined,
    search ? like(documents.subject, `%${search}%`) : undefined
  );
}

// export async function saveDocumentCategories(
//   documentId: string,
//   catgIds: string[]
// ) {
//   if (catgIds.length === 0) return;
//   const data = catgIds.map(categoryId => ({ documentId, categoryId }));
//   await db.insert(documentCategories).values(data);
// }
