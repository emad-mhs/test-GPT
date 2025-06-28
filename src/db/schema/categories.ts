import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { departments } from './departments';

export const categories = pgTable(
  'category',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),

    departmentId: text('departmentId')
      .notNull()
      .references(() => departments.id, { onDelete: 'restrict' }),

    name: text('name').notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => ({
    uniqueNamePerDept: uniqueIndex('category_name_department_idx').on(
      table.name,
      table.departmentId
    ),
  })
);

export const categoriesRelations = relations(categories, ({ one }) => ({
  user: one(users, {
    fields: [categories.userId],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [categories.departmentId],
    references: [departments.id],
  }),
}));
