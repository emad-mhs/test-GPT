'use client';

import { BeatLoader } from 'react-spinners';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { paths } from '@/lib/paths';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { CardWrapper } from './card-wrapper';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';

export const NewVerificationForm = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const NewVerification = useMutation(
    trpc.auth.newVerification.mutationOptions({
      onSuccess(res) {
        setSuccess(res.message);
        // نوجّه المستخدم بعد ثانيتين
        setTimeout(() => router.push(paths.login()), 2000);
      },
      onError(err) {
        setError(err.message);
      },
    })
  );

  useEffect(() => {
    if (!token) {
      setError('!الرمز التعريفي مفقود');
      return;
    }
    NewVerification.mutate(token);
  }, [NewVerification, token]);

  return (
    <CardWrapper
      headerLabel='جاري التحقق من البريد الإلكتروني'
      backButtonLabel='العودة لتسجيل الدخول'
      backButtonHref={paths.login()}
    >
      <div className='flex w-full items-center justify-center'>
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
