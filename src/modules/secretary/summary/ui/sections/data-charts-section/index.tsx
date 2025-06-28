'use client';

import { Suspense } from 'react';
import { Chart } from '../../components/chart';
import { SpendingPie } from '../../components/spending-pie';
import { ErrorBoundary } from 'react-error-boundary';

import { useTRPC } from '@/trpc/client';
import { MailStatuses, MailTypes } from '@/modules/secretary/mails/types';
import { DataChartsSectionSkeleton } from './skeleton';
import { ErrorFallback } from '@/components/error-fallback';
import { useSuspenseQuery } from '@tanstack/react-query';

interface DataChartsSectionProps {
  // search: string | undefined;
  type: MailTypes | undefined;
  status: MailStatuses | undefined;
  senderId: string | undefined;
  receiverId: string | undefined;
  from: string | undefined;
  to: string | undefined;
}

export const DataChartsSection = (props: DataChartsSectionProps) => {
  return (
    <Suspense fallback={<DataChartsSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DataChartsSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const DataChartsSectionSuspense = ({
  type,
  status,
  senderId,
  receiverId,
  from,
  to,
}: DataChartsSectionProps) => {
  const trpc = useTRPC();
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
