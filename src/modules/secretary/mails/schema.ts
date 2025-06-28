import { z } from 'zod';
import { MailStatuses, MailTypes } from './types';

// 📄 العنوان
export const subjectSchema = z
  .string()
  .trim()
  .min(5, { message: 'يجب أن يحتوي العنوان على 5 أحرف على الأقل.' })
  .max(255, { message: 'العنوان طويل جدًا' });

// 📧 المُرسِل والمُستلِم
const idSchema = z.string().uuid({ message: 'معرّف غير صالح' });

// 👥 CC & Forward
export const ccSchema = z.array(z.object({ id: idSchema }));
export const forwardToSchema = z.array(
  z.object({
    department: z.string().uuid({ message: 'معرّف الإدارة غير صالح' }),
  })
);

// 📎 المرفقات (File object أو URL أو فارغ)
export const fileSchema = z
  .union([
    z.instanceof(File),
    z
      .string()
      .trim()
      .transform(s => (s === '' ? undefined : s)),
  ])
  .optional();

// 📎 عدد المرفقات
export const attachmentsSchema = z
  .string()
  .trim()
  .max(10, { message: 'رقم المرفقات طويل جدًا' })
  .optional();

// 📑 رقم الإحالة
export const refNumSchema = z
  .string()
  .trim()
  .max(50, { message: 'رقم الإحالة طويل جدًا' })
  .optional();

// 📝 الملاحظات
export const notesSchema = z
  .string()
  .trim()
  .max(1000, { message: 'الملاحظات طويلة جدًا' })
  .optional();

// 📅 تاريخ الاستحقاق
export const dueDateSchema = z.coerce
  .date({ invalid_type_error: 'تاريخ غير صالح' })
  .optional();

// 🔢 نوع البريد والحالة
export const typeSchema = z.nativeEnum(MailTypes, {
  errorMap: () => ({ message: 'نوع البريد غير صالح' }),
});
export const statusSchema = z.nativeEnum(MailStatuses, {
  errorMap: () => ({ message: 'الحالة غير صالحة' }),
});

// Main insert schema
export const mailInsertSchema = z.object({
  subject: subjectSchema,
  type: typeSchema,
  senderId: idSchema,
  receiverId: idSchema,
  cc: ccSchema,
  forwardTo: forwardToSchema,
  categoryId: z.string().uuid({ message: 'معرّف الفئة غير صالح' }).optional(),
  attachments: attachmentsSchema,
  refNum: refNumSchema,
  notes: notesSchema,
  isSecret: z.boolean().optional(),
  fileUrl: fileSchema,
});

export type MailInsertInput = z.infer<typeof mailInsertSchema>;

// Update schema for existing mail
export const mailUpdateSchema = z.object({
  mailId: idSchema,
  status: statusSchema,
  cc: ccSchema,
  forwardTo: forwardToSchema,
  categoryId: z.string().uuid({ message: 'معرّف الفئة غير صالح' }).optional(),
  notes: notesSchema,
  isSecret: z.boolean().optional(),
  fileUrl: fileSchema,
  instructionsUrl: fileSchema,
  receiptExternalUrl: fileSchema,
  receiptLocalUrl: fileSchema,
  dueDate: dueDateSchema,
});

export type MailUpdateInput = z.infer<typeof mailUpdateSchema>;

// Schema used in settings form
export const settingsMailSchema = z.object({
  mailId: idSchema,
  subject: subjectSchema,
  senderId: idSchema,
  receiverId: idSchema,
  attachments: attachmentsSchema,
});

export type SettingsMailInput = z.infer<typeof settingsMailSchema>;
