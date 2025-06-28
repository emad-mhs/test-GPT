'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  // FormControl,
  // FormDescription,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from '@/components/ui/form';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { UserRoles } from '@/modules/auth/types';
import { paths } from '@/lib/paths';
// import { Switch } from '@/components/ui/switch';
import { FormSectionSkeleton } from './skeleton';
import { UserUpdateInput, userUpdateSchema } from '../../../schema';
import { Toast } from '@/lib/toast';
import { UpdateFormFields } from '../../components/update-form-fields';
import { ErrorFallback } from '@/components/error-fallback';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useDepartmentsOptions } from '@/hooks/use-options';
import { DEFAULT_LIMIT } from '@/constants';

interface FormSectionProps {
  userId: string;
}

export const FormSection = ({ userId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <FormSectionSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSuspense = ({ userId }: FormSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const departmentOpts = useDepartmentsOptions();

  const { data: user } = useSuspenseQuery(
    trpc.users.getOne.queryOptions({ userId })
  );

  // ——— Form setup ———
  const form = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      id: userId,
      name: user.name,
      email: user.email,
      departmentId: user.departmentId,
      role: user.role as UserRoles,
      isTwoFactorEnabled: user.isTwoFactorEnabled as boolean,
      canAdd: user.canAdd as boolean,
      canUpdate: user.canUpdate as boolean,
      canDelete: user.canDelete as boolean,
    },
  });

  const updateUser = useMutation(
    trpc.users.update.mutationOptions({
      onSuccess: () => {
        Toast.success('تم تعديل بيانات المستخدم');
        queryClient.invalidateQueries(trpc.users.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.users.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(
          trpc.users.getOne.queryOptions({ userId })
        );
        router.push(paths.usersPage());
      },
      onError: err => {
        Toast.error(err.message);
      },
    })
  );

  const removeUser = useMutation(
    trpc.users.remove.mutationOptions({
      onSuccess: () => {
        Toast.success('تم حذف المستخدم');
        queryClient.invalidateQueries(trpc.users.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.users.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        router.push(paths.usersPage());
      },
      onError: error => {
        Toast.error(error.message);
      },
    })
  );

  const [ConfirmDeleteDialog, deleteConfirm] = useConfirm(
    'هل أنت متأكد؟',
    'سيتم حذف البيانات نهائيًا.',
    'destructive'
  );

  const onSubmit = (values: UserUpdateInput) => {
    updateUser.mutate(values);
  };

  const onDelete = async () => {
    const ok = await deleteConfirm();

    if (ok) {
      removeUser.mutate({ userId });
    }
  };

  const isPending = updateUser.isPending || removeUser.isPending;

  return (
    <>
      <ConfirmDeleteDialog />
      <div className='flex flex-col gap-y-4'>
        <Card className='w-full h-full border-none shadow-none'>
          <CardHeader className='flex flex-row items-center gap-x-4 px-7'>
            <Button size='sm' variant='muted' onClick={() => router.back()}>
              <ArrowRightIcon className='size-4' />
              عودة
            </Button>
            <CardTitle className='text-xl font-bold'>
              تعديل بيانات المستخدم
            </CardTitle>
          </CardHeader>
          <div className='px-7'>
            <Separator />
          </div>
          <CardContent className='px-7'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-y-4'>
                  <UpdateFormFields
                    form={form}
                    isPending={isPending}
                    departments={departmentOpts}
                  />

                  <Separator className='my-4' />

                  <div className='flex items-center justify-between'>
                    <Button
                      type='button'
                      size='lg'
                      variant='secondary'
                      onClick={() => router.back()}
                      disabled={isPending}
                    >
                      إلغاء
                    </Button>
                    <Button disabled={isPending} type='submit' size='lg'>
                      حفظ التغييرات
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className='w-ful h-full border-none shadow-none'>
          <CardContent className='px-7'>
            <div className='flex flex-col'>
              <h3 className='font-bold'>منطقة الخطر</h3>
              <p className='text-sm text-muted-foreground'>
                حذف المجلد لا رجعة فيه وسيزيل كل ما يرتبط به من بيانات.
              </p>
              <Separator className='my-6' />
              <Button
                className='w-fit mr-auto'
                size='sm'
                variant='destructive'
                type='button'
                disabled={isPending}
                onClick={onDelete}
              >
                حذف المجلد
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
