// server/trpc/routers/audit.ts
import { z } from 'zod';
import {
  auditLogs,
  categories,
  contacts,
  departments,
  documents,
  mails,
  users,
} from '@/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { db } from '@/db';
import { buildAuditWhereClause } from '../utils';
import { alias } from 'drizzle-orm/pg-core';

// 1) نعرّف aliases لكل جدول “entity” محتمل
const recCategory = alias(categories, 'rec_category');
const recContact = alias(contacts, 'rec_contact');
const recDepartment = alias(departments, 'rec_department');
const recDocument = alias(documents, 'rec_document');
const recMail = alias(mails, 'rec_mail');
const recUser = alias(users, 'rec_user');

const changeEntrySchema = z.object({
  before: z.unknown(),
  after: z.unknown(),
});
const auditLogSchema = z.object({
  id: z.string(),
  tableName: z.string(),
  recordId: z.string(),
  userName: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  entityLabel: z.string().nullable(),
  changes: z.record(changeEntrySchema),
});

// And the overall output shape:
const getLogsOutput = z.object({
  items: z.array(auditLogSchema),
  nextCursor: z.object({ id: z.string(), createdAt: z.date() }).nullable(),
});

export const auditRouter = createTRPCRouter({
  getLogs: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .nullish(),
        tableName: z.string().optional(),
        recordId: z.string().optional(),
        limit: z.number().min(1).max(100),
      })
    )
    .output(getLogsOutput)
    .query(async ({ input }) => {
      const { tableName, recordId, cursor, limit } = input;

      const data = await db
        .select({
          id: auditLogs.id,
          tableName: auditLogs.tableName,
          recordId: auditLogs.recordId,
          userName: users.name, // من قام بالتعديل
          userId: auditLogs.userId,
          changes: auditLogs.changes,
          createdAt: auditLogs.createdAt,
          // 2) الـ COALESCE يشير الآن إلى الحقول عبر الـ aliases
          entityLabel: sql`
            COALESCE(
              ${recCategory.name},
              ${recContact.name},
              ${recDepartment.name},
              ${recDocument.subject},
              ${recMail.subject},
              ${recUser.name}
            )
          `,
        })
        .from(auditLogs)

        // أولاً: اسم الّذي قام بالتعديل
        .innerJoin(users, eq(auditLogs.userId, users.id))

        // ثمّ نربط بالـ entities المحتملة عبر LEFT JOIN + alias
        .leftJoin(
          recCategory,
          and(
            eq(auditLogs.tableName, sql`'category'`),
            eq(auditLogs.recordId, recCategory.id)
          )
        )
        .leftJoin(
          recContact,
          and(
            eq(auditLogs.tableName, sql`'contact'`),
            eq(auditLogs.recordId, recContact.id)
          )
        )
        .leftJoin(
          recDepartment,
          and(
            eq(auditLogs.tableName, sql`'department'`),
            eq(auditLogs.recordId, recDepartment.id)
          )
        )
        .leftJoin(
          recDocument,
          and(
            eq(auditLogs.tableName, sql`'document'`),
            eq(auditLogs.recordId, recDocument.id)
          )
        )
        .leftJoin(
          recMail,
          and(
            eq(auditLogs.tableName, sql`'mail'`),
            eq(auditLogs.recordId, recMail.id)
          )
        )
        .leftJoin(
          recUser,
          and(
            eq(auditLogs.tableName, sql`'user'`),
            eq(auditLogs.recordId, recUser.id)
          )
        )

        // التصفية بالـ cursor و الترتيب و ال limit
        .where(buildAuditWhereClause({ tableName, recordId, cursor }))
        .orderBy(desc(auditLogs.createdAt), desc(auditLogs.id))
        .limit(limit + 1);

      // now explicitly cast each field:
      const rows = data.map(r => ({
        id: r.id,
        tableName: r.tableName,
        recordId: r.recordId,
        userId: r.userId,
        userName: r.userName,
        createdAt: r.createdAt,
        // Drizzle gives you `unknown`, so cast it
        entityLabel: r.entityLabel as string | null,
        changes: r.changes as Record<
          string,
          { before: unknown; after: unknown }
        >,
      }));

      const hasMore = rows.length > limit;
      const items = hasMore ? rows.slice(0, -1) : rows;
      const last = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: last.id, createdAt: last.createdAt }
        : null;

      return { items, nextCursor };
    }),
});
