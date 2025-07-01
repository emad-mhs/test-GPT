// src/modules/secretary/summary/ui/views/summary-view.tsx
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
// import { DataGridSectionSkeleton } from '../sections/data-grid-section/skeleton';
// import { DataChartsSectionSkeleton } from '../sections/data-charts-section/skeleton';
// import { WelcomeMsgSection } from '../sections/welcome-msg-section';
// import { FiltersSection } from '@/modules/secretary/audit/ui/sections/filter-section';

//ـ Skeletons
const WelcomeMsgSectionSkeleton = dynamic(
  () =>
    import('../sections/welcome-msg-section/skeleton').then(
      m => m.WelcomeMsgSectionSkeleton
    ),
  { ssr: false }
);
const FiltersSectionSkeleton = dynamic(
  () =>
    import(
      '@/modules/secretary/audit/ui/sections/filter-section/skeleton'
    ).then(m => m.FiltersSectionSkeleton),
  { ssr: false }
);
const DataGridSectionSkeleton = dynamic(
  () =>
    import(
      '@/modules/secretary/summary/ui/sections/data-grid-section/skeleton'
    ).then(m => m.DataGridSectionSkeleton),
  { ssr: false }
);
const DataChartsSectionSkeleton = dynamic(
  () =>
    import(
      '@/modules/secretary/summary/ui/sections/data-charts-section/skeleton'
    ).then(m => m.DataChartsSectionSkeleton),
  { ssr: false }
);

// lazy-load مع عرض الـ Skeleton أثناء التحميل
const WelcomeMsgSection = dynamic(
  () =>
    import('@/modules/secretary/summary/ui/sections/welcome-msg-section').then(
      m => m.WelcomeMsgSection
    ),
  { ssr: false, loading: () => <WelcomeMsgSectionSkeleton /> }
);
const FiltersSection = dynamic(
  () =>
    import('@/modules/secretary/mails/ui/sections/filters-section').then(
      m => m.FiltersSection
    ),
  { ssr: false, loading: () => <FiltersSectionSkeleton /> }
);

const DataGridSection = dynamic(
  () =>
    import('../sections/data-grid-section').then(mod => mod.DataGridSection),
  {
    loading: () => <DataGridSectionSkeleton />,
    ssr: false, // منع التشغيل على السيرفر لأنّه يعتمد على الـ hooks
  }
);

const DataChartsSection = dynamic(
  () =>
    import('../sections/data-charts-section').then(
      mod => mod.DataChartsSection
    ),
  {
    loading: () => <DataChartsSectionSkeleton />,
    ssr: false,
  }
);

export const SummaryView = () => {
  return (
    <main className='px-3 pt-6'>
      <WelcomeMsgSection />
      <FiltersSection />

      <div className='max-w-(--breakpoint-2xl) mx-auto w-full pb-10'>
        {/* الجدول سَيُحمّل lazy وتظهر الـ Skeleton */}
        <DataGridSection />

        {/* المخططات كذلك */}
        <DataChartsSection />
      </div>
    </main>
  );
};
