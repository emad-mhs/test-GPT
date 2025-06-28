'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ResponsiveModal } from '@/components/responsive-modal';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2Icon, PlusIcon } from 'lucide-react';

import { useTRPC } from '@/trpc/client';
import { useCreateContactModal } from '../../hooks/use-create-contact-modal';
import { ContactInsertInput, contactInsertSchema } from '../../schema';
import { ContactFormFields } from './contact-form-fields';
import { ContactTypes } from '../../types';
import { UserRoles } from '@/modules/auth/types';
import { Toast } from '@/lib/toast';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';

export const CreateContactModal = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { isOpen, setIsOpen, close } = useCreateContactModal();

  const form = useForm<ContactInsertInput>({
    resolver: zodResolver(contactInsertSchema),
    defaultValues: {
      type: ContactTypes.EXTERNAL,
      name: '',
      email: '',
      phone: '',
      jobTitle: '',
    },
  });

  const createContact = useMutation(
    trpc.contacts.create.mutationOptions({
      onSuccess: () => {
        Toast.success('تم إنشاء جهة الاتصال');
        queryClient.invalidateQueries(
          trpc.contacts.getMany.queryOptions({ limit: DEFAULT_LIMIT })
        );
        queryClient.invalidateQueries(trpc.contacts.getAll.queryOptions());
        form.reset();
        close();
      },
      onError: error => {
        Toast.error(error.message);
      },
    })
  );

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const isAdmin = session?.user.role === UserRoles.ADMIN;

  const handleSubmit = (values: ContactInsertInput) => {
    createContact.mutate(values);
  };

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
          <CardTitle className='text-xl font-bold'>جهة اتصال جديدة</CardTitle>
          <CardDescription>
            إضافة جهة اتصال لإستلام وإرسال البريد إليها
          </CardDescription>
        </CardHeader>

        <div className='px-6'>
          <Separator />
        </div>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='flex flex-col gap-y-4'
            >
              <ContactFormFields
                form={form}
                isAdmin={isAdmin}
                isDisabled={createContact.isPending}
              />

              <Separator className='my-2' />

              <Button className='w-full' disabled={createContact.isPending}>
                {createContact.isPending ? (
                  <Loader2Icon className='animate-spin' />
                ) : (
                  <PlusIcon />
                )}
                إنشاء جهة اتصال
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
};
