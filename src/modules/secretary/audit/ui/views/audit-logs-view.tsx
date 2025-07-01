'use client';

import dynamic from 'next/dynamic';

import { Separator } from '@/components/ui/separator';
import { BreadCrumb } from '@/components/breadcrumb';
import { paths } from '@/lib/paths';

// Skeletons
const AuditLogsSectionSkeleton = dynamic(
  () =>
    import('../sections/audit-section/skeleton').then(
      m => m.AuditLogsSectionSkeleton
    ),
  { ssr: false }
);

const FiltersSectionSkeleton = dynamic(
  () =>
    import('../sections/filter-section/skeleton').then(
      m => m.FiltersSectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const AuditLogsSection = dynamic(
  () => import('../sections/audit-section').then(m => m.AuditLogsSection),
  { ssr: false, loading: () => <AuditLogsSectionSkeleton /> }
);

const FiltersSection = dynamic(
  () => import('../sections/filter-section').then(m => m.FiltersSection),
  { ssr: false, loading: () => <FiltersSectionSkeleton /> }
);

const breadcrumbItems = [
  { title: 'سجل التعديلات', link: paths.auditLogsPage() },
];

export const AuditLogsView = () => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Separator />
      <FiltersSection />
      <div className='max-w-(--breakpoint-2xl) mx-auto w-full pb-10 '>
        <AuditLogsSection />
      </div>
    </div>
  );
};
