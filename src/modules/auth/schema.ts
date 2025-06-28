import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(6, { message: 'الحد الأدنى 6 أحرف مطلوب' })
  .max(128, { message: 'كلمة المرور طويلة جدًا' });

const emailSchema = z
  .string()
  .email({ message: 'البريد الإلكتروني غير صالح' })
  .transform(s => s.trim());

export const newPasswordSchema = z.object({
  password: passwordSchema,
  token: z.string().nonempty({ message: 'رمز التحقق مطلوب' }),
});

export type NewPasswordInput = z.infer<typeof newPasswordSchema>;

export const resetSchema = z.object({
  email: emailSchema,
});

export type ResetInput = z.infer<typeof resetSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  // code: z.string().optional(),
  code: z
    .string()
    .length(6, { message: 'الرمز يجب أن يتكون من 6 أرقام' })
    .regex(/^[0-9]{6}$/, { message: 'الرمز يجب أن يحتوي على أرقام فقط' })
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z
    .string()
    .min(1, { message: 'الاسم مطلوب' })
    .transform(s => s.trim()),
});

export type RegisterInput = z.infer<typeof registerSchema>;
