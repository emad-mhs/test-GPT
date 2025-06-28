// import { MailTypes } from '../mails/types';

// export type Document = {
//   id: string;
//   jobTitle: string;
//   name: string | null;
//   email: string | null;
//   phone: string | null;
//   createdAt: Date;
//   user: string;
// };

export interface Document {
  id: string;
  subject: string;
  notes: string | null;
  category: string | null;
  categoryId: string | null;
  userId: string | null;
  createdAt: Date;
}
