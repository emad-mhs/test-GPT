import { auditLogs } from '@/db/schema';
import { and, eq, gte, lt, lte, or } from 'drizzle-orm';

interface AuditFilterOptions {
  tableName?: string;
  recordId?: string;
  userId?: string;
  from?: Date;
  to?: Date;
  cursor?: { createdAt: Date; id: string } | null;
}

export function buildAuditWhereClause(options: AuditFilterOptions) {
  const { tableName, recordId, userId, from, to, cursor } = options;

  return and(
    // or(
    //   arrayOverlaps(mails.forwardTo, [`${departmentId}`]),
    //   eq(mails.departmentId, departmentId)
    // ),
    // type ? eq(mails.type, type) : undefined,
    tableName ? eq(auditLogs.tableName, tableName) : undefined,
    recordId ? eq(auditLogs.recordId, recordId) : undefined,
    userId ? eq(auditLogs.userId, userId) : undefined,
    // senderId ? eq(mails.senderId, senderId) : undefined,
    // receiverId
    //   ? or(
    //       arrayOverlaps(mails.cc, [`${receiverId}`]),
    //       eq(mails.receiverId, receiverId)
    //     )
    //   : undefined,
    // !isAdmin ? sql`${mails.isSecret} = false` : undefined,
    // search
    //   ? or(
    //       like(mails.subject, `%${search}%`),
    //       like(mails.refNum, `%${search}%`)
    //     )
    //   : undefined,
    from && to
      ? and(gte(auditLogs.createdAt, from), lte(auditLogs.createdAt, to))
      : undefined,
    cursor
      ? or(
          lt(auditLogs.createdAt, cursor.createdAt),
          and(
            eq(auditLogs.createdAt, cursor.createdAt),
            lt(auditLogs.id, cursor.id)
          )
        )
      : undefined
  );
}
