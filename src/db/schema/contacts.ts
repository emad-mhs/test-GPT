import { alias, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { mailCcs } from './mails';
import { departments } from './departments';
import { contactTypes } from './enums';

export const contacts = pgTable('contact', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'restrict' }),

  departmentId: text('departmentId')
    .notNull()
    .references(() => departments.id, { onDelete: 'restrict' }),

  jobTitle: text('job_title').notNull(),
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  type: contactTypes('type').default('external').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  user: one(users, {
    fields: [contacts.userId],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [contacts.departmentId],
    references: [departments.id],
  }),
  mailToCc: many(mailCcs),
}));

export const receivers = alias(contacts, 'receiver');
