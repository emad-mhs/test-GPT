'use client';

import * as z from 'zod';
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
import { RegisterInput, registerSchema } from '../../schema';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';

export const formSchema = z.object({
  name: z.string().min(1, {
    message: 'أخبرنا بماذا نناديك',
  }),
  email: z.string().email({
    message: 'أدخل البريد الإلكتروني',
  }),
  password: z.string().min(1, {
    message: 'أدخل كلمة المرور',
  }),
});

export const RegisterForm = () => {
  const trpc = useTRPC();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const register = useMutation(trpc.auth.register.mutationOptions());

  const onSubmit = (values: RegisterInput) => {
    setError(undefined);
    setSuccess(undefined);

    register.mutate(values, {
      onSuccess(data) {
        setSuccess(data.message);
        form.reset();
      },
      onError(err) {
        setError(err.message);
      },
    });
  };

  return (
    <CardWrapper
      headerLabel='استخدم بريدك الإلكتروني أو أي مزود خدمة آخر للمتابعة'
      backButtonLabel='لدي حساب بالفعل؟'
      backButtonHref={paths.login()}
      // showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={register.isPending}
                      placeholder='عماد محمد'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={register.isPending}
                      placeholder='emad.mhs@example.com'
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={register.isPending}
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
            disabled={register.isPending}
            type='submit'
            className='w-full'
          >
            إنشاء حساب
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
