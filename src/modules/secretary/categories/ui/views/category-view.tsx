'use client';

import dynamic from 'next/dynamic';

import { paths } from '@/lib/paths';
import { BreadCrumb } from '@/components/breadcrumb';

// Skeletons
const CategorySectionSkeleton = dynamic(
  () =>
    import('../sections/category-section/skeleton').then(
      m => m.CategorySectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const CategorySection = dynamic(
  () => import('../sections/category-section').then(m => m.CategorySection),
  { ssr: false, loading: () => <CategorySectionSkeleton /> }
);

const breadcrumbItems = [{ title: 'المجلدات', link: paths.categoriesPage() }];

interface PageProps {
  categoryId: string;
}

export const CategoryView = ({ categoryId }: PageProps) => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <CategorySection categoryId={categoryId} />
    </div>
  );
};
