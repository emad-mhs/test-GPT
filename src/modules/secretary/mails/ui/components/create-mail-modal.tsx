'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2Icon, LucideFileText, PlusIcon, Trash } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ResponsiveModal } from '@/components/responsive-modal';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { SelectSwitcher } from '@/components/select-switcher';
import { AttachmentField } from '../../../../../components/attachment-field';

import { Toast } from '@/lib/toast';
import { uploadMail } from '@/lib/storage';
import { generateRefNum } from '../../utils';
import { MailInsertInput, mailInsertSchema } from '../../schema';
import { MailTypes, MAIL_TYPES } from '../../types';
import { useCreateMailModal } from '../../hooks/use-create-mail-modal';
import { useCreateContactModal } from '@/modules/secretary/contacts/hooks/use-create-contact-modal';
import { useCreateCategoryModal } from '@/modules/secretary/categories/hooks/use-create-category-modal';
import { useCreateDepartmentModal } from '@/modules/secretary/departments/hooks/use-create-department-modal';
import { UserRoles } from '@/modules/auth/types';
import { departmentsMain } from '@/modules/secretary/departments/types';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  useCategoriesOptions,
  useContactsOptions,
  useDepartmentsOptions,
} from '@/hooks/use-options';
import { DEFAULT_LIMIT } from '@/constants';

export const CreateMailModal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { isOpen, setIsOpen, close } = useCreateMailModal();
  const newContact = useCreateContactModal();
  const newCategory = useCreateCategoryModal();
  const newDepartment = useCreateDepartmentModal();
  const contactOpts = useContactsOptions();
  const categoryOpts = useCategoriesOptions();
  const departmentOpts = useDepartmentsOptions();

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const isAdmin = session.user.role === UserRoles.ADMIN;
  const canAdd = session.user.canAdd;
  const isSecretary = session.user.departmentId === departmentsMain.SECRETARY;
  const editable = canAdd || isSecretary;

  // ——— Form setup ———
  const form = useForm<MailInsertInput>({
    resolver: zodResolver(mailInsertSchema),
    defaultValues: {
      subject: '',
      type: MailTypes.OUTGOING,
      senderId: '',
      receiverId: '',
      categoryId: undefined,
      cc: [],
      forwardTo: [],
      attachments: '',
      refNum: '',
      notes: '',
      isSecret: false,
      fileUrl: undefined,
    },
  });

  const fields = [
    {
      name: 'senderId',
      label: 'المرسل',
      opts: contactOpts,
      onCreate: newContact.open,
    },
    {
      name: 'receiverId',
      label: 'المستلم',
      opts: contactOpts,
      onCreate: newContact.open,
    },
  ] as const; // ← tell TS “these are literal values, not just string”

  const {
    fields: ccFields,
    append: addCc,
    remove: removeCc,
  } = useFieldArray({
    name: 'cc',
    control: form.control,
  });
  const {
    fields: fwFields,
    append: addFw,
    remove: removeFw,
  } = useFieldArray({ name: 'forwardTo', control: form.control });

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMail = useMutation(
    trpc.mails.create.mutationOptions({
      onSuccess: () => {
        Toast.success('تم إنشاء البريد');
        queryClient.invalidateQueries(
          trpc.mails.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        form.reset();
        close();
      },
      onError: err => Toast.error(err.message),
    })
  );

  const onSubmit = useCallback(
    async (values: MailInsertInput) => {
      setIsSubmitting(true);
      // 1) generate ref #
      const refNum = (await generateRefNum({
        type: values.type,
        receiverId: values.receiverId,
      })) as string;

      // 2) upload if needed
      let fileUrl = values.fileUrl;
      if (values.fileUrl instanceof File) {
        fileUrl = await uploadMail({
          file: values.fileUrl,
          subject: values.subject,
          type: values.type,
          senderId: values.senderId,
          receiverId: values.receiverId,
          refNum,
        });
      }

      setIsSubmitting(false);

      // 3) call mutation
      createMail.mutate({ ...values, refNum, fileUrl });
    },
    [createMail]
  );

  const isPending = createMail.isPending || isSubmitting;

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
          <CardTitle className='text-xl font-bold'>إنشاء بريد جديد</CardTitle>
          <CardDescription>
            إنشاء بريد صادر أو وارد سواء كان من جهات خارجية أو داخلية
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
              {/* Subject */}
              <FormField
                name='subject'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان البريد</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder='الموضوع/...'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع البريد</FormLabel>
                    <FormControl>
                      <Select
                        dir='rtl'
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='اختر نوع البريد' />
                        </SelectTrigger>
                        <SelectContent>
                          {isSecretary
                            ? MAIL_TYPES.map(t => (
                                <SelectItem key={t.value} value={t.value}>
                                  {t.label}
                                </SelectItem>
                              ))
                            : ['local_outgoing', 'local_incoming'].map(v => (
                                <SelectItem key={v} value={v}>
                                  {v === 'local_outgoing'
                                    ? 'الصادر الداخلي'
                                    : 'الوارد الداخلي'}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sender / Receiver */}
              {/** helper render fn */}
              {fields.map(({ name, label, opts, onCreate }) => (
                <FormField
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <SelectSwitcher
                          value={field.value}
                          options={opts}
                          placeholder={`اختر اسم ${label}`}
                          listHeading='الأسماء'
                          createLabel='إنشاء جهة اتصال'
                          onChangeAction={field.onChange}
                          onOpenAction={onCreate}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}

              {/* Attachments count */}
              <FormField
                control={form.control}
                name='attachments'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عدد المرفقات</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder='مثلاً: 1,2,3'
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File upload */}
              <AttachmentField
                name='fileUrl'
                label='نسخة من البريد'
                icon={
                  <LucideFileText className='size-[36px] text-neutral-400' />
                }
                preview={previewFile}
                setPreview={setPreviewFile}
                inputRef={inputFileRef}
                editable={editable}
                isPending={isSubmitting}
                control={form.control}
              />

              {/* CC Array */}
              {ccFields.map((f, idx) => (
                <div className='relative pt-2' key={f.id}>
                  <FormField
                    control={form.control}
                    name={`cc.${idx}.id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نسخة مع التحية #{idx + 1}</FormLabel>
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
                              disabled={isPending}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className='absolute top-0 left-0'
                    variant='destructive'
                    size='icon'
                    onClick={e => {
                      e.preventDefault();
                      removeCc(idx);
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              <Button
                variant='secondary'
                size='sm'
                onClick={e => {
                  e.preventDefault();
                  addCc({ id: '' });
                }}
              >
                إضافة نسخة
              </Button>

              {/* ForwardTo Array */}
              {fwFields.map((f, idx) => (
                <div className='relative pt-2' key={f.id}>
                  <FormField
                    control={form.control}
                    name={`forwardTo.${idx}.department`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>إعادة توجيه #{idx + 1}</FormLabel>
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
                              disabled={isPending}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    className='absolute top-0 left-0'
                    variant='destructive'
                    size='icon'
                    onClick={e => {
                      e.preventDefault();
                      removeFw(idx);
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              <Button
                variant='secondary'
                size='sm'
                onClick={e => {
                  e.preventDefault();
                  addFw({ department: '' });
                }}
              >
                إضافة إدارة
              </Button>

              {/* Optional Category */}
              {isSecretary && (
                <FormField
                  name='categoryId'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المجلد</FormLabel>
                      <FormControl>
                        <SelectSwitcher
                          value={field.value}
                          options={categoryOpts}
                          placeholder=' اختياري: اختر مجلد لتصنيف هذا البريد'
                          listHeading='المجلدات'
                          createLabel='إنشاء مجلد جديد'
                          onChangeAction={field.onChange}
                          onOpenAction={newCategory.open}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {/* Notes */}
              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الملاحظات</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder='ملاحظات اختيارية'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Secret Switch */}
              {isAdmin && (
                <FormField
                  control={form.control}
                  name='isSecret'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border border-input p-3 shadow-xs'>
                      <div className='space-y-0.5'>
                        <FormLabel>بريد سري</FormLabel>
                        <FormDescription>
                          حجب البريد عن الموظفين
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <Separator className='my-2' />

              <Button className='w-full' disabled={isPending}>
                {isPending ? (
                  <Loader2Icon className='animate-spin' />
                ) : (
                  <PlusIcon />
                )}
                إنشاء بريد
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
