'use client';

// import { FallbackProps } from 'react-error-boundary';

// export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
//   return (
//     <div className='text-center p-4 text-destructive'>
//       <p className='font-semibold mb-2'>حدث خطأ غير متوقع:</p>
//       <pre className='text-sm text-muted-foreground whitespace-pre-wrap'>
//         {error.message}
//       </pre>
//       <button
//         onClick={resetErrorBoundary} // هذا هو الصحيح
//         className='mt-4 px-4 py-2 bg-red-500 text-white rounded-md'
//       >
//         إعادة المحاولة
//       </button>
//     </div>
//   );
// };
// components/ErrorFallback.tsx
'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) {
  return (
    <div className='flex flex-col items-center justify-center p-6 space-y-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-200'>
      <AlertTriangle className='w-12 h-12 text-red-600' />
      <h2 className='text-xl font-semibold text-red-700'>عذرًا، حدث خطأ</h2>
      <p className='text-center text-red-600'>
        {error.message || 'لم نتمكن من عرض هذه الجزء من الصفحة.'}
      </p>
      <Button variant='outline' onClick={resetErrorBoundary}>
        حاول مرة أخرى
      </Button>
    </div>
  );
}
