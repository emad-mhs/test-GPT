'use client';

import { useConfirm } from '@/hooks/use-confirm';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { paths } from '@/lib/paths';
import { SettingsMailInput, settingsMailSchema } from '../../../schema';
import { Textarea } from '@/components/ui/textarea';
import { SelectSwitcher } from '@/components/select-switcher';
import { useCreateContactModal } from '@/modules/secretary/contacts/hooks/use-create-contact-modal';
import { SettingsFormSectionSkeleton } from './skeleton';
import { Toast } from '@/lib/toast';
import { ErrorFallback } from '@/components/error-fallback';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useContactsOptions } from '@/hooks/use-options';
import { DEFAULT_LIMIT } from '@/constants';

interface SettingsFormProps {
  mailId: string;
}

export const SettingsFormSection = ({ mailId }: SettingsFormProps) => {
  return (
    <Suspense fallback={<SettingsFormSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <SettingsFormSectionSuspense mailId={mailId} />
      </ErrorBoundary>
    </Suspense>
  );
};

// type FormValues = z.infer<typeof settingsMailSchema>;

const SettingsFormSectionSuspense = ({ mailId }: SettingsFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();
  const newContact = useCreateContactModal();

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const {
    data: { mail },
  } = useSuspenseQuery(
    trpc.mails.getOne.queryOptions({
      mailId,
    })
  );
  const canDelete = session?.user.canDelete;
  const isOwner = session?.user.id === mail.userId;

  // const [{ data: contacts }] = trpc.contacts.getAll.useSuspenseQuery();
  // const contactOptions = contacts.map(contact => ({
  //   value: contact.id,
  //   label: contact.jobTitle,
  // }));
  const contactOpts = useContactsOptions();

  // const utils = trpc.useUtils();
  const updateMail = useMutation(
    trpc.mails.settigs.mutationOptions({
      onSuccess: () => {
        Toast.success('تم تعديل البريد');
        queryClient.invalidateQueries(
          trpc.mails.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(
          trpc.audit.getLogs.queryOptions({
            limit: DEFAULT_LIMIT,
            tableName: 'mail',
            recordId: mailId,
          })
        );
        queryClient.invalidateQueries(
          trpc.mails.getOne.queryOptions({ mailId })
        );
        router.push(paths.mailPage({ mailId }));
      },
      onError: err => {
        Toast.error(err.message);
      },
    })
  );

  const removeMail = useMutation(
    trpc.mails.remove.mutationOptions({
      onSuccess: () => {
        Toast.success('تم حذف البريد');
        queryClient.invalidateQueries(
          trpc.mails.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(
          trpc.audit.getLogs.queryOptions({
            limit: DEFAULT_LIMIT,
            tableName: 'mail',
          })
        );
        router.push(paths.mailsPage());
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

  const isPending = updateMail.isPending || removeMail.isPending;

  const onSubmit = (values: z.infer<typeof settingsMailSchema>) => {
    updateMail.mutate(values);
  };

  const onDelete = async () => {
    const ok = await deleteConfirm();

    if (ok) {
      removeMail.mutate({ mailId });
    }
  };

  const form = useForm<SettingsMailInput>({
    resolver: zodResolver(settingsMailSchema),
    defaultValues: {
      mailId: mail.id,
      subject: mail.subject,
      senderId: mail.senderId,
      receiverId: mail.receiverId,
      attachments: mail.attachments || '',
    },
  });

  return (
    <>
      <ConfirmDeleteDialog />
      <div className='flex flex-col gap-y-4'>
        <Card className='w-full h-full border-none shadow-none'>
          <CardHeader className='flex flex-row items-center gap-x-4'>
            <Button size='sm' variant='muted' onClick={() => router.back()}>
              <ArrowRightIcon className='size-4' />
              عودة
            </Button>
            <CardTitle className='text-xl font-bold'>تعديل البريد</CardTitle>
          </CardHeader>
          <div className='px-7'>
            <Separator />
          </div>
          <CardContent className='px-7'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-y-4'>
                  <FormField
                    name='subject'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان البريد</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value ?? ''}
                            disabled={isPending}
                            placeholder='الموضوع/...'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name='senderId'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المرسل</FormLabel>
                        <FormControl>
                          <div className='w-auto'>
                            <SelectSwitcher
                              value={field.value}
                              options={contactOpts}
                              placeholder='اختر اسم المرسل'
                              listHeading='الأسماء'
                              createLabel='إنشاء جهة اتصال'
                              onChangeAction={field.onChange}
                              onOpenAction={newContact.open}
                              disabled={isPending}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name='receiverId'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المستلم</FormLabel>
                        <FormControl>
                          <div className='w-auto'>
                            <SelectSwitcher
                              options={contactOpts}
                              placeholder='اختر اسم المستلم'
                              listHeading='الأسماء'
                              createLabel='إنشاء جهة اتصال'
                              value={field.value}
                              onChangeAction={field.onChange}
                              onOpenAction={newContact.open}
                              disabled={isPending}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='attachments'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عدد المرفقات</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder='1، 2، 3'
                            {...field}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator className='my-7' />
                <div className='flex items-center justify-between'>
                  <Button
                    type='button'
                    size='lg'
                    variant='secondary'
                    onClick={() => router.back()}
                    disabled={isPending}
                    // className={cn(!onCancel && 'invisible')}
                  >
                    إلغاء
                  </Button>
                  <Button disabled={isPending} type='submit' size='lg'>
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isOwner || canDelete) && (
          <Card className='w-ful h-full border-none shadow-none'>
            <CardContent className='px-7'>
              <div className='flex flex-col'>
                <h3 className='font-bold'>منطقة الخطر</h3>
                <p className='text-sm text-muted-foreground'>
                  حذف البريد لا رجعة فيه وسيزيل كل ما يرتبط به من بيانات.
                </p>

                <Separator className='mt-7' />

                <Button
                  className='mt-6 w-fit mr-auto'
                  size='sm'
                  variant='destructive'
                  type='button'
                  disabled={isPending}
                  onClick={onDelete}
                >
                  حذف البريد
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};
