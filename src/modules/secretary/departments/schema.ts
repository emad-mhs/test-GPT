import { z } from 'zod';

// أسماء الحقول مع التحقق
const nameSchema = z
  .string()
  .trim()
  .min(1, 'اسم القسم مطلوب')
  .max(100, 'اسم القسم طويل جدًا');

const rankSchema = z
  .string()
  .trim()
  .min(1, 'الترتيب مطلوب')
  .max(3, 'الترتيب طويل جدًا');

const managerSchema = z
  .string()
  .trim()
  .min(1, 'اسم المدير مطلوب')
  .max(100, 'اسم المدير طويل جدًا')
  .optional()
  .or(z.literal(''));

const emailSchema = z
  .string()
  .trim()
  .email('صيغة الإيميل غير صحيحة')
  .optional()
  .or(z.literal(''));

const phoneSchema = z
  .string()
  .trim()
  .min(7, 'رقم الهاتف غير صالح')
  .max(15, 'رقم الهاتف طويل جدًا')
  .optional()
  .or(z.literal(''));

// الحقول المشتركة مع التحقق من البريد والهاتف
const baseDepartmentSchema = {
  name: nameSchema,
  rank: rankSchema,
  manager: managerSchema,
  email: emailSchema,
  phone: phoneSchema,
  // phone: z
  //   .string()
  //   .regex(/^\d{7,15}$/, 'رقم الهاتف غير صالح')
  //   .optional()
  //   .or(z.literal('')), // للسماح بالحقل الفارغ
};

// مخطط الإدخال
export const departmentInsertSchema = z.object(baseDepartmentSchema);
export type DepartmentInsertInput = z.infer<typeof departmentInsertSchema>;

// مخطط التحديث
export const departmentUpdateSchema = departmentInsertSchema.extend({
  id: z.string().uuid('معرّف الإدارة غير صالح'),
});
export type DepartmentUpdateInput = z.infer<typeof departmentUpdateSchema>;
