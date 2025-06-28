'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoginInput, loginSchema } from '../../schema';
import { CardWrapper } from './card-wrapper';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { paths } from '@/lib/paths';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { z } from 'zod';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';

export const LoginForm = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [creds, setCreds] = useState<Partial<LoginInput>>({});

  // 1️⃣ Credentials form
  const credsForm = useForm<Pick<LoginInput, 'email' | 'password'>>({
    resolver: zodResolver(loginSchema.pick({ email: true, password: true })),
    defaultValues: { email: '', password: '' },
    shouldUnregister: true,
  });

  // 2️⃣ OTP form
  const otpForm = useForm<Pick<LoginInput, 'code'>>({
    resolver: zodResolver(z.object({ code: loginSchema.shape.code! })),
    defaultValues: { code: undefined },
    shouldUnregister: true,
  });

  // const login = trpc.auth.login.useMutation();

  const loginMutation = useMutation(
    trpc.auth.login.mutationOptions({
      onSuccess(res) {
        if (res.status === 'two_factor') {
          otpForm.reset();
          setShowTwoFactor(true);
          setSuccess(res.message);
        } else {
          router.push(paths.home());
        }
      },
      onError(err) {
        setError(err.message);
      },
    })
  );

  // Submit credentials
  const onCredsSubmit = (values: Pick<LoginInput, 'email' | 'password'>) => {
    setError(undefined);
    setSuccess(undefined);
    setCreds(values);
    loginMutation.mutate({ ...values });
  };

  // Submit OTP
  const onOtpSubmit = (values: Pick<LoginInput, 'code'>) => {
    setError(undefined);
    setSuccess(undefined);
    if (!creds.email || !creds.password) {
      setError('حدث خطأ داخلي، أعد المحاولة.');
      return;
    }
    loginMutation.mutate({
      email: creds.email,
      password: creds.password,
      code: values.code,
    });
  };

  return (
    <CardWrapper headerLabel='استخدم بريدك الإلكتروني أو أي مزود خدمة آخر للمتابعة'>
      {!showTwoFactor ? (
        <Form {...credsForm}>
          <form
            onSubmit={credsForm.handleSubmit(onCredsSubmit)}
            className='space-y-6'
          >
            <FormField
              control={credsForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loginMutation.isPending}
                      type='email'
                      placeholder='emad.mhs@example.com'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={credsForm.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        {...field}
                        disabled={loginMutation.isPending}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='******'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(prev => !prev)}
                        className='absolute left-2 top-2 text-muted-foreground'
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex items-center justify-between mt-2'>
              <Link
                href='/auth/reset'
                className='text-sm text-primary hover:underline'
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type='submit'
              disabled={loginMutation.isPending}
              className='w-full'
            >
              تسجيل الدخول
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...otpForm}>
          <form
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
            className='space-y-6'
          >
            <FormField
              control={otpForm.control}
              name='code'
              render={({ field }) => (
                <FormItem dir='ltr' className='flex justify-center'>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={val => otpForm.setValue('code', val)}
                      // otp
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              type='submit'
              disabled={loginMutation.isPending}
              className='w-full'
            >
              تسجيل
            </Button>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};
