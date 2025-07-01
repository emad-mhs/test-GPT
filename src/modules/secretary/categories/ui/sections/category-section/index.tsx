'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { PencilIcon } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { paths } from '@/lib/paths';
import { useTRPC } from '@/trpc/client';
import { DEFAULT_LIMIT } from '@/constants';
import { Button } from '@/components/ui/button';
import { CategorySectionSkeleton } from './skeleton';
import { getIcon } from '@/modules/secretary/mails/utils';
import { InfiniteScroll } from '@/components/infinite-scroll';
import { ErrorFallback } from '@/components/error-fallback';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useFilters } from '@/hooks/use-filter-param';

interface CategorySectionProps {
  categoryId: string;
}

export const CategorySection = (props: CategorySectionProps) => {
  return (
    <Suspense fallback={<CategorySectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CategorySectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategorySectionSuspense = ({ categoryId }: CategorySectionProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const { filters } = useFilters();

  const { data: category } = useSuspenseQuery(
    trpc.categories.getOne.queryOptions({ categoryId })
  );
  const query = useSuspenseInfiniteQuery(
    trpc.categories.getCategoryItems.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        search: filters.search,
        categoryId,
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
      }
    )
  );
  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1  dark:shadow-card'>
      <div className='gap-y-2 flex flex-col md:flex-row items-start justify-between'>
        <h2 className='mb-4 text-3xl font-bold  '>{`مجلد ${category.name}`}</h2>

        <Button
          className='text-xs md:text-sm w-full md:w-auto'
          size='sm'
          asChild
        >
          <Link prefetch href={paths.categorySettingsPage({ categoryId })}>
            <PencilIcon className='size-4 ml-2' />
            تعديل المجلد
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader className='bg-muted'>
          <TableRow>
            <TableHead className='pr-6 w-[510px] text-right'>الموضوع</TableHead>
            <TableHead className='text-right'>النوع</TableHead>
            <TableHead className='text-right'>التاريخ</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {query.data.pages
            .flatMap(page => page.items)
            .map(item => {
              const itemUrl =
                item.type === 'document'
                  ? paths.documentPage({ documentId: item.id })
                  : paths.mailPage({ mailId: item.id });

              return (
                <TableRow
                  key={item.id}
                  className='cursor-pointer'
                  onClick={() => router.push(itemUrl)}
                  onMouseEnter={() => router.prefetch(itemUrl)}
                >
                  <TableCell className='pr-6 line-clamp-3'>
                    {item.subject}
                  </TableCell>
                  <TableCell>{getIcon(item.type as string)}</TableCell>
                  <TableCell className='text-right' dir='ltr'>
                    {format(item.createdAt, 'dd MMMM, yyyy')}
                  </TableCell>
                </TableRow>
              );
            })}
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
