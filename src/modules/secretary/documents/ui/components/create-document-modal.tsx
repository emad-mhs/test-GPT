'use client';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormControl,
  // FormMessage,
} from '@/components/ui/form';
// import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
// import { SelectSwitcher } from '@/components/select-switcher';
import { ResponsiveModal } from '@/components/responsive-modal';
// import { UploadFileField } from '@/components/upload-file-field';

// import { useCreateCategoryModal } from '@/modules/secretary/categories/hooks/use-create-category-modal';
import { useCreateDocumentModal } from '../../hooks/use-create-document-modal';
import { DocumentInsertInput, documentInsertSchema } from '../../schema';
import { uploadDocument } from '@/lib/storage';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { Toast } from '@/lib/toast';
import { CreateFormFields } from './create-document-fields';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useCategoriesOptions } from '@/hooks/use-options';
import { DEFAULT_LIMIT } from '@/constants';

export const CreateDocumentModal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isOpen, setIsOpen, close } = useCreateDocumentModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categoryOpts = useCategoriesOptions();

  const form = useForm<DocumentInsertInput>({
    resolver: zodResolver(documentInsertSchema),
    defaultValues: {
      subject: '',
      fileUrl: undefined,
      categoryId: undefined,
      notes: '',
    },
  });
  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const canAdd = session?.user.canAdd;

  const createDocument = useMutation(
    trpc.documents.create.mutationOptions({
      onSuccess: () => {
        Toast.success('تم إنشاء الوثيقة');
        queryClient.invalidateQueries(
          trpc.documents.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        form.reset(); // إعادة تعيين النموذج بعد الإغلاق
        close();
      },
      onError: err => {
        Toast.error(err.message);
      },
    })
  );

  const onSubmit = useCallback(
    async (values: DocumentInsertInput) => {
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
      createDocument.mutate({ ...values, fileUrl });
    },
    [createDocument]
  );

  const isPending = createDocument.isPending || isSubmitting;

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
          <CardTitle className='text-xl font-bold'>إنشاء مستند جديد</CardTitle>
          <CardDescription>
            إنشاء مستند جديد وتصنيفه في أحد المجلدات
          </CardDescription>
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
              <CreateFormFields
                form={form}
                isDisabled={isPending}
                editable={!!canAdd}
                categories={categoryOpts}
              />

              <Separator className='my-2' />

              <Button className='w-full' disabled={isPending}>
                {isPending ? (
                  <Loader2Icon className='animate-spin' />
                ) : (
                  <PlusIcon />
                )}
                إنشاء مستند
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
