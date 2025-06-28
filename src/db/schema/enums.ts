import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoles = pgEnum('user_roles', [
  'admin',
  'manager',
  'employee',
  'user',
]);
export const mailStatuses = pgEnum('mail_statuses', [
  'todo',
  'in_progress',
  'emergency',
  'done',
  'canceled',
]);
export const types = pgEnum('types', [
  'outgoing',
  'incoming',
  'local_outgoing',
  'local_incoming',
  'personal',
  'document',
]);
export const contactTypes = pgEnum('contact_type', ['internal', 'external']);
