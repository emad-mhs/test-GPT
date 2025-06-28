'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error('حدث خطأ:', error);
  }, [error]);

  return (
    <div className='h-screen flex flex-col items-center justify-center gap-4 text-center px-4'>
      <AlertTriangle className='size-8 text-destructive' />
      <h2 className='text-lg font-semibold'>حدث خطأ غير متوقع</h2>
      <p className='text-sm text-muted-foreground'>
        يرجى المحاولة مرة أخرى، أو العودة إلى الصفحة الرئيسية.
      </p>

      {process.env.NODE_ENV === 'development' && (
        <pre className='bg-muted p-2 rounded text-xs max-w-md overflow-auto'>
          {error.message}
        </pre>
      )}

      <div className='flex gap-2'>
        <Button variant='outline' onClick={() => reset()}>
          إعادة المحاولة
        </Button>
        <Link href='/'>
          <Button variant='secondary'>الصفحة الرئيسية</Button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
