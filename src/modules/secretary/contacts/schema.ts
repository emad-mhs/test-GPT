import { z } from 'zod';
import { ContactTypes } from './types';

// نوع جهة الاتصال (enum)
const typeSchema = z.nativeEnum(ContactTypes, {
  errorMap: () => ({ message: 'نوع جهة الاتصال غير صالح' }),
});

// مسمى الوظيفة
const jobTitleSchema = z
  .string()
  .trim()
  .min(1, { message: 'مسمى الوظيفة مطلوب' })
  .max(100, { message: 'طول المسمى طويل جدًا' });

// الاسم (اختياري)
const nameSchema = z
  .string()
  .trim()
  // .min(1, { message: 'الاسم لا يمكن أن يكون فارغًا' })
  // .max(100, { message: 'الاسم طويل جدًا' })
  .optional();

// البريد الإلكتروني (اختياري)
const emailSchema = z
  .string()
  .trim()
  // .email({ message: 'البريد الإلكتروني غير صالح' })
  .optional();

// رقم الهاتف (اختياري)
const phoneSchema = z
  .string()
  .trim()
  // .min(8, { message: 'رقم الهاتف غير صالح' })
  // .max(20, { message: 'رقم الهاتف طويل جدًا' })
  .optional();

// الحقول المشتركة بين الإدخال والتعديل
const contactBaseSchema = z.object({
  type: typeSchema,
  jobTitle: jobTitleSchema,
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

// الإدخال (بدون id)
export const contactInsertSchema = contactBaseSchema;
export type ContactInsertInput = z.infer<typeof contactInsertSchema>;

// التعديل (يضيف id)
export const contactUpdateSchema = contactBaseSchema.extend({
  contactId: z.string().uuid({ message: 'معرّف جهة الاتصال غير صالح' }),
});
export type ContactUpdateInput = z.infer<typeof contactUpdateSchema>;
