'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FiltersSectionSkeleton } from './skeleton';
import { TypeFilter } from '@/components/type-filter';
import { SenderSwitcher } from '@/components/sender-switcher';
import { ReceiverSwitcher } from '@/components/receiver-switcher';
import { useContactsOptions } from '@/hooks/use-options';

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
  // const [{ data: contacts }] = trpc.contacts.getAll.useSuspenseQuery();

  // const contactOptions = contacts.map(contact => ({
  //   value: contact.id,
  //   label: contact.jobTitle,
  // }));
  const contactOpts = useContactsOptions();

  const senderOptions = [
    { label: 'كل الجهات المرسلة', value: 'all' },
    ...contactOpts,
  ];

  const receiverOptions = [
    { label: 'كل الجهات المستلمة', value: 'all' },
    ...contactOpts,
  ];

  return (
    <div className='flex flex-col my-5 lg:flex-row lg:flex-wrap items-center gap-y-2 lg:gap-y-0 lg:gap-x-2'>
      <TypeFilter />
      <div className='lg:max-w-fit w-full'>
        <SenderSwitcher
          options={senderOptions}
          placeholder='اختر الجهة المرسلة'
        />
      </div>
      <div className='lg:max-w-fit w-full'>
        <ReceiverSwitcher
          options={receiverOptions}
          placeholder='اختر الجهة المستلمة'
        />
      </div>

      {/* <StatusFilter /> */}
      {/* <DateFilter /> */}
    </div>
  );
};
