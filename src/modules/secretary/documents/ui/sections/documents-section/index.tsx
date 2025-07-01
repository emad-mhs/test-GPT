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
import { DocumentsSectionSkeleton } from './skeleton';
import { useCreateDocumentModal } from '../../../hooks/use-create-document-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Heading } from '@/components/heading';
import { ErrorFallback } from '@/components/error-fallback';
import { DocumentRow } from '../../components/document-row';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useFilters } from '@/hooks/use-filter-param';

export const DocumentsSection = () => {
  return (
    <Suspense fallback={<DocumentsSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DocumentsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const DocumentsSectionSuspense = () => {
  const trpc = useTRPC();
  const { filters } = useFilters();

  const newDocument = useCreateDocumentModal();

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const canAdd = session?.user.canAdd;

  const query = useSuspenseInfiniteQuery(
    trpc.documents.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        search: filters.search,
        from: filters.from,
        to: filters.to,
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
      }
    )
  );

  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
      <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
        <Heading title='الملفات' description='التحكم بمستندات ووثائق الوزارة' />

        {canAdd && (
          <Button
            className='text-xs md:text-sm w-full md:w-auto'
            onClick={newDocument.open}
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
            <TableHead className='pr-6 w-[510px] text-right'>الموضوع</TableHead>
            <TableHead className='text-right'>المجلد</TableHead>
            <TableHead className='text-right'>التاريخ</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {query.data.pages
            .flatMap(page => page.items)
            .map(document => (
              <DocumentRow key={document.id} document={document} />
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
