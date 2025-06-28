import { z } from 'zod';

// الحقول المشتركة بين الإدخال والتعديل
const categoryBaseSchema = z.object({
  name: z.string().trim().min(1, 'هذا الحقل مطلوب').max(100, 'الاسم طويل جدًا'),
});

// مخطط الإدخال (لإنشاء تصنيف)
export const categoryInsertSchema = categoryBaseSchema;
export type CategoryInsertInput = z.infer<typeof categoryInsertSchema>;

// مخطط التعديل (يتضمن الـ id)
export const categoryUpdateSchema = categoryBaseSchema.extend({
  id: z.string().uuid({ message: 'معرّف التصنيف غير صالح' }),
});
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
