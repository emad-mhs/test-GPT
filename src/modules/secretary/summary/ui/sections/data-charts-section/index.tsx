'use client';

import { Suspense } from 'react';
import { Chart } from '../../components/chart';
import { SpendingPie } from '../../components/spending-pie';
import { ErrorBoundary } from 'react-error-boundary';

import { useTRPC } from '@/trpc/client';
import { DataChartsSectionSkeleton } from './skeleton';
import { ErrorFallback } from '@/components/error-fallback';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useFilters } from '@/hooks/use-filter-param';

export const DataChartsSection = () => {
  return (
    <Suspense fallback={<DataChartsSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DataChartsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const DataChartsSectionSuspense = () => {
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

  return (
    <div className='grid grid-cols-1 lg:grid-cols-6 gap-8'>
      <div className='col-span-1 lg:col-span-3 xl:col-span-4'>
        <Chart data={data.days} />
      </div>
      <div className='col-span-1 lg:col-span-3 xl:col-span-2'>
        <SpendingPie data={data.categories} />
      </div>
    </div>
  );
};
