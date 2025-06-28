'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { paths } from '@/lib/paths';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { CardWrapper } from './card-wrapper';
// import { useRouter } from 'next/navigation';
import { ResetInput, resetSchema } from '../../schema';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';

export const ResetForm = () => {
  const trpc = useTRPC();
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');

  const form = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const reset = useMutation(trpc.auth.reset.mutationOptions());

  const onSubmit = (values: ResetInput) => {
    setError(undefined);
    setSuccess(undefined);

    reset.mutate(values, {
      onSuccess(res) {
        setSuccess(res.message);
      },
      onError(err) {
        setError(err.message);
      },
    });
  };

  return (
    <CardWrapper
      headerLabel='نسيت كلمة المرور؟'
      backButtonLabel='العودة لتسجيل الدخول'
      backButtonHref={paths.login()}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={reset.isPending} type='email' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button className='w-full' type='submit' disabled={reset.isPending}>
            إرسال إعادة تعيين البريد الإلكتروني
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
