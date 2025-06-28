export interface Mail {
  id: string;
  subject: string;
  type: MailTypes;
  sender: string;
  receiver: string;
  createdAt: string | Date;
  refNum: string | null;
  status: MailStatuses;
}

// Enums
export enum MailStatuses {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  EMERGENCY = 'emergency',
  CANCELED = 'canceled',
}

export enum MailTypes {
  OUTGOING = 'outgoing',
  INCOMING = 'incoming',
  LOCAL_OUTGOING = 'local_outgoing',
  LOCAL_INCOMING = 'local_incoming',
  PERSONAL = 'personal',
  DOCUMENT = 'document',
}

// Label Mappings
export const MAIL_TYPES: { label: string; value: MailTypes }[] = [
  { label: 'الصادر', value: MailTypes.OUTGOING },
  { label: 'الوارد', value: MailTypes.INCOMING },
  { label: 'الصادر الداخلي', value: MailTypes.LOCAL_OUTGOING },
  { label: 'الوارد الداخلي', value: MailTypes.LOCAL_INCOMING },
  { label: 'شخصي', value: MailTypes.PERSONAL },
];

export const MAIL_STATUSES: { label: string; value: MailStatuses }[] = [
  { label: 'في الانتظار', value: MailStatuses.TODO },
  { label: 'قيد المعالجة', value: MailStatuses.IN_PROGRESS },
  { label: 'مكتمل', value: MailStatuses.DONE },
  { label: 'هام وعاجل', value: MailStatuses.EMERGENCY },
  { label: 'صرف النظر عنه', value: MailStatuses.CANCELED },
];
