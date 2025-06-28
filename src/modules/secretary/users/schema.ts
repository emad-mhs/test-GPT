import { z } from 'zod';
import { UserRoles } from '@/modules/auth/types';

// 👤 حقل الاسم
const nameSchema = z
  .string()
  .trim()
  .min(1, { message: 'الاسم مطلوب' })
  .max(100, { message: 'الاسم طويل جدًا' });

// 📧 حقل البريد الإلكتروني
const emailSchema = z
  .string()
  .trim()
  .email({ message: 'البريد الإلكتروني غير صالح' })
  .max(255, { message: 'البريد الإلكتروني طويل جدًا' });

// 🏢 حقل القسم
const departmentIdSchema = z
  .string()
  .trim()
  .min(1, { message: 'القسم مطلوب' })
  .uuid({ message: 'معرّف القسم غير صالح' });

// 🚦 حقل الدور
const roleSchema = z.nativeEnum(UserRoles, {
  errorMap: () => ({ message: 'الدور غير صالح' }),
});

// 🔒 صلاحيات إضافية
const permissionSchema = z.boolean().optional();

// 🔐 حقل كلمة المرور
const passwordSchema = z
  .string()
  .min(6, { message: 'كلمة المرور يجب أن تكون على الأقل 6 أحرف' })
  .max(20, { message: 'كلمة المرور يجب ألا تتجاوز 20 حرفًا' });

// 🎨 مسار الصورة أو كائن File
const imageUrlSchema = z
  .union([
    z.instanceof(File),
    z
      .string()
      .trim()
      .transform(s => (s === '' ? undefined : s)),
  ])
  .optional();

const baseUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  departmentId: departmentIdSchema,
  role: roleSchema,
  isTwoFactorEnabled: permissionSchema,
  canAdd: permissionSchema,
  canUpdate: permissionSchema,
  canDelete: permissionSchema,
});

export const userInsertSchema = baseUserSchema.extend({
  password: passwordSchema,
});
export type UserInsertInput = z.infer<typeof userInsertSchema>;

export const userUpdateSchema = baseUserSchema.extend({
  id: z.string().uuid({ message: 'معرّف المستخدم غير صالح' }),
});
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;

export const profileUpdateSchema = z
  .object({
    id: z.string().uuid({ message: 'معرّف المستخدم غير صالح' }),
    name: nameSchema,
    email: emailSchema,
    departmentId: departmentIdSchema,
    isTwoFactorEnabled: permissionSchema,
    imageUrl: imageUrlSchema,
    password: z
      .string()
      .min(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
      .optional(),
    newPassword: z
      .string()
      .min(6, { message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' })
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const allPasswordFieldsFilled =
      !!data.password && !!data.newPassword && !!data.confirmPassword;

    const anyPasswordFieldFilled =
      data.password || data.newPassword || data.confirmPassword;

    if (anyPasswordFieldFilled && !allPasswordFieldsFilled) {
      ctx.addIssue({
        path: ['password'],
        code: z.ZodIssueCode.custom,
        message: 'يجب تعبئة كل حقول كلمة المرور لتحديثها',
      });
    }

    if (
      data.newPassword &&
      data.confirmPassword &&
      data.newPassword !== data.confirmPassword
    ) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: 'كلمة المرور غير متطابقة',
      });
    }
  });

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
