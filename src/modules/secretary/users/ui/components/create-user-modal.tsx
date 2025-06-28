'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

import { useCreateUserModal } from '../../hooks/use-create-user-modal';
import { UserInsertInput, userInsertSchema } from '../../schema';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { Toast } from '@/lib/toast';
import { CreateFormFields } from './create-form-fields';
// import { useOptions } from '@/hooks/use-options';
import { UserRoles } from '@/modules/auth/types';
import { useDepartmentsOptions } from '@/hooks/use-options';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';

export const CreateUserModal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isOpen, setIsOpen, close } = useCreateUserModal();
  const departmentOpts = useDepartmentsOptions();

  const createUser = useMutation(
    trpc.users.create.mutationOptions({
      onSuccess: () => {
        Toast.success('تم إنشاء مستخدم جديد');
        queryClient.invalidateQueries(
          trpc.users.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(trpc.users.getAll.queryOptions());
        form.reset();
        close();
      },
      onError: error => {
        Toast.error(error.message);
      },
    })
  );

  // const [{ data: departments }] = trpc.departments.getAll.useSuspenseQuery();

  // const departmentOptions = departments.map(department => ({
  //   value: department.id.toString(),
  //   label: department.name,
  // }));

  const onSubmit = (values: UserInsertInput) => {
    createUser.mutate(values);
  };

  const form = useForm<UserInsertInput>({
    resolver: zodResolver(userInsertSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      departmentId: undefined,
      role: UserRoles.USER,
      isTwoFactorEnabled: false,
      canAdd: false,
      canUpdate: false,
      canDelete: false,
    },
  });

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
        <CardHeader className='flex flex-col px-7'>
          <CardTitle className='text-xl font-bold'>جهة اتصال جديدة</CardTitle>
          <CardDescription>
            إضافة جهة اتصال لإستلام وإرسال البريد إليها
          </CardDescription>
        </CardHeader>
        <div className='px-7'>
          <Separator />
        </div>
        <CardContent className='px-7'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-y-4'>
                <CreateFormFields
                  form={form}
                  isPending={createUser.isPending}
                  departments={departmentOpts}
                />

                <Separator className='my-4' />

                <Button className='w-full' disabled={createUser.isPending}>
                  {createUser.isPending ? (
                    <Loader2Icon className='animate-spin' />
                  ) : (
                    <PlusIcon />
                  )}
                  إنشاء مستخدم
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
