'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FiltersSectionSkeleton } from './skeleton';
import { DateFilter } from '@/components/date-filter';
import { TableNameFilter } from '../../components/table-name-filter';
import { UserSwitcher } from '../../components/user-switcher';
import { useUsersOptions } from '@/hooks/use-options';

export const FiltersSection = () => {
  return (
    <Suspense fallback={<FiltersSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <FiltersSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const FiltersSectionSuspense = () => {
  // const [{ data: users }] = trpc.users.getAll.useSuspenseQuery();

  // const Options = users.map(user => ({
  //   value: user.id,
  //   label: user.name,
  // }));
  const userOpts = useUsersOptions();

  const userOptions = [{ label: 'كل المستخدمون', value: 'all' }, ...userOpts];

  return (
    <div className='flex flex-col my-5 lg:flex-row lg:flex-wrap items-center gap-y-2 lg:gap-y-0 lg:gap-x-2'>
      <TableNameFilter />
      <div className='lg:max-w-fit w-full'>
        <UserSwitcher options={userOptions} placeholder='اختر اسم المستخدم' />
      </div>
      <div className='lg:max-w-fit w-full'>
        {/* <ReceiverSwitcher
          options={receiverOptions}
          placeholder='اختر الجهة المستلمة'
        /> */}
      </div>

      {/* <StatusFilter /> */}
      <DateFilter />
    </div>
  );
};
