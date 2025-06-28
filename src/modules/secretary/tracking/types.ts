import { MailTypes } from '../mails/types';

export interface TrackingMail {
  id: string;
  subject: string;
  type: MailTypes;
  dueDate: Date | null;
  sender: string;
  receiver: string;
  ccList: string[];
  departmentList: string[];
}
