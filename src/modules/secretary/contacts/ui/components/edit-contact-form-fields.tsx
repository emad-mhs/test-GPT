'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ContactUpdateInput } from '../../schema';
import { Contact_TYPES } from '../../types';

type Props = {
  form: UseFormReturn<ContactUpdateInput>;
  isAdmin: boolean;
  isDisabled?: boolean;
};

const fields: {
  name: keyof ContactUpdateInput;
  label: string;
  placeholder: string;
}[] = [
  {
    name: 'jobTitle',
    label: 'المسمى الوظيفي',
    placeholder: 'مثال: وزير، نائب، وكيل...',
  },
  { name: 'name', label: 'الاسم', placeholder: 'عماد' },
  { name: 'email', label: 'الإيميل', placeholder: 'example@gmail.com' },
  { name: 'phone', label: 'الهاتف', placeholder: '771972683' },
];

export const EditContactFormFields = ({ form, isAdmin, isDisabled }: Props) => {
  return (
    <>
      {isAdmin && (
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع جهة الاتصال</FormLabel>
              <FormControl>
                <Select
                  dir='rtl'
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isDisabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='اختر نوع جهة الاتصال' />
                  </SelectTrigger>
                  <SelectContent>
                    {Contact_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
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
