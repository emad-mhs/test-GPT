import { db } from '@/db';
import { mails } from '@/db/schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { MailStatuses, MailTypes } from '../mails/types';

/**
 * استعلام للحصول على عدد الرسائل الكلي، الصادرة والواردة في فترة معينة مع فلاتر اختيارية
 */
export const fetchMailsData = async (
  startDate: Date,
  endDate: Date,
  type?: MailTypes,
  status?: MailStatuses,
  senderId?: string,
  receiverId?: string
) => {
  const conditions = and(
    type ? eq(mails.type, type) : undefined,
    status ? eq(mails.status, status) : undefined,
    senderId ? eq(mails.senderId, senderId) : undefined,
    receiverId ? eq(mails.receiverId, receiverId) : undefined,
    gte(mails.createdAt, startDate),
    lte(mails.createdAt, endDate)
  );

  return db
    .select({
      mails: sql`COUNT(*)`.mapWith(Number),
      outgoing: sql`
        COUNT(CASE 
          WHEN ${mails.type} IN ('outgoing', 'local_outgoing') THEN 1 
          ELSE NULL 
        END)`.mapWith(Number),
      incoming: sql`
        COUNT(CASE 
          WHEN ${mails.type} IN ('incoming', 'local_incoming') THEN 1 
          ELSE NULL 
        END)`.mapWith(Number),
    })
    .from(mails)
    .where(conditions);
};

/**
 * استعلام لجلب عدد الرسائل اليومية (لأغراض المخطط الزمني) مجمعة بالتاريخ
 */
export const getActiveDays = async (
  startDate: Date,
  endDate: Date,
  type?: MailTypes,
  status?: MailStatuses,
  senderId?: string,
  receiverId?: string
) => {
  const conditions = and(
    type ? eq(mails.type, type) : undefined,
    status ? eq(mails.status, status) : undefined,
    senderId ? eq(mails.senderId, senderId) : undefined,
    receiverId ? eq(mails.receiverId, receiverId) : undefined,
    gte(mails.establishedDate, startDate),
    lte(mails.establishedDate, endDate)
  );

  return db
    .select({
      date: mails.establishedDate,
      outgoing: sql`
        COUNT(CASE 
          WHEN ${mails.type} IN ('outgoing', 'local_outgoing') THEN 1 
          ELSE NULL 
        END)`.mapWith(Number),
      incoming: sql`
        COUNT(CASE 
          WHEN ${mails.type} IN ('incoming', 'local_incoming') THEN 1 
          ELSE NULL 
        END)`.mapWith(Number),
    })
    .from(mails)
    .where(conditions)
    .groupBy(mails.establishedDate)
    .orderBy(mails.establishedDate);
};
