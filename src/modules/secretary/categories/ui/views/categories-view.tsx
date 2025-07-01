'use client';

import dynamic from 'next/dynamic';

import { paths } from '@/lib/paths';

import { BreadCrumb } from '@/components/breadcrumb';

// Skeletons
const CategoriesSectionSkeleton = dynamic(
  () =>
    import('../sections/categories-section/skeleton').then(
      m => m.CategoriesSectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const CategoriesSection = dynamic(
  () => import('../sections/categories-section').then(m => m.CategoriesSection),
  { ssr: false, loading: () => <CategoriesSectionSkeleton /> }
);

const breadcrumbItems = [{ title: 'المجلدات', link: paths.categoriesPage() }];

export const CategoriesView = () => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <CategoriesSection />
    </div>
  );
};
