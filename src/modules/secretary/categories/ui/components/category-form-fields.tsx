'use client';

import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { CategoryInsertInput } from '../../schema';

type Props = {
  form: UseFormReturn<CategoryInsertInput>;
  isDisabled?: boolean;
};

export const CategoryFormFields = ({ form, isDisabled }: Props) => {
  return (
    <FormField
      name='name'
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>اسم المجلد</FormLabel>
          <FormControl>
            <Input
              {...field}
              disabled={isDisabled}
              placeholder='مثال: حديد الخردة، الأمن الغذائي، الأدوية...'
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
