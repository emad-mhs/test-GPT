import { db } from '@/db';
import { auditLogs } from '@/db/schema';

/**
 * يسجل حدث تدقيق لأي جدول
 * @param tableName اسم الجدول (مثلاً 'mail')
 * @param recordId معرف السجل المعدل
 * @param userId معرف المستخدم الذي قام بالتعديل
 * @param changes كائن JSON يصف الحقول القديمة والجديدة
 */
export async function logAudit(
  tableName: string,
  recordId: string,
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes: Record<string, { before: any; after: any }>
) {
  await db.insert(auditLogs).values({
    tableName,
    recordId,
    userId,
    changes,
  });
}
