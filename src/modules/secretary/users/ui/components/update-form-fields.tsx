// components/users/UserFormFields.tsx
'use client';

import { FC } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import type { UseFormReturn } from 'react-hook-form';
import { UserRoles } from '@/modules/auth/types';
import { UserUpdateInput } from '../../schema';
import { DepartmentOption } from '@/modules/secretary/departments/types';
import { SelectSwitcher } from '@/components/select-switcher';
import { useCreateDepartmentModal } from '@/modules/secretary/departments/hooks/use-create-department-modal';

export interface UserFormFieldsProps {
  form: UseFormReturn<UserUpdateInput>;
  departments: DepartmentOption[];
  isPending: boolean;
}

export const UpdateFormFields: FC<UserFormFieldsProps> = ({
  form,
  departments,
  isPending,
}) => {
  const newDepartment = useCreateDepartmentModal();

  return (
    <>
      {/* Name */}
      <FormField
        control={form.control}
        name='name'
        render={({ field }) => (
          <FormItem>
            <FormLabel>الاسم</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value}
                disabled={isPending}
                placeholder='عماد'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>الإيميل</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value}
                disabled={isPending}
                placeholder='example@gmail.com'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Department Select */}
      <FormField
        control={form.control}
        name='departmentId'
        render={({ field }) => (
          <FormItem>
            <FormLabel>الإدارة</FormLabel>
            <FormControl>
              <SelectSwitcher
                value={field.value}
                options={departments}
                placeholder='اختر اسم الإدارة'
                listHeading='الإدارات'
                createLabel='إنشاء إدارة'
                onChangeAction={field.onChange}
                onOpenAction={newDepartment.open}
                disabled={isPending}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Role Select */}
      <FormField
        control={form.control}
        name='role'
        render={({ field }) => (
          <FormItem>
            <FormLabel>صلاحية المستخدم</FormLabel>
            <FormControl>
              <Select
                dir='rtl'
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder='حدد دور المستخدم' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRoles.ADMIN}>آدمن</SelectItem>
                  <SelectItem value={UserRoles.MANAGER}>مدير</SelectItem>
                  <SelectItem value={UserRoles.EMPLOYEE}>موظف</SelectItem>
                  <SelectItem value={UserRoles.USER}>مستخدم</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Boolean switches */}
      {(
        ['isTwoFactorEnabled', 'canAdd', 'canUpdate', 'canDelete'] as const
      ).map(fieldName => {
        const labelMap: Record<typeof fieldName, [string, string?]> = {
          isTwoFactorEnabled: [
            'المصادقة الثنائية',
            'تفعيل التحقق بخطوتين وإرسال رمز عبر الإيميل',
          ],
          canAdd: ['صلاحيات الإضافة', 'يمكنه إضافة البريد والمجلدات والوثائق'],
          canUpdate: [
            'صلاحيات التعديل',
            'يمكنه التعديل على البريد والمجلدات والوثائق',
          ],
          canDelete: ['صلاحيات الحذف', 'يمكنه حذف البريد والمجلدات والوثائق'],
        };
        const [label, desc] = labelMap[fieldName];
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem className='flex items-center justify-between rounded-lg border border-input p-3 shadow-xs'>
                <div className='space-y-0.5'>
                  <FormLabel>{label}</FormLabel>
                  {desc && <FormDescription>{desc}</FormDescription>}
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      })}
    </>
  );
};
