'use client';

import { Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';
import { zodResolver } from '@hookform/resolvers/zod';

import { paths } from '@/lib/paths';
import { useConfirm } from '@/hooks/use-confirm';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { FormSectionSkeleton } from './skeleton';
import { CategoryUpdateInput, categoryUpdateSchema } from '../../../schema';
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
  categoryId: string;
}

export const FormSection = ({ categoryId }: FormSectionProps) => (
  <Suspense fallback={<FormSectionSkeleton />}>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FormSectionContent categoryId={categoryId} />
    </ErrorBoundary>
  </Suspense>
);

const FormSectionContent = ({ categoryId }: FormSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const { data: category } = useSuspenseQuery(
    trpc.categories.getOne.queryOptions({
      categoryId,
    })
  );

  const canDelete = session.user.canDelete;

  const form = useForm<CategoryUpdateInput>({
    resolver: zodResolver(categoryUpdateSchema),
    defaultValues: {
      id: category.id,
      name: category.name,
    },
  });

  const update = useMutation(
    trpc.categories.update.mutationOptions({
      onSuccess: () => {
        Toast.success('تم تعديل المجلد');
        queryClient.invalidateQueries(trpc.categories.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.categories.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(
          trpc.categories.getOne.queryOptions({ categoryId })
        );
        router.push(paths.categoryPage({ categoryId }));
      },
      onError: err => Toast.error(err.message),
    })
  );

  const remove = useMutation(
    trpc.categories.remove.mutationOptions({
      onSuccess: () => {
        Toast.success('تم حذف المجلد');
        queryClient.invalidateQueries(trpc.categories.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.categories.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        router.push(paths.categoriesPage());
      },
      onError: err => Toast.error(err.message),
    })
  );

  const [ConfirmDeleteDialog, confirmDelete] = useConfirm(
    'هل أنت متأكد؟',
    'سيتم حذف البيانات نهائيًا.',
    'destructive'
  );

  const isPending = update.isPending || remove.isPending;

  const handleSubmit = (values: CategoryUpdateInput) => {
    update.mutate(values);
  };

  const handleDelete = async () => {
    const confirmed = await confirmDelete();
    if (confirmed) {
      remove.mutate({ categoryId });
    }
  };

  return (
    <>
      <ConfirmDeleteDialog />

      <div className='flex flex-col gap-y-4'>
        <Card className='w-full h-full bg-card border-none shadow-none'>
          <CardHeader className='flex flex-row items-center gap-x-4 px-7'>
            <Button size='sm' variant='muted' onClick={() => router.back()}>
              <ArrowRightIcon className='size-4' />
              عودة
            </Button>
            <CardTitle className='text-xl font-bold'>تعديل المجلد</CardTitle>
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
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-bold'>اسم المجلد</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder='مثال: حديد الخردة، الأمن الغذائي، الأدوية...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className='my-7' />

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
          <Card className='w-full h-full bg-card border-none shadow-none'>
            <CardContent className='px-7'>
              <div className='flex flex-col'>
                <h3 className='font-black'>منطقة الخطر</h3>
                <p className='text-sm text-muted-foreground'>
                  حذف المجلد لا رجعة فيه وسيزيل كل ما يرتبط به من بيانات.
                </p>

                <Separator className='mt-6' />

                <Button
                  className='mt-6 w-fit mr-auto'
                  size='sm'
                  variant='destructive'
                  type='button'
                  disabled={isPending}
                  onClick={handleDelete}
                >
                  حذف المجلد
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
