// server/trpc/routers/mails.ts

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { db } from '@/db';
import { contacts, departments, mails, receivers } from '@/db/schema';
import { asc, eq, sql } from 'drizzle-orm';
import { MailTypes } from '../../mails/types';
import { buildTrackingWhereClause } from '../utils';
import { UserRoles } from '@/modules/auth/types';

export const trackingRouter = createTRPCRouter({
  dueSoon: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            dueDate: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
        daysBefore: z.string().min(0).default('10'),
        search: z.string().optional(),
        type: z.nativeEnum(MailTypes).optional(),
        senderId: z.string().optional(),
        receiverId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { cursor, limit, daysBefore, search, type, senderId, receiverId } =
        input;
      const { role, departmentId } = ctx.user;
      const isAdmin = role === UserRoles.ADMIN;

      const data = await db
        .select({
          id: mails.id,
          subject: mails.subject,
          dueDate: mails.dueDate,
          sender: contacts.jobTitle,
          receiver: receivers.jobTitle,
          ccList: sql`(
          SELECT array_agg(c.job_title)
          FROM ${contacts} c
          WHERE c.id = ANY(${mails.cc})
        )`,
          departmentList: sql`(
          SELECT array_agg(d.name)
          FROM ${departments} d
          WHERE d.id = ANY(${mails.forwardTo})
        )`,
        })
        .from(mails)
        .innerJoin(contacts, eq(mails.senderId, contacts.id))
        .innerJoin(receivers, eq(mails.receiverId, receivers.id))
        .where(
          buildTrackingWhereClause({
            isAdmin,
            departmentId,
            daysBefore,
            search,
            type,
            senderId,
            receiverId,
            cursor,
          })
        )
        .orderBy(asc(mails.dueDate))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? { id: lastItem.id, dueDate: lastItem.dueDate }
        : null;

      return { items, nextCursor };
    }),
});
