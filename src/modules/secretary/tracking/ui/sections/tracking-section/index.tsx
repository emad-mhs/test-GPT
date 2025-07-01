import { Heading } from '@/components/heading';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/table';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/error-fallback';
import { useTRPC } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/constants';
import { InfiniteScroll } from '@/components/infinite-scroll';
import { MailTypes } from '@/modules/secretary/mails/types';
import { TrackingRow } from '../../components/tracking-row';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useFilters } from '@/hooks/use-filter-param';

export const TrackingSection = () => {
  return (
    <Suspense fallback={<p>loading</p>}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <TrackingSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const TrackingSectionSuspense = () => {
  const trpc = useTRPC();
  const { filters } = useFilters();

  const query = useSuspenseInfiniteQuery(
    trpc.tracking.dueSoon.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        search: filters.search,
        type: filters.type,
        senderId: filters.senderId,
        receiverId: filters.receiverId,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      }
    )
  );
  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
      <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
        <Heading title='البريد' description='البريد الذي حان موعد تسليمه' />
      </div>
      <Table>
        <TableHeader className='bg-muted'>
          <TableRow>
            <TableHead className='pr-6 max-w-lg text-right'>الموضوع</TableHead>
            <TableHead className='text-right'>النوع</TableHead>

            <TableHead className='text-right max-w-60'>
              المرسل/ المستلم
            </TableHead>
            <TableHead className='text-right max-w-60'>نسخة لـ </TableHead>
            <TableHead className='text-right max-w-60'>
              الإدارة المختصة
            </TableHead>
            <TableHead className='text-right max-w-36'>التاريخ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {query.data.pages
            .flatMap(page => page.items)
            .map(mail => (
              <TrackingRow
                key={mail.id}
                mail={{ ...mail, type: mail.type as MailTypes }}
              />
            ))}
        </TableBody>
      </Table>

      <InfiniteScroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
