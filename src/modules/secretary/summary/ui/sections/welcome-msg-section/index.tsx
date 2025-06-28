// import { trpc } from '@/trpc/client';
// import { Suspense } from 'react';
// import { ErrorBoundary } from 'react-error-boundary';
// import { WelcomeMsgSectionSkeleton } from './skeleton';

// export const WelcomeMsgSection = () => {
//   return (
//     <Suspense fallback={<WelcomeMsgSectionSkeleton />}>
//       <ErrorBoundary FallbackComponent={ErrorFallback}>
//         <WelcomeMsgSectionSuspense />
//       </ErrorBoundary>
//     </Suspense>
//   );
// };

// export const WelcomeMsgSectionSuspense = () => {
//   const [{ session }] = trpc.users.getSession.useSuspenseQuery();
//   const firstName = session?.user.name?.split(' ')[0];

//   return (
//     <div className='space-y-2 mb-4'>
//       <h2 className='text-3xl font-bold tracking-tight'>{`أهلًا ${firstName}، مرحبًا بعودتك 👋`}</h2>
//     </div>
//   );
// };
'use client';

import { Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { WelcomeMsgSectionSkeleton } from './skeleton';
import { ErrorFallback } from '@/components/error-fallback';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export const WelcomeMsgSection = () => {
  return (
    <Suspense fallback={<WelcomeMsgSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <WelcomeMsgSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const WelcomeMsgSectionContent = () => {
  const trpc = useTRPC();
  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );

  const firstName = useMemo(() => {
    // إذا ما في سطر كامل، نعيد 'ضيف'
    const fullName = session?.user.name ?? '';
    const [first = ''] = fullName.split(' ');
    return first || 'ضيف';
  }, [session]);

  return (
    <div className='space-y-2 mb-4'>
      <h2 className='text-3xl font-bold tracking-tight'>{`أهلًا ${firstName}، مرحبًا بعودتك 👋`}</h2>
    </div>
  );
};
