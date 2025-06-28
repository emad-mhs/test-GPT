'use client';

import {
  LucideBinary,
  LucideFileOutput,
  LucideFileStack,
  LucideFileSymlink,
  LucideMail,
  LucideSend,
  MoreVertical,
  LucideFileSignature,
  LucideFileText,
  LucideMailbox,
  LucideMegaphone,
  Trash,
  QrCode,
  UsersRound,
  PencilIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense, useState, useRef } from 'react';
import { addDays, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useReactToPrint, UseReactToPrintOptions } from 'react-to-print';
import { ErrorBoundary } from 'react-error-boundary';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

import { paths } from '@/lib/paths';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { convertStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BreadCrumb } from '@/components/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { uploadMail } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Info } from '../../components/info';
import { formattedRefNum } from '../../../utils';
import { MailUpdateInput, mailUpdateSchema } from '../../../schema';
import { MAIL_STATUSES, MailStatuses, MailTypes } from '../../../types';
import { PrintQrCode } from '../../components/print-qr-code';

import Reciept from '../../components/print-receipt.tsx';
import { SelectSwitcher } from '@/components/select-switcher';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { UserRoles } from '@/modules/auth/types';
import { useCreateContactModal } from '@/modules/secretary/contacts/hooks/use-create-contact-modal';
import { useCreateCategoryModal } from '@/modules/secretary/categories/hooks/use-create-category-modal';
import { useCreateDepartmentModal } from '@/modules/secretary/departments/hooks/use-create-department-modal';
import { departmentsMain } from '@/modules/secretary/departments/types';
import { FormSectionSkeleton } from './skeleton';

import { Toast } from '@/lib/toast';
import { ErrorFallback } from '@/components/error-fallback';
import { AttachmentField } from '@/components/attachment-field';
import { ReceiptAttachmentField } from '../../components/receipt-attachment-field';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';
import {
  useCategoriesOptions,
  useContactsOptions,
  useDepartmentsOptions,
} from '@/hooks/use-options';

interface FormSectionProps {
  mailId: string;
}

const breadcrumbItems = [{ title: 'البريد', link: paths.mailsPage() }];

export const FormSection = ({ mailId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <FormSectionSuspense mailId={mailId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSuspense = ({ mailId }: FormSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();
  const newContact = useCreateContactModal();
  const newCategory = useCreateCategoryModal();
  const newDepartment = useCreateDepartmentModal();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFile, setPreviewFile] = useState(false);
  const [previewInstructions, setPreviewInstructions] = useState(false);
  const [previewReceiptLocal, setPreviewReceiptLocal] = useState(false);
  const [previewReceiptExternal, setPreviewReceiptExternal] = useState(false);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const inputInstructionsRef = useRef<HTMLInputElement>(null);
  const inputReceiptLocalRef = useRef<HTMLInputElement>(null);
  const inputReceiptExternalRef = useRef<HTMLInputElement>(null);

  const componentRefExternal = useRef<HTMLDivElement>(null);
  const printExternalReceipt = useReactToPrint({
    contentRef: componentRefExternal,
  } as UseReactToPrintOptions);

  const componentRefLocal = useRef<HTMLDivElement>(null);
  const printLocalReceipt = useReactToPrint({
    contentRef: componentRefLocal,
  } as UseReactToPrintOptions);

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  // const { data: contacts } = useSuspenseQuery(
  //   trpc.contacts.getAll.queryOptions()
  // );
  const contactOpts = useContactsOptions();
  const categoryOpts = useCategoriesOptions();
  const departmentOpts = useDepartmentsOptions();
  // const { data: departments } = useSuspenseQuery(
  //   trpc.departments.getAll.queryOptions()
  // );

  const {
    data: { mail, ccList, departmentList },
  } = useSuspenseQuery(
    trpc.mails.getOne.queryOptions({
      mailId,
    })
  );

  const isSecretary = session.user.departmentId === departmentsMain.SECRETARY;
  const isAdmin = session.user.role === UserRoles.ADMIN;
  const isOwner = session.user.id === mail.userId;
  const canUpdate = session.user.canUpdate;
  const editable = isOwner || canUpdate;

  const sentMail =
    mail.type === MailTypes.OUTGOING ||
    mail.type === MailTypes.LOCAL_OUTGOING ||
    mail.type === MailTypes.PERSONAL;
  const receivedMail =
    mail.type === MailTypes.INCOMING || mail.type === MailTypes.LOCAL_INCOMING;

  const ccNames = ccList.map(cc => cc.jobTitle).join(', ');

  const contentRef = useRef<HTMLDivElement>(null);
  const printQR = useReactToPrint({ contentRef });

  const updateMail = useMutation(
    trpc.mails.update.mutationOptions({
      onSuccess: () => {
        Toast.success('تم تعديل البريد');

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
        queryClient.invalidateQueries(
          trpc.mails.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        router.push(paths.mailsPage());
      },
      onError: error => {
        Toast.error(error.message);
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
        router.push(paths.mailsPage());
      },
      onError: error => {
        Toast.error(error.message);
      },
    })
  );

  const isPending =
    updateMail.isPending || removeMail.isPending || isSubmitting;

  // const contactOptions = contacts.map(category => ({
  //   value: category.id,
  //   label: category.jobTitle,
  // }));

  // const categoryOptions = categories.map(category => ({
  //   value: category.id,
  //   label: category.name,
  // }));

  // const departmentOptions = departments.map(department => ({
  //   value: department.id.toString(),
  //   label: department.name,
  // }));

  const onSubmit = async (values: MailUpdateInput) => {
    console.log({ values });
    setIsSubmitting(true);

    let uploadedFileUrl = mail.fileUrl || undefined;
    let uploadedInstructionsUrl = mail.instructionsUrl || undefined;
    let uploadedReceiptExternalUrl = mail.receiptExternalUrl || undefined;
    let uploadedReceiptLocalUrl = mail.receiptLocalUrl || undefined;

    if (values.fileUrl instanceof File) {
      uploadedFileUrl = await uploadMail({
        file: values.fileUrl,
        subject: mail.subject,
        type: mail.type as MailTypes,
        senderId: mail.senderId,
        receiverId: mail.receiverId,
        refNum: mail.refNum,
      });
    }

    if (values.instructionsUrl instanceof File) {
      uploadedInstructionsUrl = await uploadMail({
        file: values.instructionsUrl,
        subject: mail.subject,
        type: mail.type as MailTypes,
        senderId: mail.senderId,
        receiverId: mail.receiverId,
        refNum: mail.refNum,
      });
    }

    if (values.receiptExternalUrl instanceof File) {
      uploadedReceiptExternalUrl = await uploadMail({
        file: values.receiptExternalUrl,
        subject: mail.subject,
        type: mail.type as MailTypes,
        senderId: mail.senderId,
        receiverId: mail.receiverId,
        refNum: mail.refNum,
      });
    }

    if (values.receiptLocalUrl instanceof File) {
      uploadedReceiptLocalUrl = await uploadMail({
        file: values.receiptLocalUrl,
        subject: mail.subject,
        type: mail.type as MailTypes,
        senderId: mail.senderId,
        receiverId: mail.receiverId,
        refNum: mail.refNum,
      });
    }

    setIsSubmitting(false);

    updateMail.mutate({
      ...values,
      fileUrl: uploadedFileUrl,
      instructionsUrl: uploadedInstructionsUrl,
      receiptExternalUrl: uploadedReceiptExternalUrl,
      receiptLocalUrl: uploadedReceiptLocalUrl,
    });
  };

  const form = useForm<MailUpdateInput>({
    resolver: zodResolver(mailUpdateSchema),
    defaultValues: {
      mailId: mail.id,
      status: mail.status as MailStatuses,
      cc:
        mail.cc.length > 0
          ? mail.cc.map(cc => ({
              id: cc,
            }))
          : [],
      forwardTo:
        mail.forwardTo.length > 0
          ? mail.forwardTo.map(fw => ({
              department: fw,
            }))
          : [],
      categoryId: mail.categoryId || undefined,
      isSecret: mail.isSecret as boolean,
      notes: mail.notes || undefined,
      fileUrl: mail.fileUrl || undefined,
      instructionsUrl: mail.instructionsUrl || undefined,
      receiptExternalUrl: mail.receiptExternalUrl || undefined,
      receiptLocalUrl: mail.receiptLocalUrl || undefined,
      dueDate: mail.dueDate ? new Date(mail.dueDate) : addDays(new Date(), 3),
    },
  });

  const {
    fields: ccFields,
    append: ccAppend,
    remove: ccRemove,
  } = useFieldArray({
    control: form.control,
    name: 'cc',
  });

  const {
    fields: forwardToFields,
    append: forwardToAppend,
    remove: forwardToRemove,
  } = useFieldArray({
    control: form.control,
    name: 'forwardTo',
  });

  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Card className='border-none drop-shadow-xs'>
        <CardHeader className='flex flex-col items-start justify-between gap-y-2 lg:flex-row lg:items-center'>
          <CardTitle className='flex text-xl line-clamp-1'>
            <div className='flex items-center gap-2'>
              <span className='pl-4 '>
                {sentMail ? (
                  <LucideFileOutput className='size-6 lg:size-8' />
                ) : (
                  <LucideFileSymlink className='size-6 lg:size-8' />
                )}
              </span>
              <h2 className='max-w-prose py-2 text-xl lg:text-2xl font-bold tracking-tight'>
                {mail?.subject}
              </h2>
              <Badge
                variant={mail.status}
                className='text-xs font-medium px-3.5 py-2.5'
              >
                {convertStatus(mail?.status as string)}
              </Badge>
            </div>
          </CardTitle>

          {sentMail
            ? editable && (
                <DropdownMenu dir='rtl'>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='size-8 p-0'>
                      <MoreVertical className='size-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem disabled={isPending}>
                      <Link
                        prefetch
                        className='flex flex-row'
                        href={paths.mailSettingsPage({ mailId })}
                      >
                        <PencilIcon className='ml-2 size-4' /> تعديل
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => printQR()}>
                      <div className='hidden'>
                        <div ref={contentRef}>
                          <PrintQrCode
                            id={mail.id}
                            type={mail.type as MailTypes}
                            refNum={mail.refNum}
                            attachments={mail.attachments}
                          />
                        </div>
                      </div>
                      <QrCode className='size-4' /> طباعة QR
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            : editable && (
                <Button size='sm' asChild>
                  <Link prefetch href={paths.mailSettingsPage({ mailId })}>
                    <PencilIcon className='size-4' />
                  </Link>
                </Button>
              )}
        </CardHeader>
        <CardContent>
          <Separator />
          <div className='py-5 flex-col items-center justify-center space-y-3'>
            <div className='text-left'>
              <p className='text-xs lg:text-sm text-muted-foreground'>
                {`تم الإنشاء بواسطة ${mail?.user} في `}
                {format(new Date(mail.createdAt), 'EEE, dd MMMM, yyyy ')}
              </p>
            </div>
            <Info
              icon={<LucideSend className='size-4 lg:size-6' />}
              title='المرسل'
              description={mail?.sender}
            />
            <Info
              icon={<LucideMail className='size-4 lg:size-6' />}
              title='المستلم'
              description={mail?.receiver}
            />
            {ccNames && (
              <div className='flex flex-col  gap-1 md:flex-row md:items-start lg:gap-3'>
                <div className='flex gap-2 fle items-center lg:gap-3 '>
                  <UsersRound className='size-4 lg:size-6' />
                  <h2 className='md:min-w-[60px] lg:min-w-[100px]  text-sm font-bold tracking-tight  lg:text-lg'>
                    نسخة لـ:
                  </h2>
                </div>
                <p className='text-sm mr-5 md:mr-0 lg:text-lg text-muted-foreground'>
                  {ccList?.map(cc => (
                    <span className='block' key={cc.jobTitle}>
                      - {cc.jobTitle}
                    </span>
                  ))}
                </p>
              </div>
            )}
            <Info
              icon={<LucideBinary className='size-4 lg:size-6' />}
              title='المرجع'
              description={
                formattedRefNum({ type: mail.type, refNum: mail.refNum }) ||
                'لايوجد'
              }
            />

            <Info
              icon={<LucideFileStack className='size-4 lg:size-6' />}
              title='المرفقات'
              description={mail?.attachments || 'لايوجد'}
            />
          </div>

          <Separator />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-y-4 pt-4'>
                <AttachmentField
                  name='fileUrl'
                  label='نسخة من البريد'
                  icon={
                    <LucideFileText className='size-[36px] text-neutral-400' />
                  }
                  preview={previewFile}
                  setPreview={setPreviewFile}
                  inputRef={inputFileRef}
                  editable={!!editable}
                  isPending={isPending}
                  control={form.control}
                />

                {receivedMail && (
                  <AttachmentField
                    name='instructionsUrl'
                    label='التوجيهات'
                    icon={
                      <LucideMegaphone className='size-[36px] text-neutral-400' />
                    }
                    preview={previewInstructions}
                    setPreview={setPreviewInstructions}
                    inputRef={inputInstructionsRef}
                    editable={!!editable}
                    isPending={isPending}
                    control={form.control}
                  />
                )}

                {sentMail && (
                  <ReceiptAttachmentField
                    name='receiptExternalUrl'
                    label='إيصال الاستلامات الخارجية'
                    icon={
                      <LucideMailbox className='size-[36px] text-neutral-400' />
                    }
                    preview={previewReceiptExternal}
                    setPreview={setPreviewReceiptExternal}
                    inputRef={inputReceiptExternalRef}
                    editable={!!editable}
                    isPending={isPending}
                    control={form.control}
                    printArea={componentRefExternal}
                    onPrint={printExternalReceipt}
                    attachments={[
                      <Reciept
                        key='main'
                        type={mail.type as MailTypes}
                        refNum={mail.refNum as string}
                        subject={mail.subject}
                        receiver={mail.receiver}
                      />,
                      ...(ccList?.map(person => (
                        <Reciept
                          key={person.jobTitle}
                          type={mail.type as MailTypes}
                          refNum={mail.refNum as string}
                          subject={mail.subject}
                          receiver={person.jobTitle}
                        />
                      )) ?? []),
                    ]}
                  />
                )}

                {receivedMail && (
                  <ReceiptAttachmentField
                    name='receiptLocalUrl'
                    label='إيصال الاستلامات الداخلية'
                    icon={
                      <LucideFileSignature className='size-[36px] text-neutral-400' />
                    }
                    preview={previewReceiptLocal}
                    setPreview={setPreviewReceiptLocal}
                    inputRef={inputReceiptLocalRef}
                    editable={!!editable}
                    isPending={isPending}
                    control={form.control}
                    printArea={componentRefLocal}
                    onPrint={printLocalReceipt}
                    attachments={
                      departmentList?.map(dep => (
                        <Reciept
                          key={dep.name}
                          type={mail.type as MailTypes}
                          refNum={mail.refNum as string}
                          subject={mail.subject}
                          receiver={dep.name}
                        />
                      )) ?? []
                    }
                  />
                )}

                <Separator />

                {ccFields.map((field, index) => (
                  <div className='relative pt-2 lg:max-w-md' key={field.id}>
                    <FormField
                      control={form.control}
                      name={`cc.${index}.id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نسخة مع التحية</FormLabel>
                          <FormControl>
                            <div className='w-auto mt-2'>
                              <SelectSwitcher
                                value={field.value}
                                options={contactOpts}
                                placeholder='نسخة مع التحية لـ'
                                listHeading='الأسماء'
                                createLabel='إنشاء جهة اتصال'
                                onChangeAction={field.onChange}
                                onOpenAction={newContact.open}
                                disabled={!editable || isPending}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {editable && (
                      <Button
                        className='absolute top-0 left-0'
                        variant='destructive'
                        size='icon'
                        disabled={isPending}
                        onClick={e => {
                          e.preventDefault();
                          ccRemove(index);
                        }}
                      >
                        <Trash className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}
                {editable && (
                  <Button
                    className='w-fit'
                    variant='secondary'
                    size='sm'
                    disabled={isPending}
                    onClick={e => {
                      e.preventDefault();
                      ccAppend({ id: '' });
                    }}
                  >
                    نسخة لـ
                  </Button>
                )}

                {forwardToFields.map((field, index) => (
                  <div className='relative pt-2 lg:max-w-md' key={field.id}>
                    <FormField
                      control={form.control}
                      name={`forwardTo.${index}.department`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>إعادة توجيه إلى:</FormLabel>
                          <FormControl>
                            <div className='w-auto mt-2'>
                              <SelectSwitcher
                                value={field.value}
                                options={departmentOpts}
                                placeholder='اسم الإدارة'
                                listHeading='الإدارات'
                                createLabel='إنشاء إدارة جديدة'
                                onChangeAction={field.onChange}
                                onOpenAction={newDepartment.open}
                                disabled={!editable || isPending}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {editable && (
                      <Button
                        className='absolute top-0 left-0'
                        variant='destructive'
                        size='icon'
                        disabled={isPending}
                        onClick={e => {
                          e.preventDefault();
                          forwardToRemove(index);
                        }}
                      >
                        <Trash className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}
                {editable && (
                  <Button
                    className='w-fit'
                    variant='secondary'
                    size='sm'
                    disabled={isPending}
                    onClick={e => {
                      e.preventDefault();
                      forwardToAppend({ department: '' });
                    }}
                  >
                    إضافة إدارة مختصة
                  </Button>
                )}

                {isSecretary && (
                  <FormField
                    name='categoryId'
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className='lg:max-w-md'>
                        <FormLabel>اسم المجلد</FormLabel>
                        <FormControl>
                          <div className='w-auto'>
                            <SelectSwitcher
                              value={field.value}
                              options={categoryOpts}
                              placeholder=' اختياري: اختر مجلد لتصنيف هذا البريد'
                              listHeading='المجلدات'
                              createLabel='إنشاء مجلد جديد'
                              onChangeAction={field.onChange}
                              onOpenAction={newCategory.open}
                              disabled={isOwner || canUpdate ? isPending : true}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem className='lg:max-w-md'>
                      <FormLabel>حالة البريد</FormLabel>
                      <FormControl>
                        <Select
                          dir='rtl'
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!editable || isPending}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='اختر حالة البريد' />
                          </SelectTrigger>
                          <SelectContent>
                            {MAIL_STATUSES.map(status => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name='dueDate'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='lg:max-w-md'>
                      <FormLabel>تاريخ الإنجاز المتوقع</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          disabled={!editable || isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='notes'
                  render={({ field }) => (
                    <FormItem className='lg:max-w-md'>
                      <FormLabel>الملاحظات</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value ?? ''}
                          disabled={!editable || isPending}
                          placeholder='ملاحظات اختيارية'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isAdmin && (
                  <FormField
                    control={form.control}
                    name='isSecret'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center lg:max-w-md justify-between rounded-lg border border-input p-3 shadow-xs'>
                        <div className='space-y-0.5'>
                          <FormLabel>بريد سري</FormLabel>
                          <p className='text-muted-foreground text-sm'>
                            حجب البريد عن الموظفين
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            disabled={isPending}
                            checked={!!field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}

                <Separator className='my-7' />

                <div className='max-w-md flex items-center justify-between '>
                  <Button
                    type='button'
                    size='lg'
                    variant='secondary'
                    onClick={() => router.back()}
                    disabled={isPending}
                  >
                    إلغاء
                  </Button>
                  <Button disabled={!editable || isPending}>
                    {/* disabled={isOwner || canUpdate ? isPending : true}> */}
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
