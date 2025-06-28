import {
  pgTable,
  text,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userRoles } from './enums';
import { departments } from './departments';

export const users = pgTable(
  'user',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    emailVerified: timestamp('email_verified', { mode: 'date' }),
    imageUrl: text('image_url'),
    password: text('password'),
    departmentId: text('departmentId')
      .notNull()
      .references(() => departments.id),
    role: userRoles('role').default('user').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    isOAuth: boolean('is_oAuth').default(false).notNull(),
    canAdd: boolean('can_add').default(false).notNull(),
    canUpdate: boolean('can_update').default(false).notNull(),
    canDelete: boolean('can_delete').default(false).notNull(),
    isTwoFactorEnabled: boolean('is_two_factor_enabled')
      .default(false)
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    lastLoginAt: timestamp('last_login_at', { mode: 'date' }),
  },
  table => ({
    emailIndex: uniqueIndex('email_idx').on(table.email),
  })
);

export const userDepartmentsRelations = relations(users, ({ one }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
}));
