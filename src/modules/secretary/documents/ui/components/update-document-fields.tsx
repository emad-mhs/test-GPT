'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { DocumentUpdateInput } from '../../schema';
import { Textarea } from '@/components/ui/textarea';
import { SelectSwitcher } from '@/components/select-switcher';
import { useCreateCategoryModal } from '@/modules/secretary/categories/hooks/use-create-category-modal';
import { LucideFileText } from 'lucide-react';
import { useRef, useState } from 'react';
import { AttachmentField } from '@/components/attachment-field';
import { CategoryOption } from '@/modules/secretary/categories/types';

type Props = {
  form: UseFormReturn<DocumentUpdateInput>;
  isDisabled: boolean;
  editable: boolean;
  categories: CategoryOption[];
};

export const UpdateFormFields = ({
  form,
  editable,
  categories,
  isDisabled,
}: Props) => {
  const newCategory = useCreateCategoryModal();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState(false);

  return (
    <>
      <FormField
        name='subject'
        control={form.control}
        render={({ field }) => (
          <FormItem className='lg:max-w-md'>
            <FormLabel>عنوان الوثيقة</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value}
                disabled={isDisabled}
                placeholder='الموضوع/...'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AttachmentField
        name='fileUrl'
        label='نسخة من الوثيقة'
        icon={<LucideFileText className='size-[36px] text-neutral-400' />}
        preview={previewFile}
        setPreview={setPreviewFile}
        inputRef={inputFileRef}
        editable={editable}
        isPending={isDisabled}
        control={form.control}
      />

      <FormField
        name='categoryId'
        control={form.control}
        render={({ field }) => (
          <FormItem className='lg:max-w-md'>
            <FormLabel>اسم المجلد</FormLabel>
            <FormControl>
              <SelectSwitcher
                value={field.value}
                options={categories}
                placeholder='اختر مجلد لتصنيف هذه الوثيقة'
                listHeading='المجلدات'
                createLabel='إنشاء مجلد جديد'
                onChangeAction={field.onChange}
                onOpenAction={newCategory.open}
                disabled={isDisabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name='notes'
        control={form.control}
        render={({ field }) => (
          <FormItem className='lg:max-w-md'>
            <FormLabel>الملاحظات</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value}
                disabled={isDisabled}
                placeholder='ملاحظات اختيارية'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
