'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon } from 'lucide-react';
import { ErrorBoundary } from 'react-error-boundary';

import { useConfirm } from '@/hooks/use-confirm';
import { paths } from '@/lib/paths';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { ContactUpdateInput, contactUpdateSchema } from '../../../schema';
import { FormSectionSkeleton } from './skeleton';
import { EditContactFormFields } from '../../components/edit-contact-form-fields';
import { UserRoles } from '@/modules/auth/types';
import { ContactTypes } from '../../../types';
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
  contactId: string;
}

export const FormSection = ({ contactId }: FormSectionProps) => (
  <Suspense fallback={<FormSectionSkeleton />}>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <FormSectionContent contactId={contactId} />
    </ErrorBoundary>
  </Suspense>
);

const FormSectionContent = ({ contactId }: FormSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const { data: contact } = useSuspenseQuery(
    trpc.contacts.getOne.queryOptions({ contactId })
  );

  const isAdmin = session.user.role === UserRoles.ADMIN;
  const canDelete = session.user.canDelete;

  const form = useForm<ContactUpdateInput>({
    resolver: zodResolver(contactUpdateSchema),
    defaultValues: {
      contactId: contact.id,
      type: contact.type as ContactTypes,
      jobTitle: contact.jobTitle,
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
    },
  });

  const updateContact = useMutation(
    trpc.contacts.update.mutationOptions({
      onSuccess: () => {
        Toast.success('تم تعديل جهة الاتصال');
        queryClient.invalidateQueries(trpc.contacts.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.contacts.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(
          trpc.contacts.getOne.queryOptions({ contactId })
        );
        router.push(paths.contactsPage());
      },
      onError: err => Toast.error(err.message),
    })
  );

  const removeContact = useMutation(
    trpc.contacts.remove.mutationOptions({
      onSuccess: () => {
        Toast.success('تم حذف جهة الاتصال');
        queryClient.invalidateQueries(trpc.contacts.getAll.queryOptions());
        queryClient.invalidateQueries(
          trpc.contacts.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        router.push(paths.contactsPage());
      },
      onError: err => Toast.error(err.message),
    })
  );

  const [ConfirmDeleteDialog, confirmDelete] = useConfirm(
    'هل أنت متأكد؟',
    'سيتم حذف البيانات نهائيًا.',
    'destructive'
  );

  const isPending = updateContact.isPending || removeContact.isPending;

  const onSubmit = (values: ContactUpdateInput) => {
    updateContact.mutate(values);
  };

  const onDelete = async () => {
    const confirmed = await confirmDelete();
    if (confirmed) removeContact.mutate({ contactId });
  };

  return (
    <>
      <ConfirmDeleteDialog />

      <div className='flex flex-col gap-y-4'>
        <Card className='w-full h-full border-none'>
          <CardHeader className='flex flex-row items-center gap-x-4 px-7 space-y-0'>
            <Button size='sm' variant='muted' onClick={() => router.back()}>
              <ArrowRightIcon className='size-4' />
              عودة
            </Button>
            <CardTitle className='text-xl font-bold'>
              تعديل جهة الاتصال
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
                <EditContactFormFields
                  form={form}
                  isAdmin={isAdmin}
                  isDisabled={isPending}
                />

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
        )}
      </div>
    </>
  );
};
