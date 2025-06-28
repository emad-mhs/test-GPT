// src/trpc/utils/tracking.ts
import {
  and,
  arrayOverlaps,
  eq,
  gte,
  inArray,
  like,
  lt,
  lte,
  not,
  or,
  sql,
} from 'drizzle-orm';
import { mails } from '@/db/schema';
import { MailStatuses, MailTypes } from '../mails/types';

interface TrackingFilterOptions {
  isAdmin: boolean;
  departmentId: string;
  daysBefore: string;
  search?: string;
  type?: MailTypes;
  senderId?: string;
  receiverId?: string;
  cursor?: { dueDate: Date; id: string } | null;
}

export function buildTrackingWhereClause(options: TrackingFilterOptions) {
  const {
    isAdmin,
    departmentId,
    daysBefore,
    search,
    type,
    senderId,
    receiverId,
    cursor,
  } = options;
  const now = new Date();
  const from = new Date();
  from.setDate(now.getDate() - Number(daysBefore));

  return and(
    or(
      arrayOverlaps(mails.forwardTo, [`${departmentId}`]),
      eq(mails.departmentId, departmentId)
    ),
    gte(mails.dueDate, from),
    lte(mails.dueDate, now),
    not(inArray(mails.status, [MailStatuses.DONE, MailStatuses.CANCELED])),
    type ? eq(mails.type, type) : undefined,

    // status ? eq(mails.status, status) : undefined,
    senderId ? eq(mails.senderId, senderId) : undefined,
    receiverId
      ? or(
          arrayOverlaps(mails.cc, [`${receiverId}`]),
          arrayOverlaps(mails.forwardTo, [`${receiverId}`]),
          eq(mails.receiverId, receiverId)
        )
      : undefined,
    !isAdmin ? sql`${mails.isSecret} = false` : undefined,
    search
      ? or(
          like(mails.subject, `%${search}%`),
          like(mails.refNum, `%${search}%`)
        )
      : undefined,
    // from && to
    //   ? and(gte(mails.createdAt, from), lte(mails.createdAt, to))
    //   : undefined,
    cursor
      ? or(
          lt(mails.createdAt, cursor.dueDate),
          and(eq(mails.createdAt, cursor.dueDate), lt(mails.id, cursor.id))
        )
      : undefined
  );
}
