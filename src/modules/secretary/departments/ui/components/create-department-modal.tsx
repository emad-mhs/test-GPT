'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, Loader2Icon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ResponsiveModal } from '@/components/responsive-modal';

import { useCreateDepartmentModal } from '../../hooks/use-create-department-modal';
import { DepartmentInsertInput, departmentInsertSchema } from '../../schema';
import { DepartmentFormFields } from './department-form-fields';
import { Toast } from '@/lib/toast';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';

export const CreateDepartmentModal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { isOpen, setIsOpen, close } = useCreateDepartmentModal();

  const form = useForm<DepartmentInsertInput>({
    resolver: zodResolver(departmentInsertSchema),
    defaultValues: {
      name: '',
      rank: '',
      manager: '',
      email: '',
      phone: '',
    },
  });

  const createDepartment = useMutation(
    trpc.departments.create.mutationOptions({
      onSuccess: () => {
        Toast.success('تم إنشاء الإدارة');
        queryClient.invalidateQueries(
          trpc.departments.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(trpc.departments.getAll.queryOptions());
        form.reset();
        close();
      },
      onError: err => {
        Toast.error(err.message);
      },
    })
  );

  const onSubmit = (values: DepartmentInsertInput) => {
    createDepartment.mutate(values);
  };

  const handleToggle = (open: boolean) => {
    if (!open) {
      form.reset();
      close();
    } else {
      setIsOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <ResponsiveModal open={isOpen} onOpenChange={handleToggle}>
      <Card className='w-full h-full border-none'>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>إدارة جديدة</CardTitle>
          <CardDescription>
            إضافة إدارة جديدة لاستلام وإرسال البريد
          </CardDescription>
        </CardHeader>

        <div className='px-6'>
          <Separator />
        </div>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col gap-y-6'
            >
              <DepartmentFormFields
                form={form}
                isDisabled={createDepartment.isPending}
              />

              <Separator className='my-2' />

              <Button className='w-full' disabled={createDepartment.isPending}>
                {createDepartment.isPending ? (
                  <Loader2Icon className='animate-spin' />
                ) : (
                  <PlusIcon />
                )}
                إنشاء إدارة
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
