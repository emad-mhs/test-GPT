'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { NewPasswordInput, newPasswordSchema } from '../../schema';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';

export const NewPasswordForm = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const form = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
      token,
    },
  });

  const newPassword = useMutation(trpc.auth.newPassword.mutationOptions());

  const onSubmit = (values: NewPasswordInput) => {
    setError(undefined);
    setSuccess(undefined);

    newPassword.mutate(values, {
      onSuccess(res) {
        setSuccess(res.message);
        // نوجّه المستخدم بعد ثانيتين
        setTimeout(() => router.push(paths.login()), 2000);
      },
      onError(err) {
        setError(err.message);
      },
    });
  };

  return (
    <CardWrapper
      headerLabel='أدخل كلمة المرور الجديدة'
      // backButtonLabel='العودة إلى تسجيل الدخول'
      // backButtonHref={paths.login()}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور الجديدة</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={newPassword.isPending}
                      placeholder='******'
                      type='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={newPassword.isPending}
            type='submit'
            className='w-full'
          >
            إعادة تعيين
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
