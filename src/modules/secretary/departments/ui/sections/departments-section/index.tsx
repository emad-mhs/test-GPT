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
// import { DEFAULT_LIMIT } from '@/constants';
import { useTRPC } from '@/trpc/client';

import { InfiniteScroll } from '@/components/infinite-scroll';
import { DepartmentsSectionSkeleton } from './skeleton';
import { useCreateDepartmentModal } from '../../../hooks/use-create-department-modal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Heading } from '@/components/heading';
import { DEFAULT_LIMIT } from '@/constants';
import { ErrorFallback } from '@/components/error-fallback';
import { DepartmentRow } from '../../components/department-row';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

interface DepartmentsSectionProps {
  search: string | undefined;
}

export const DepartmentsSection = (props: DepartmentsSectionProps) => {
  return (
    <Suspense fallback={<DepartmentsSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <DepartmentsSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const DepartmentsSectionSuspense = ({ search }: DepartmentsSectionProps) => {
  const trpc = useTRPC();
  const newDepartment = useCreateDepartmentModal();

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const canAdd = session?.user.canAdd;

  const query = useSuspenseInfiniteQuery(
    trpc.departments.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        search,
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
          title='الإدارات'
          description='التحكم بالإدارات العامة في الوزارة'
        />

        {canAdd && (
          <Button
            className='text-xs md:text-sm w-full md:w-auto'
            onClick={newDepartment.open}
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
            <TableHead className='text-right max-w-2.5'>الرقم</TableHead>
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
            .map(department => (
              <DepartmentRow key={department.id} department={department} />
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
