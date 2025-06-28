import { usersRouter } from '@/modules/secretary/users/server/procedures';
import { mailsRouter } from '@/modules/secretary/mails/server/procedures';
import { summaryRouter } from '@/modules/secretary/summary/server/procedures';
import { contactsRouter } from '@/modules/secretary/contacts/server/procedures';
import { documentsRouter } from '@/modules/secretary/documents/server/procedures';
import { categoriesRouter } from '@/modules/secretary/categories/server/procedures';
import { departmentsRouter } from '@/modules/secretary/departments/server/procedures';
import { authRouter } from '@/modules/auth/server/procedures';

import { createTRPCRouter } from '../init';
import { auditRouter } from '@/modules/secretary/audit/server/procedures';
import { trackingRouter } from '@/modules/secretary/tracking/server/procedures';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  users: usersRouter,
  mails: mailsRouter,
  audit: auditRouter,
  summary: summaryRouter,
  tracking: trackingRouter,
  contacts: contactsRouter,
  documents: documentsRouter,
  categories: categoriesRouter,
  departments: departmentsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
