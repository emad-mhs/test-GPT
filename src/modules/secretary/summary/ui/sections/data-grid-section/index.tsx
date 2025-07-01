'use client';

import { FaMailBulk } from 'react-icons/fa';
import { BsMailbox2 } from 'react-icons/bs';
import { MdOutgoingMail } from 'react-icons/md';

import { formatDateRange } from '@/lib/utils';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { DataGridSectionSkeleton } from './skeleton';
import { DataCard } from '../../components/data-card';
import { ErrorFallback } from '@/components/error-fallback';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useFilters } from '@/hooks/use-filter-param';

export const DataGridSection = () => {
  return (
    <Suspense fallback={<DataGridSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DataGridSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const DataGridSectionSuspense = () => {
  const trpc = useTRPC();
  const {
    filters: { type, status, senderId, receiverId, from, to },
  } = useFilters();

  const {
    data: { data },
  } = useSuspenseQuery(
    trpc.summary.getMany.queryOptions({
      type,
      status,
      senderId,
      receiverId,
      from,
      to,
    })
  );

  const dateRangeLabel = formatDateRange({ to, from });

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
      <DataCard
        title='البريد'
        value={data.mailsCount}
        percentageChange={data.mailsChange}
        icon={FaMailBulk}
        dateRange={dateRangeLabel}
      />
      <DataCard
        title='الصادر'
        value={data.outgoingCount}
        percentageChange={data.outgoingChange}
        icon={MdOutgoingMail}
        dateRange={dateRangeLabel}
      />
      <DataCard
        title='الوارد'
        value={data.incomingCount}
        percentageChange={data.incomingChange}
        icon={BsMailbox2}
        dateRange={dateRangeLabel}
      />
    </div>
  );
};
