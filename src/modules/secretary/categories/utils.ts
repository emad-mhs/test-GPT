import { db } from '@/db';
import { and, desc, eq, gte, like, lt, lte, or, sql } from 'drizzle-orm';
import { categories, documents } from '@/db/schema';

/**
 * Retrieves a single category by its ID.
 * @param id - The unique identifier of the category.
 * @returns The category object or null if not found or error occurs.
 */
export const getCategoryById = async (id: string) => {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error('Failed to fetch category by ID:', error);
    return null;
  }
};

/**
 * Fetches the top 3 most used categories within a date range,
 * grouping the rest into an "Other" category.
 *
 * @param startDate - Start of the date range (inclusive)
 * @param endDate - End of the date range (inclusive)
 * @returns An array of categories with usage count
 */
export const getTopCategories = async (startDate: Date, endDate: Date) => {
  const results = await db
    .select({
      name: categories.name,
      value: sql`COUNT(*)`.mapWith(Number),
    })
    .from(documents)
    .innerJoin(categories, eq(documents.categoryId, categories.id))
    .where(
      and(
        gte(documents.createdAt, startDate),
        lte(documents.createdAt, endDate)
      )
    )
    .groupBy(categories.name)
    .orderBy(desc(sql`COUNT(*)`));

  const topCategories = results.slice(0, 3);
  const otherCategories = results.slice(3);

  const otherTotal = otherCategories.reduce((sum, catg) => sum + catg.value, 0);

  if (otherTotal > 0) {
    topCategories.push({
      name: 'أخرى',
      value: otherTotal,
    });
  }

  return topCategories;
};

export function buildCategoryPermissionFilter(
  categoryId: string,
  userId: string,
  canModify: boolean | string
) {
  return or(
    and(eq(categories.id, categoryId), eq(categories.userId, userId)),
    and(eq(categories.id, categoryId), sql`${canModify} = true`)
  );
}

interface CategoryFilterOptions {
  departmentId: string;
  search?: string;
  cursor?: { createdAt: Date; id: string } | null;
}

export function buildCategoryWhereClause(options: CategoryFilterOptions) {
  const { departmentId, search, cursor } = options;

  return and(
    eq(categories.departmentId, departmentId),
    cursor
      ? or(
          lt(categories.createdAt, cursor.createdAt),
          and(
            eq(categories.createdAt, cursor.createdAt),
            lt(categories.id, cursor.id)
          )
        )
      : undefined,
    search ? like(categories.name, `%${search}%`) : undefined
  );
}
