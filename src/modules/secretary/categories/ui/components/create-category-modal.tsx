'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateCategoryModal } from '../../hooks/use-create-category-modal';
import { CategoryInsertInput, categoryInsertSchema } from '../../schema';
import { useTRPC } from '@/trpc/client';

import { Loader2Icon, PlusIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ResponsiveModal } from '@/components/responsive-modal';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CategoryFormFields } from './category-form-fields';
import { Toast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';

export const CreateCategoryModal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { isOpen, setIsOpen, close } = useCreateCategoryModal();

  const createCategory = useMutation(
    trpc.categories.create.mutationOptions({
      onSuccess: () => {
        Toast.success('تم إنشاء المجلد');
        queryClient.invalidateQueries(
          trpc.categories.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(trpc.categories.getAll.queryOptions());

        form.reset();
        close();
      },
      onError: error => {
        Toast.error(error.message);
      },
    })
  );

  const form = useForm<CategoryInsertInput>({
    resolver: zodResolver(categoryInsertSchema),
    defaultValues: {
      name: '', // 👈 اجعلها قيمة مبدئية فارغة لتفادي التحذير
    },
  });

  const handleSubmit = (values: CategoryInsertInput) => {
    createCategory.mutate(values);
  };

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          form.reset();
          close();
        } else {
          setIsOpen(true);
        }
      }}
    >
      <Card className='w-full h-full border-none shadow-none'>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>إنشاء مجلد جديد</CardTitle>
          <CardDescription>
            يمكنك إنشاء مجلد جديد لربط البريد والملفات إليه
          </CardDescription>
        </CardHeader>

        <div className='px-7'>
          <Separator />
        </div>

        <CardContent className='px-7'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-6'
            >
              <CategoryFormFields
                form={form}
                isDisabled={createCategory.isPending}
              />

              <Separator />

              <Button
                type='submit'
                className='w-full'
                disabled={createCategory.isPending}
              >
                {createCategory.isPending ? (
                  <Loader2Icon className='animate-spin mr-2' />
                ) : (
                  <PlusIcon className='mr-2' />
                )}
                إنشاء مجلد جديد
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
