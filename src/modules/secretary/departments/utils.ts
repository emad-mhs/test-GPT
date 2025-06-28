import { departments } from '@/db/schema';
import { and, eq, like, lt, or } from 'drizzle-orm';

interface DepartmentFilterOptions {
  search?: string;
  cursor?: { createdAt: Date; id: string } | null;
}

export function buildDepartmentWhereClause(options: DepartmentFilterOptions) {
  const { search, cursor } = options;

  const conditions = [
    cursor
      ? or(
          lt(departments.createdAt, cursor.createdAt),
          and(
            eq(departments.createdAt, cursor.createdAt),
            lt(departments.id, cursor.id)
          )
        )
      : undefined,

    search
      ? or(
          like(departments.name, `%${search}%`),
          like(departments.manager, `%${search}%`)
        )
      : undefined,
  ].filter(Boolean); // removes any undefined/null

  return conditions.length > 0 ? and(...conditions) : undefined;
}
