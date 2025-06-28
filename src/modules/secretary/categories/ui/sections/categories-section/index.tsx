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
import { DEFAULT_LIMIT } from '@/constants';
import { useTRPC } from '@/trpc/client';

import { InfiniteScroll } from '@/components/infinite-scroll';

import { CategoriesSectionSkeleton } from './skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreateCategoryModal } from '../../../hooks/use-create-category-modal';
import { Heading } from '@/components/heading';
import { ErrorFallback } from '@/components/error-fallback';
import { CategoryRow } from '../../components/category-row';
import { Paginated } from '@/types/paginated-type';
import { Category } from '../../../types';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

interface CategoriesSectionProps {
  search: string | undefined;
}

export const CategoriesSection = (props: CategoriesSectionProps) => {
  return (
    <Suspense fallback={<CategoriesSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <CategoriesSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const CategoriesSectionSuspense = ({ search }: CategoriesSectionProps) => {
  const trpc = useTRPC();

  const newCategory = useCreateCategoryModal();
  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );

  const query = useSuspenseInfiniteQuery(
    trpc.categories.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        search,
      },
      {
        getNextPageParam: (lastPage: Paginated<Category>) =>
          lastPage.nextCursor,
      }
    )
  );
  const canAdd = session?.user.canAdd;

  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
      <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
        <Heading title='المجلدات' description='التحكم بملفات ومجلدات الوزارة' />

        {canAdd && (
          <Button
            className='text-xs md:text-sm w-full md:w-auto'
            onClick={newCategory.open}
            size='sm'
          >
            <Plus className='size-4 ml-2' />
            إضافة جديد
          </Button>
        )}
      </div>

      <Table>
        <TableHeader className='bg-muted'>
          <TableRow className='border-none uppercase [&>th]:text-right'>
            <TableHead className='w-[510px] '>اسم المجلد</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {query.data.pages
            .flatMap(page => page.items)
            .map(category => (
              <CategoryRow key={category.id} category={category} />
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
