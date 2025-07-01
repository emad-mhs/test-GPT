'use client';

import dynamic from 'next/dynamic';
import { paths } from '@/lib/paths';

import { BreadCrumb } from '@/components/breadcrumb';

import { Separator } from '@/components/ui/separator';

// Skeletons
const DocumentsSectionSkeleton = dynamic(
  () =>
    import('../sections/documents-section/skeleton').then(
      m => m.DocumentsSectionSkeleton
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
const DocumentsSection = dynamic(
  () => import('../sections/documents-section').then(m => m.DocumentsSection),
  { ssr: false, loading: () => <DocumentsSectionSkeleton /> }
);

const FiltersSection = dynamic(
  () => import('../sections/filter-section').then(m => m.FiltersSection),
  { ssr: false, loading: () => <FiltersSectionSkeleton /> }
);

const breadcrumbItems = [{ title: 'الملفات', link: paths.documentsPage() }];

export const DocumentsView = () => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Separator />
      <FiltersSection />
      <DocumentsSection />
    </div>
  );
};
