import { db } from '@/db';
import {
  categories,
  contacts,
  departments,
  mailCcs,
  mailDepartments,
  mails,
  receivers,
  users,
} from '@/db/schema';
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { desc, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';

import { startOfToday } from 'date-fns';

import { MAIL_STATUSES, MailStatuses, MailTypes } from '../types';
import {
  mailInsertSchema,
  mailUpdateSchema,
  settingsMailSchema,
} from '../schema';
import {
  buildMailPermissionFilter,
  buildMailWhereClause,
  getDateRange,
  saveMailCCs,
  saveMailDepartments,
} from '../utils';
import { UserRoles } from '@/modules/auth/types';
import { logAudit } from '@/lib/audit';
import { TableNames } from '../../audit/types';

export const mailsRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
        search: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        type: z.nativeEnum(MailTypes).optional(),
        status: z.nativeEnum(MailStatuses).optional(),
        senderId: z.string().optional(),
        receiverId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const {
        cursor,
        limit,
        search,
        from,
        to,
        type,
        status,
        senderId,
        receiverId,
      } = input;
      const { role, departmentId } = ctx.user;
      const isAdmin = role === UserRoles.ADMIN;
      const { startDate, endDate } = getDateRange(from, to);

      const data = await db
        .select({
          id: mails.id,
          subject: mails.subject,
          type: mails.type,
          refNum: mails.refNum,
          attachments: mails.attachments,
          createdAt: mails.createdAt,
          establishedDate: mails.establishedDate,
          status: mails.status,
          sender: contacts.jobTitle,
          senderId: mails.senderId,
          receiver: receivers.jobTitle,
          receiverId: mails.receiverId,
          user: users.name,
          userId: users.id,
        })
        .from(mails)
        .innerJoin(users, eq(mails.userId, users.id))
        .innerJoin(contacts, eq(mails.senderId, contacts.id))
        .innerJoin(receivers, eq(mails.receiverId, receivers.id))
        .where(
          buildMailWhereClause({
            isAdmin,
            departmentId,
            search,
            from: startDate,
            to: endDate,
            type,
            status,
            senderId,
            receiverId,
            cursor,
          })
        )
        .orderBy(desc(mails.createdAt), desc(mails.id))
        .limit(limit + 1);

      const hasMore = data.length > limit;
      const items = hasMore ? data.slice(0, -1) : data;
      const lastItem = items[items.length - 1]!;
      const nextCursor = hasMore
        ? { id: lastItem.id, createdAt: lastItem.createdAt }
        : null;

      return { items, nextCursor };
    }),

  getOne: protectedProcedure
    .input(z.object({ mailId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { departmentId } = ctx.user;

      const [mail] = await db
        .select({
          id: mails.id,
          subject: mails.subject,
          type: mails.type,
          refNum: mails.refNum,
          attachments: mails.attachments,
          status: mails.status,
          isSecret: mails.isSecret,
          notes: mails.notes,
          senderId: mails.senderId,
          sender: contacts.jobTitle,
          receiverId: mails.receiverId,
          receiverEmail: receivers.email,
          receiver: receivers.jobTitle,
          cc: mails.cc,
          forwardTo: mails.forwardTo,
          category: categories.name,
          categoryId: mails.categoryId,
          fileUrl: mails.fileUrl,
          instructionsUrl: mails.instructionsUrl,
          receiptExternalUrl: mails.receiptExternalUrl,
          receiptLocalUrl: mails.receiptLocalUrl,
          docxUrl: mails.docxUrl,
          user: users.name,
          userId: users.id,
          departmentId: mails.departmentId,
          dueDate: mails.dueDate,
          createdAt: mails.createdAt,
          establishedDate: mails.establishedDate,
        })
        .from(mails)
        .innerJoin(users, eq(mails.userId, users.id))
        .innerJoin(contacts, eq(mails.senderId, contacts.id))
        .innerJoin(receivers, eq(mails.receiverId, receivers.id))
        .leftJoin(categories, eq(mails.categoryId, categories.id))
        .where(eq(mails.id, input.mailId));

      if (!mail) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'البريد غير موجود' });
      }
      if (mail.departmentId !== departmentId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'لا تملك صلاحية الوصول إلى هذا البريد',
        });
      }

      const ccList = mail.cc?.length
        ? await db
            .select({
              id: contacts.id,
              jobTitle: contacts.jobTitle,
              email: contacts.email,
            })
            .from(mailCcs)
            .innerJoin(contacts, eq(mailCcs.ccId, contacts.id))
            .where(eq(mailCcs.mailId, input.mailId))
        : [];

      const departmentList = mail.forwardTo?.length
        ? await db
            .select({
              id: departments.id,
              name: departments.name,
              email: departments.email,
            })
            .from(mailDepartments)
            .innerJoin(
              departments,
              eq(mailDepartments.departmentId, departments.id)
            )
            .where(eq(mailDepartments.mailId, input.mailId))
        : [];

      return { mail, ccList, departmentList };
    }),
  verifyMail: baseProcedure
    .input(z.object({ mailId: z.string() }))
    .query(async ({ input }) => {
      const [mail] = await db
        .select({
          subject: mails.subject,
          type: mails.type,
          refNum: mails.refNum,
          attachments: mails.attachments,
          status: mails.status,
          sender: contacts.jobTitle,
          receiver: receivers.jobTitle,
          cc: mails.cc,
          fileUrl: mails.fileUrl,
        })
        .from(mails)
        .innerJoin(contacts, eq(mails.senderId, contacts.id))
        .innerJoin(receivers, eq(mails.receiverId, receivers.id))
        .where(eq(mails.id, input.mailId));

      if (!mail) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'البريد غير موجود' });
      }

      const ccList = await db
        .select({ jobTitle: contacts.jobTitle, email: contacts.email })
        .from(mailCcs)
        .where(eq(mailCcs.mailId, input.mailId))
        .innerJoin(contacts, eq(mailCcs.ccId, contacts.id));

      return { mail, ccList };
    }),

  create: protectedProcedure
    .input(mailInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId, canAdd, departmentId } = ctx.user;

      if (!canAdd) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك بإضافة بريد',
        });
      }

      const ccIds = input.cc.map(cc => cc.id);
      const fwdDeptIds = input.forwardTo.map(fw => fw.department);

      const [{ mailId }] = await db
        .insert(mails)
        .values({
          subject: input.subject,
          type: input.type,
          senderId: input.senderId,
          receiverId: input.receiverId,
          cc: ccIds,
          forwardTo: fwdDeptIds,
          categoryId: input.categoryId,
          attachments: input.attachments,
          refNum: input.refNum,
          isSecret: input.isSecret,
          notes: input.notes,
          fileUrl: (input.fileUrl as string) ?? '',
          userId,
          departmentId,
          establishedDate: startOfToday(),
        })
        .returning({ mailId: mails.id });

      await saveMailCCs(mailId, ccIds);
      await saveMailDepartments(mailId, fwdDeptIds);

      return { mailId };
    }),

  update: protectedProcedure
    .input(mailUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId, canUpdate } = ctx.user;
      if (!canUpdate) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك بتعديل البريد',
        });
      }

      // Gather the new ID arrays
      const ccIds = input.cc.map(c => c.id);
      const fwdDeptIds = input.forwardTo.map(f => f.department);

      // 1) Read the existing row
      const [existing] = await db
        .select({
          status: mails.status,
          cc: mails.cc,
          forwardTo: mails.forwardTo,
          categoryId: mails.categoryId,
          isSecret: mails.isSecret,
          notes: mails.notes,
          dueDate: mails.dueDate,
          fileUrl: mails.fileUrl,
          instructionsUrl: mails.instructionsUrl,
          receiptExternalUrl: mails.receiptExternalUrl,
          receiptLocalUrl: mails.receiptLocalUrl,
        })
        .from(mails)
        .where(eq(mails.id, input.mailId));

      if (!existing) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'البريد غير موجود' });
      }

      // 2) Fetch old & new contact job-titles
      const oldCcRows =
        existing.cc.length > 0
          ? await db
              .select({ jobTitle: contacts.jobTitle })
              .from(contacts)
              .where(inArray(contacts.id, existing.cc))
          : [];
      const newCcRows =
        ccIds.length > 0
          ? await db
              .select({ jobTitle: contacts.jobTitle })
              .from(contacts)
              .where(inArray(contacts.id, ccIds))
          : [];

      const oldCcTitles = oldCcRows.map(r => r.jobTitle);
      const newCcTitles = newCcRows.map(r => r.jobTitle);

      // 3) Fetch old & new department names
      const oldDeptRows =
        existing.forwardTo.length > 0
          ? await db
              .select({ name: departments.name })
              .from(departments)
              .where(inArray(departments.id, existing.forwardTo))
          : [];
      const newDeptRows =
        fwdDeptIds.length > 0
          ? await db
              .select({ name: departments.name })
              .from(departments)
              .where(inArray(departments.id, fwdDeptIds))
          : [];

      const oldDeptNames = oldDeptRows.map(r => r.name);
      const newDeptNames = newDeptRows.map(r => r.name);

      // 4) Fetch old & new category name
      const oldCategoryName = existing.categoryId
        ? ((
            await db
              .select({ name: categories.name })
              .from(categories)
              .where(eq(categories.id, existing.categoryId))
          )[0]?.name ?? null)
        : null;
      const newCategoryName = input.categoryId
        ? ((
            await db
              .select({ name: categories.name })
              .from(categories)
              .where(eq(categories.id, input.categoryId))
          )[0]?.name ?? null)
        : null;

      // 5) Perform the actual update
      const [updatedMail] = await db
        .update(mails)
        .set({
          status: input.status,
          cc: ccIds,
          forwardTo: fwdDeptIds,
          categoryId: input.categoryId,
          isSecret: input.isSecret,
          notes: input.notes,
          dueDate: input.dueDate,
          fileUrl: (input.fileUrl as string) ?? existing.fileUrl,
          instructionsUrl:
            (input.instructionsUrl as string) ?? existing.instructionsUrl,
          receiptExternalUrl:
            (input.receiptExternalUrl as string) ?? existing.receiptExternalUrl,
          receiptLocalUrl:
            (input.receiptLocalUrl as string) ?? existing.receiptLocalUrl,
        })
        .where(buildMailPermissionFilter(input.mailId, userId, canUpdate))
        .returning();

      if (!updatedMail) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'البريد غير موجود أو لا تملك صلاحية التعديل',
        });
      }

      const statusLabel = new Map<string, string>(
        MAIL_STATUSES.map(s => [s.value, s.label])
      );

      // 6) Rebuild the join tables
      await db.delete(mailCcs).where(eq(mailCcs.mailId, input.mailId));
      await db
        .delete(mailDepartments)
        .where(eq(mailDepartments.mailId, input.mailId));
      await saveMailCCs(input.mailId, ccIds);
      await saveMailDepartments(input.mailId, fwdDeptIds);

      // 7) Compute a human‐friendly “diff”
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const changes: Record<string, { before: any; after: any }> = {};

      if (existing.status !== updatedMail.status) {
        changes['حالة البريد'] = {
          before: statusLabel.get(existing.status) ?? existing.status,
          after: statusLabel.get(updatedMail.status) ?? updatedMail.status,
        };
      }
      // if (existing.status !== updatedMail.status) {
      //   changes.status = {
      //     before: existing.status,
      //     after: updatedMail.status,
      //   };
      // }
      if (JSON.stringify(oldCcTitles) !== JSON.stringify(newCcTitles)) {
        changes['نسخة لـ'] = {
          before: oldCcTitles,
          after: newCcTitles,
        };
      }
      if (JSON.stringify(oldDeptNames) !== JSON.stringify(newDeptNames)) {
        changes['إعادة توجيه إلى'] = {
          before: oldDeptNames,
          after: newDeptNames,
        };
      }
      if (oldCategoryName !== newCategoryName) {
        changes['اسم المجلد'] = {
          before: oldCategoryName,
          after: newCategoryName,
        };
      }
      if (existing.notes !== updatedMail.notes) {
        changes['الملاحظات'] = {
          before: existing.notes,
          after: updatedMail.notes,
        };
      }
      if (existing.isSecret !== updatedMail.isSecret) {
        changes['بريد سري'] = {
          before: existing.isSecret,
          after: updatedMail.isSecret,
        };
      }
      if (existing.fileUrl !== updatedMail.fileUrl) {
        changes['نسخة من البريد'] = {
          before: existing.fileUrl,
          after: updatedMail.fileUrl,
        };
      }
      if (existing.instructionsUrl !== updatedMail.instructionsUrl) {
        changes['التوجيهات'] = {
          before: existing.instructionsUrl,
          after: updatedMail.instructionsUrl,
        };
      }
      if (existing.receiptExternalUrl !== updatedMail.receiptExternalUrl) {
        changes['إيصال الاستلامات الخارجية'] = {
          before: existing.receiptExternalUrl,
          after: updatedMail.receiptExternalUrl,
        };
      }
      if (existing.receiptLocalUrl !== updatedMail.receiptLocalUrl) {
        changes['إيصال الاستلامات الداخلية'] = {
          before: existing.receiptLocalUrl,
          after: updatedMail.receiptLocalUrl,
        };
      }
      if (String(existing.dueDate) !== String(updatedMail.dueDate)) {
        changes['تاريخ الإنجاز المتوقع'] = {
          before: existing.dueDate,
          after: updatedMail.dueDate,
        };
      }

      // 7) Finally, write the audit‐log entry
      await logAudit(TableNames.MAIL, input.mailId, userId, changes);

      return { updatedMail };
    }),

  settigs: protectedProcedure
    .input(settingsMailSchema)
    .mutation(async ({ input, ctx }) => {
      const { id: userId, canUpdate } = ctx.user;

      if (!canUpdate) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك بتعديل الإعدادات',
        });
      }

      // 1) Read the existing row
      const [existing] = await db
        .select({
          subject: mails.subject,
          senderId: mails.senderId,
          receiverId: mails.receiverId,
          attachments: mails.attachments,
        })
        .from(mails)
        .where(eq(mails.id, input.mailId));

      if (!existing) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'البريد غير موجود' });
      }

      // 2) Fetch old & new sender name
      const oldSenderName = existing.senderId
        ? ((
            await db
              .select({ jobTitle: contacts.jobTitle })
              .from(contacts)
              .where(eq(contacts.id, existing.senderId))
          )[0]?.jobTitle ?? null)
        : null;
      const newSenderName = input.senderId
        ? ((
            await db
              .select({ jobTitle: contacts.jobTitle })
              .from(contacts)
              .where(eq(contacts.id, input.senderId))
          )[0]?.jobTitle ?? null)
        : null;

      // 3) Fetch old & new receiver name
      const oldReceiverName = existing.receiverId
        ? ((
            await db
              .select({ jobTitle: contacts.jobTitle })
              .from(contacts)
              .where(eq(contacts.id, existing.receiverId))
          )[0]?.jobTitle ?? null)
        : null;
      const newReceiverName = input.receiverId
        ? ((
            await db
              .select({ jobTitle: contacts.jobTitle })
              .from(contacts)
              .where(eq(contacts.id, input.receiverId))
          )[0]?.jobTitle ?? null)
        : null;

      // 4) Perform the actual update
      const [updatedMail] = await db
        .update(mails)
        .set({
          subject: input.subject,
          senderId: input.senderId,
          receiverId: input.receiverId,
          attachments: input.attachments,
        })
        .where(buildMailPermissionFilter(input.mailId, userId, canUpdate))
        .returning();

      if (!updatedMail) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'البريد غير موجود أو لا تملك صلاحية التعديل',
        });
      }

      // 5) Compute a human‐friendly “diff”
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const changes: Record<string, { before: any; after: any }> = {};

      if (existing.subject !== updatedMail.subject) {
        changes['الموضوع'] = {
          before: existing.subject,
          after: updatedMail.subject,
        };
      }
      if (oldSenderName !== newSenderName) {
        changes['المرسل'] = {
          before: oldSenderName,
          after: newSenderName,
        };
      }
      if (oldReceiverName !== newReceiverName) {
        changes['المستلم'] = {
          before: oldReceiverName,
          after: newReceiverName,
        };
      }
      if (existing.attachments !== updatedMail.attachments) {
        changes['عدد المرفقات'] = {
          before: existing.attachments,
          after: updatedMail.attachments,
        };
      }

      // 7) Finally, write the audit‐log entry
      await logAudit(TableNames.MAIL, input.mailId, userId, changes);

      return { updatedMail };
    }),

  remove: protectedProcedure
    .input(z.object({ mailId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId, canDelete } = ctx.user;

      if (!canDelete) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'غير مصرح لك بحذف البريد',
        });
      }

      const [deletedMail] = await db
        .delete(mails)
        .where(buildMailPermissionFilter(input.mailId, userId, canDelete))
        .returning({ id: mails.id });

      if (!deletedMail) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'البريد غير موجود أو لا تملك صلاحية الحذف',
        });
      }

      return { deletedMail };
    }),
});
