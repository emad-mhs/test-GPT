import {
  pgTable,
  text,
  integer,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { AdapterAccount } from 'next-auth/adapters';
import { users } from './users';

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable('verificationToken', {
  id: text('id')
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  email: text('email').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const passwordResetTokens = pgTable('passwordResetToken', {
  id: text('id')
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  email: text('email'),
  token: text('token'),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const twoFactorTokens = pgTable('twoFactorToken', {
  id: text('id')
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  email: text('email'),
  token: text('token'),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const twoFactorConfirmations = pgTable('twoFactorConfirmation', {
  id: text('id')
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  userId: text('userId').references(() => users.id, {
    onDelete: 'cascade',
  }),
});
