import {
  pgTable,
  text,
  timestamp,
  boolean,
  primaryKey,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';
import { contacts, receivers } from './contacts';
import { categories } from './categories';
import { departments } from './departments';
import { types, mailStatuses } from './enums';

export const mails = pgTable(
  'mail',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId').references(() => users.id, { onDelete: 'restrict' }),
    subject: text('subject').notNull(),
    type: types('type').notNull(),
    senderId: text('senderId')
      .references(() => contacts.id, { onDelete: 'restrict' })
      .notNull(),
    receiverId: text('receiverId')
      .references(() => contacts.id, { onDelete: 'restrict' })
      .notNull(),

    categoryId: text('categoryId').references(() => categories.id, {
      onDelete: 'restrict',
    }),

    cc: text('cc')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    forwardTo: text('forward_to')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),

    refNum: text('ref_num'),
    attachments: text('attachments'),
    notes: text('notes'),
    status: mailStatuses('status').default('todo').notNull(),
    fileUrl: text('file_url'),
    instructionsUrl: text('instructions_url'),
    receiptExternalUrl: text('receipt_external_url'),
    receiptLocalUrl: text('receipt_local_url'),
    docxUrl: text('docx_url'),
    departmentId: text('departmentId')
      .notNull()
      .references(() => departments.id, { onDelete: 'restrict' }),
    isSecret: boolean('is_secret').default(false),
    dueDate: timestamp('due_date', { mode: 'date' }),
    establishedDate: timestamp('established_date', { mode: 'date' }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => ({
    refNumIndex: uniqueIndex('mail_ref_num_idx').on(table.refNum),
  })
);

export const mailCcs = pgTable(
  'mailCc',
  {
    mailId: text('mailId')
      .notNull()
      .references(() => mails.id, { onDelete: 'cascade' }),
    ccId: text('ccId')
      .notNull()
      .references(() => contacts.id),
  },
  table => ({
    pk: primaryKey({ columns: [table.mailId, table.ccId] }),
  })
);

export const mailDepartments = pgTable(
  'mailDepartment',
  {
    mailId: text('mailId')
      .notNull()
      .references(() => mails.id, { onDelete: 'cascade' }),
    departmentId: text('departmentId')
      .notNull()
      .references(() => departments.id),
  },
  table => ({
    pk: primaryKey({ columns: [table.mailId, table.departmentId] }),
  })
);

export const mailsRelations = relations(mails, ({ one, many }) => ({
  user: one(users, { fields: [mails.userId], references: [users.id] }),

  sender: one(contacts, {
    fields: [mails.senderId],
    references: [contacts.id],
  }),
  receiver: one(receivers, {
    fields: [mails.receiverId],
    references: [receivers.id],
  }),
  category: one(categories, {
    fields: [mails.categoryId],
    references: [categories.id],
  }),
  department: one(departments, {
    fields: [mails.departmentId],
    references: [departments.id],
  }),

  ccs: many(mailCcs),
  departments: many(mailDepartments),
}));

export const mailCcsRelations = relations(mailCcs, ({ one }) => ({
  mail: one(mails, { fields: [mailCcs.mailId], references: [mails.id] }),
  cc: one(contacts, { fields: [mailCcs.ccId], references: [contacts.id] }),
}));

export const mailDepartmentsRelations = relations(
  mailDepartments,
  ({ one }) => ({
    mail: one(mails, {
      fields: [mailDepartments.mailId],
      references: [mails.id],
    }),
    department: one(departments, {
      fields: [mailDepartments.departmentId],
      references: [departments.id],
    }),
  })
);
