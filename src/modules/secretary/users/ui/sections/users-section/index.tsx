'use client';

import { Suspense } from 'react';
import { Plus } from 'lucide-react';
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

import { UsersSectionSkeleton } from './skeleton';

import { Heading } from '@/components/heading';
import { useCreateUserModal } from '../../../hooks/use-create-user-modal';
import { Button } from '@/components/ui/button';
import { UserRow } from '../../components/user-row';
import { UserRoles } from '@/modules/auth/types';
import { ErrorFallback } from '@/components/error-fallback';
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';

interface UsersSectionProps {
  search: string | undefined;
}

export const UsersSection = (props: UsersSectionProps) => {
  return (
    <Suspense fallback={<UsersSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <UsersSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const UsersSectionSuspense = ({ search }: UsersSectionProps) => {
  const trpc = useTRPC();

  const newUser = useCreateUserModal();

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const canAdd = session?.user.canAdd;

  const query = useSuspenseInfiniteQuery(
    trpc.users.getMany.infiniteQueryOptions(
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
      <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start  justify-between'>
        <Heading
          title='المستخدمون'
          description='التحكم بمستخدمي البوابة الالكترونية'
        />

        {canAdd && (
          <Button
            className='text-xs md:text-sm w-full md:w-auto'
            onClick={newUser.open}
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
            <TableHead className='text-right pr-6'>الاسم</TableHead>
            <TableHead className='text-right'>الإيميل</TableHead>
            <TableHead className='text-right'>الإدارة</TableHead>
            <TableHead className='text-right'>التصريح</TableHead>
            <TableHead className='text-right w-32'>المصادقة الثنائية</TableHead>
            <TableHead className='text-right w-32'>صلاحيات الإضافة</TableHead>
            <TableHead className='text-right w-32'>صلاحيات التعديل</TableHead>
            <TableHead className='text-right w-32'>صلاحيات الحذف </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {query.data.pages
            .flatMap(page => page.items)
            .map(user => (
              <UserRow
                key={user.id}
                user={{ ...user, role: user.role as UserRoles }}
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
