'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FiltersSectionSkeleton } from './skeleton';
import { DateFilter } from '@/components/date-filter';

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
  return (
    <div className='flex flex-col my-5  items-end gap-y-2 lg:gap-y-0 lg:gap-x-2'>
      <DateFilter />
    </div>
  );
};
