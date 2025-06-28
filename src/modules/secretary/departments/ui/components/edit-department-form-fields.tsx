'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { DepartmentUpdateInput } from '../../schema';

type Props = {
  form: UseFormReturn<DepartmentUpdateInput>;
  isDisabled?: boolean;
};

const fields: {
  name: keyof DepartmentUpdateInput;
  label: string;
  placeholder: string;
}[] = [
  {
    name: 'name',
    label: 'اسم الإدارة',
    placeholder: 'مثال: مكتب الوزير، مكتب النائب...',
  },
  {
    name: 'rank',
    label: 'الرقم المميز',
    placeholder: 'رقم الإدارة 123-**-2024',
  },
  { name: 'manager', label: 'المدير العام', placeholder: 'اسم مدير الإدارة' },
  { name: 'email', label: 'الإيميل', placeholder: 'example@gmail.com' },
  { name: 'phone', label: 'الهاتف', placeholder: '782510524' },
];

export const EditDepartmentFormFields = ({ form, isDisabled }: Props) => {
  return (
    <>
      {fields.map(field => (
        <FormField
          key={field.name}
          name={field.name}
          control={form.control}
          render={({ field: controller }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Input
                  {...controller}
                  value={controller.value ?? ''}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  );
};
