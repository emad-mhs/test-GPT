import { z } from 'zod';

// مجرد صيغة لملف أو رابط (File object أو URL فارغ)
export const fileSchema = z
  .union([
    z.instanceof(File),
    z
      .string()
      .trim()
      .transform(value => (value === '' ? undefined : value)),
  ])
  .optional();

// عنوان الوثيقة
export const subjectSchema = z
  .string()
  .trim()
  .min(5, { message: 'يجب أن يحتوي العنوان على 5 أحرف على الأقل.' })
  .max(255, { message: 'العنوان طويل جدًا' });

// معرّف الفئة
export const categoryIdSchema = z
  .string()
  .uuid({ message: 'معرّف الفئة غير صالح' });

// ملاحظات اختيارية
export const notesSchema = z
  .string()
  .trim()
  .max(1000, { message: 'الملاحظات طويلة جدًا' })
  .optional();

const baseDocumentSchema = z.object({
  subject: subjectSchema,
  categoryId: categoryIdSchema,
  notes: notesSchema,
  fileUrl: fileSchema,
});

export const documentInsertSchema = baseDocumentSchema;
export type DocumentInsertInput = z.infer<typeof documentInsertSchema>;

export const documentUpdateSchema = documentInsertSchema.extend({
  documentId: z.string().uuid({ message: 'معرّف الوثيقة غير صالح' }),
});
export type DocumentUpdateInput = z.infer<typeof documentUpdateSchema>;
