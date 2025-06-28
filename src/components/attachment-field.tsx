import { LucideFileCheck, Trash, Download } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import React from 'react';

interface AttachmentFieldProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label: string;
  icon: React.ReactNode;
  control: Control<TFieldValues>;
  preview: boolean;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  editable?: boolean;
  isPending: boolean;
}

export const AttachmentField = <TFieldValues extends FieldValues>({
  name,
  label,
  icon,
  control,
  preview,
  setPreview,
  inputRef,
  editable,
  isPending,
}: AttachmentFieldProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isFile = (field.value as any) instanceof File;
        const fileUrl = isFile ? URL.createObjectURL(field.value) : field.value;

        return (
          <FormItem>
            <FormControl>
              <div className='flex flex-col gap-y-2'>
                <div className='flex items-center gap-x-5'>
                  {field.value ? (
                    <div className='size-[72px] relative rounded-md overflow-hidden'>
                      <object className='w-full h-full' data={fileUrl} />
                    </div>
                  ) : (
                    <Avatar className='size-[72px] rounded-md'>
                      <AvatarFallback>{icon}</AvatarFallback>
                    </Avatar>
                  )}

                  <div className='flex flex-col'>
                    <p className='text-sm'>{label}</p>
                    <p className='text-sm text-muted-foreground'>
                      صيغة الملف PDF, الحجم الأقصى 15 ميجا.
                    </p>

                    <input
                      className='hidden'
                      type='file'
                      accept='.pdf'
                      ref={inputRef}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                      disabled={isPending}
                    />

                    {field.value ? (
                      <div className='flex gap-2 mt-2'>
                        <Button
                          type='button'
                          disabled={isPending}
                          variant='primary'
                          size='sm'
                          onClick={() => setPreview(p => !p)}
                        >
                          <LucideFileCheck className='size-4' />
                        </Button>

                        <a
                          href={fileUrl}
                          download={
                            isFile ? field.value.name : 'attachment.pdf'
                          }
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <Button
                            type='button'
                            variant='teritary'
                            size='sm'
                            className='w-fit'
                          >
                            <Download className='size-4' />
                          </Button>
                        </a>

                        {editable && (
                          <Button
                            type='button'
                            disabled={isPending}
                            variant='destructive'
                            size='sm'
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) inputRef.current.value = '';
                            }}
                          >
                            <Trash className='size-4' />
                          </Button>
                        )}
                      </div>
                    ) : (
                      editable && (
                        <Button
                          type='button'
                          disabled={isPending}
                          variant='secondary'
                          size='sm'
                          className='w-fit mt-2'
                          onClick={() => inputRef.current?.click()}
                        >
                          رفع الملف
                        </Button>
                      )
                    )}
                  </div>
                </div>

                {preview && field.value && (
                  <div className='mt-4 h-[600px] md:h-[1188px]'>
                    <object
                      data={fileUrl}
                      type='application/pdf'
                      className='border-0 top-0 h-full w-full'
                      width='100%'
                      height='100%'
                    />
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
