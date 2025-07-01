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
import { ContactsSectionSkeleton } from './skeleton';
import { Button } from '@/components/ui/button';

import { Plus } from 'lucide-react';
import { UserRoles } from '@/modules/auth/types';
import { useCreateContactModal } from '../../../hooks/use-create-contact-modal';
import { Heading } from '@/components/heading';
import { ErrorFallback } from '@/components/error-fallback';
import { ContactRow } from '../../components/contact-row';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useFilters } from '@/hooks/use-filter-param';

export const ContactsSection = () => {
  return (
    <Suspense fallback={<ContactsSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ContactsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const ContactsSectionSuspense = () => {
  const trpc = useTRPC();
  const { filters } = useFilters();

  const newContact = useCreateContactModal();

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );

  const query = useSuspenseInfiniteQuery(
    trpc.contacts.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        search: filters.search,
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
      }
    )
  );
  const canAdd = session.user.canAdd;
  const havePermission =
    session?.user.role === UserRoles.ADMIN ||
    session?.user.role === UserRoles.MANAGER;

  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
      <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
        <Heading
          title='جهات الاتصال '
          description='التحكم بجهات اتصال وعملاء الوزارة'
        />

        {canAdd && havePermission && (
          <Button
            className='text-xs md:text-sm w-full md:w-auto'
            onClick={newContact.open}
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
            <TableHead className='pr-6 w-[510px] text-right'>
              المسمى الوظيفي
            </TableHead>
            <TableHead className='text-right'>الاسم</TableHead>
            <TableHead className='text-right'>الإيميل</TableHead>
            <TableHead className='text-right'>الهاتف</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {query.data.pages
            .flatMap(page => page.items)
            .map(contact => (
              <ContactRow key={contact.id} contact={contact} />
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
