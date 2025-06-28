import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { categories } from './categories';
import { types } from './enums';
import { departments } from './departments';

export const documents = pgTable('document', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId').references(() => users.id, { onDelete: 'restrict' }),
  departmentId: text('departmentId')
    .notNull()
    .references(() => departments.id, { onDelete: 'restrict' }),
  subject: text('subject').notNull(),
  type: types('type').default('document').notNull(),
  categoryId: text('categoryId').references(() => categories.id, {
    onDelete: 'restrict',
  }),
  notes: text('notes'),
  fileUrl: text('file_url'),
  isSecret: boolean('is_secret').default(false),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),

  department: one(departments, {
    fields: [documents.departmentId],
    references: [departments.id],
  }),

  category: one(categories, {
    fields: [documents.categoryId],
    references: [categories.id],
  }),
}));
