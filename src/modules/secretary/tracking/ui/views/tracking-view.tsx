'use client';

import dynamic from 'next/dynamic';

import { paths } from '@/lib/paths';
import { Separator } from '@/components/ui/separator';
import { BreadCrumb } from '@/components/breadcrumb';

// Skeletons
const FiltersSkeleton = dynamic(
  () =>
    import('../sections/filters-section/skeleton').then(
      m => m.FiltersSectionSkeleton
    ),
  { ssr: false }
);

const TrackingSkeleton = dynamic(
  () =>
    import('../sections/tracking-section/skeleton').then(
      m => m.TrackingSectionSkeleton
    ),
  { ssr: false }
);

// Lazy Components
const FiltersSection = dynamic(
  () => import('../sections/filters-section').then(m => m.FiltersSection),
  { ssr: false, loading: () => <FiltersSkeleton /> }
);

const TrackingSection = dynamic(
  () => import('../sections/tracking-section').then(m => m.TrackingSection),
  { ssr: false, loading: () => <TrackingSkeleton /> }
);

const breadcrumbItems = [{ title: 'يجب متابعته', link: paths.trackingPage() }];

export const TrackingView = () => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Separator />
      <FiltersSection />
      <TrackingSection />
    </div>
  );
};
