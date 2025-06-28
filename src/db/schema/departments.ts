import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';
import { mailDepartments } from './mails';

export const departments = pgTable(
  'department',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    rank: text('rank').notNull(),
    name: text('name').notNull(),
    manager: text('manager'),
    email: text('email'),
    phone: text('phone'),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => ({
    nameIndex: uniqueIndex('department_name_idx').on(table.name),
    rankIndex: uniqueIndex('department_rank_idx').on(table.rank),
  })
);

export const departmentsRelations = relations(departments, ({ many }) => ({
  users: many(users),
  mailDepartments: many(mailDepartments),
}));
