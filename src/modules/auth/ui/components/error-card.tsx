import { paths } from '@/lib/paths';

import { LucideAlertTriangle } from 'lucide-react';
import { CardWrapper } from './card-wrapper';

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel='هناك خطأ ما٬ يرجى المحاولة لاحقًا!'
      backButtonHref={paths.login()}
      backButtonLabel='العودة إلى تسجيل الدخول'
    >
      <div className='w-full flex justify-center items-center'>
        <LucideAlertTriangle className='text-destructive' />
      </div>
    </CardWrapper>
  );
};
