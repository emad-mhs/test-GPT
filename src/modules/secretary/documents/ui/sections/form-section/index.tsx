'use client';

import { Suspense, useCallback, useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideFileText, Trash } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { paths } from '@/lib/paths';
import { Button } from '@/components/ui/button';
import { useConfirm } from '@/hooks/use-confirm';
import { BreadCrumb } from '@/components/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentUpdateInput, documentUpdateSchema } from '../../../schema';

import { uploadDocument } from '@/lib/storage';
import { FormSectionSkeleton } from './skeleton';
import { Toast } from '@/lib/toast';
import { UpdateFormFields } from '../../components/update-document-fields';
import { ErrorFallback } from '@/components/error-fallback';
import { useContactsOptions } from '@/hooks/use-options';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';

interface FormSectionProps {
  documentId: string;
}

export const FormSection = ({ documentId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <FormSectionSuspense documentId={documentId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSuspense = ({ documentId }: FormSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const categoryOpts = useContactsOptions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const { data: document } = useSuspenseQuery(
    trpc.documents.getOne.queryOptions({
      documentId,
    })
  );

  const isOwner = session.user.id === document.userId;
  const canUpdate = session.user.canUpdate;
  const editable = isOwner || canUpdate;
  const canDelete = session.user.canDelete;

  const breadcrumbItems = [
    { title: 'المجلدات', link: paths.categoriesPage() },
    {
      title: document.category!,
      link: paths.categoryPage({ categoryId: document.categoryId! }),
    },
  ];

  // ——— Form setup ———
  const form = useForm<DocumentUpdateInput>({
    resolver: zodResolver(documentUpdateSchema),
    defaultValues: {
      documentId: document.id,
      subject: document.subject,
      fileUrl: document.fileUrl || '',
      categoryId: document.categoryId || '',
      notes: document.notes || '',
    },
  });

  const updateDocument = useMutation(
    trpc.documents.update.mutationOptions({
      onSuccess: () => {
        Toast.success('تم تعديل الوثيقة');
        queryClient.invalidateQueries(
          trpc.documents.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(
          trpc.documents.getOne.queryOptions({ documentId })
        );
        router.push(paths.documentsPage());
      },
      onError: err => {
        Toast.error(err.message);
      },
    })
  );

  const removeDocument = useMutation(
    trpc.documents.remove.mutationOptions({
      onSuccess: () => {
        Toast.success('تم حذف الوثيقة');
        queryClient.invalidateQueries(
          trpc.documents.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        router.push(paths.documentsPage());
      },
      onError: err => {
        Toast.error(err.message);
      },
    })
  );

  const [ConfirmDeleteDialog, deleteConfirm] = useConfirm(
    'هل أنت متأكد؟',
    'سيتم حذف البيانات نهائيًا.',
    'destructive'
  );

  const onSubmit = useCallback(
    async (values: DocumentUpdateInput) => {
      setIsSubmitting(true);

      let fileUrl = values.fileUrl;
      if (values.fileUrl instanceof File) {
        fileUrl = await uploadDocument({
          file: values.fileUrl,
          subject: values.subject,
          categoryId: values.categoryId,
        });
      }

      setIsSubmitting(false);
      updateDocument.mutate({ ...values, fileUrl });
    },
    [updateDocument]
  );

  const onDelete = async () => {
    const ok = await deleteConfirm();

    if (ok) {
      removeDocument.mutate({ documentId });
    }
  };

  const isPending =
    updateDocument.isPending || removeDocument.isPending || isSubmitting;

  return (
    <>
      <ConfirmDeleteDialog />
      <div className='flex-1 space-y-4 p-4 pt-6'>
        <div className='flex flex-row items-center justify-between'>
          <BreadCrumb items={breadcrumbItems} />
        </div>
        <Card className='border-none drop-shadow-xs'>
          <CardHeader className='flex flex-col items-start justify-between gap-y-2 lg:flex-row lg:items-center'>
            <CardTitle className='flex text-xl line-clamp-1'>
              <div className='flex items-center gap-2'>
                <LucideFileText />
                <h2 className='py-2 text-xl lg:text-2xl font-bold tracking-tight'>
                  {document.subject}
                </h2>
              </div>
            </CardTitle>
            {canDelete && (
              <Button
                disabled={isPending}
                onClick={onDelete}
                variant='destructive'
              >
                <Trash className='size-4 ' />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Separator />

            <div className='pt-5 flex-col items-center justify-center space-y-3'>
              <div className='text-left'>
                <p className='text-xs lg:text-sm text-muted-foreground'>
                  {`تم الإنشاء بواسطة ${document.user} في `}
                  {format(new Date(document.createdAt), 'EEE, dd MMMM, yyyy ')}
                </p>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-y-4 pt-4'>
                  <UpdateFormFields
                    form={form}
                    isDisabled={isPending}
                    editable={!!editable}
                    categories={categoryOpts}
                  />

                  <Separator className='my-7' />
                  <div className='max-w-md flex items-center justify-between'>
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
      </div>
    </>
  );
};
