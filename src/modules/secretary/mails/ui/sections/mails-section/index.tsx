'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { useTRPC } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/constants';
import { InfiniteScroll } from '@/components/infinite-scroll';

import { MailStatuses, MailTypes } from '../../../types';
import { Heading } from '@/components/heading';
import { useCreateMailModal } from '../../../hooks/use-create-mail-modal';
import { MailsSectionSkeleton } from './skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { MailRow } from '../../components/mail-row';
import { ErrorFallback } from '@/components/error-fallback';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

interface MailsSectionProps {
  search: string | undefined;
  type: MailTypes | undefined;
  status: MailStatuses | undefined;
  senderId: string | undefined;
  receiverId: string | undefined;
  from: string | undefined;
  to: string | undefined;
}

export const MailsSection = (props: MailsSectionProps) => {
  return (
    <Suspense fallback={<MailsSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <MailsSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const MailsSectionSuspense = ({
  search,
  type,
  status,
  senderId,
  receiverId,
  from,
  to,
}: MailsSectionProps) => {
  const trpc = useTRPC();
  const newMail = useCreateMailModal();

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const canAdd = session?.user.canAdd;

  // const [mails, query] = trpc.mails.getMany.useSuspenseInfiniteQuery(
  //   {
  //     limit: DEFAULT_LIMIT,
  //     search,
  //     type,
  //     status,
  //     senderId,
  //     receiverId,
  //     from,
  //     to,
  //   },
  //   {
  //     getNextPageParam: lastPage => lastPage.nextCursor,
  //   }
  // );

  const query = useSuspenseInfiniteQuery(
    trpc.mails.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        search,
        type,
        status,
        senderId,
        receiverId,
        from,
        to,
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
      }
    )
  );
  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
      <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
        <Heading
          title='البريد'
          description='التحكم بالبريد الصادر والوارد في الوزارة'
        />

        {canAdd && (
          <Button
            className='text-xs md:text-sm w-full md:w-auto'
            onClick={newMail.open}
            size='sm'
          >
            <Plus className='size-4 ml-2' />
            إضافة جديد
          </Button>
        )}
      </div>
      <Table>
        <TableHeader className='bg-muted'>
          <TableRow>
            <TableHead className='pr-6 max-w-lg text-right'>الموضوع</TableHead>
            <TableHead className='text-right'>النوع</TableHead>
            <TableHead className='text-right max-w-60'>
              المرسل/ المستلم
            </TableHead>
            <TableHead className='text-right max-w-36'>التاريخ</TableHead>
            <TableHead className='text-right max-w-28'>المرجع</TableHead>
            <TableHead className='text-right'>الحالة</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {query.data.pages
            .flatMap(page => page.items)
            .map(mail => (
              <MailRow
                key={mail.id}
                mail={{
                  ...mail,
                  type: mail.type as MailTypes,
                  status: mail.status as MailStatuses,
                }}
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
