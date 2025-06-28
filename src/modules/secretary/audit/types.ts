export interface ChangeEntry {
  before: unknown;
  after: unknown;
}

export interface AuditLog {
  id: string;
  tableName: string;
  recordId: string;
  // user: string; // the name of the user who made the change
  userId: string;
  createdAt: Date; // drizzle timestamp → Date
  changes: Record<string, { before?: unknown; after?: unknown }>;
  // if you kept `entityLabel` in your select:
  entityLabel?: string | null;
}

// Enums
export enum TableNames {
  MAIL = 'mail',
  DOCUMENT = 'document',
  CONTACT = 'contact',
  CATEGORY = 'category',
  USER = 'user',
}

// Label Mappings
export const TABLE_NAME_TYPES: { label: string; value: TableNames }[] = [
  { label: 'البريد', value: TableNames.MAIL },
  { label: 'الوثائق', value: TableNames.DOCUMENT },
  { label: 'جهات الاتصال', value: TableNames.CONTACT },
  { label: 'المجلدات', value: TableNames.CATEGORY },
  { label: 'المستخدمون', value: TableNames.USER },
];
