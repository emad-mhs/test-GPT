'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Form } from '@/components/ui/form';
import { paths } from '@/lib/paths';
import { DepartmentUpdateInput, departmentUpdateSchema } from '../../../schema';
import { FormSectionSkeleton } from './skeleton';
import { EditDepartmentFormFields } from '../../components/edit-department-form-fields';
import { Toast } from '@/lib/toast';
import { ErrorFallback } from '@/components/error-fallback';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';

interface FormSectionProps {
  departmentId: string;
}

export const FormSection = ({ departmentId }: FormSectionProps) => (
  <Suspense fallback={<FormSectionSkeleton />}>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FormSectionSuspense departmentId={departmentId} />
    </ErrorBoundary>
  </Suspense>
);

const FormSectionSuspense = ({ departmentId }: FormSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const { data: department } = useSuspenseQuery(
    trpc.departments.getOne.queryOptions({
      departmentId,
    })
  );

  const canDelete = session?.user?.canDelete;

  const form = useForm<DepartmentUpdateInput>({
    resolver: zodResolver(departmentUpdateSchema),
    defaultValues: {
      id: departmentId,
      name: department.name,
      rank: department.rank,
      manager: department.manager || '',
      email: department.email || '',
      phone: department.phone || '',
    },
  });

  const updateDepartment = useMutation(
    trpc.departments.update.mutationOptions({
      onSuccess: () => {
        Toast.success('تم تحديث الإدارة');
        queryClient.invalidateQueries(trpc.departments.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.departments.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(
          trpc.departments.getOne.queryOptions({ departmentId })
        );
        router.push(paths.departmentsPage());
      },
      onError: err => {
        Toast.error(err.message);
      },
    })
  );

  const removeDepartment = useMutation(
    trpc.departments.remove.mutationOptions({
      onSuccess: () => {
        Toast.success('تم حذف الإدارة');
        queryClient.invalidateQueries(trpc.departments.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.departments.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        router.push(paths.departmentsPage());
      },
      onError: err => Toast.error(err.message),
    })
  );

  const [ConfirmDeleteDialog, confirmDelete] = useConfirm(
    'هل أنت متأكد؟',
    'سيتم حذف البيانات نهائيًا.',
    'destructive'
  );

  const isPending = updateDepartment.isPending || removeDepartment.isPending;

  const onSubmit = (values: DepartmentUpdateInput) => {
    updateDepartment.mutate(values);
  };

  const onDelete = async () => {
    const ok = await confirmDelete();
    if (ok) removeDepartment.mutate({ departmentId });
  };

  return (
    <>
      <ConfirmDeleteDialog />
      <div className='flex flex-col gap-y-4'>
        <Card className='w-full h-full bg-card border-none '>
          <CardHeader className='flex flex-row items-center gap-x-4 px-7 space-y-0'>
            <Button size='sm' variant='muted' onClick={() => router.back()}>
              <ArrowRightIcon className='size-4' />
              عودة
            </Button>
            <CardTitle className='text-xl font-bold'>
              تعديل بيانات الإدارة
            </CardTitle>
          </CardHeader>

          <div className='px-6'>
            <Separator />
          </div>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col gap-y-4'
              >
                <EditDepartmentFormFields form={form} isDisabled={isPending} />

                <Separator className='my-2' />

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
                  <Button type='submit' size='lg' disabled={isPending}>
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {canDelete && (
          <Card className='w-full h-full bg-card border-none'>
            <CardContent>
              <div className='flex flex-col'>
                <h3 className='font-bold'>منطقة الخطر</h3>
                <p className='text-sm text-muted-foreground'>
                  حذف الإدارة لا رجعة فيه وسيزيل كل ما يرتبط به من بيانات.
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
                  حذف الإدارة
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
