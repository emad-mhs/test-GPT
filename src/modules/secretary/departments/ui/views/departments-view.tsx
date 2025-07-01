'use client';

import dynamic from 'next/dynamic';

import { paths } from '@/lib/paths';
import { BreadCrumb } from '@/components/breadcrumb';

// Skeletons
const DepartmentsSectionSkeleton = dynamic(
  () =>
    import('../sections/departments-section/skeleton').then(
      m => m.DepartmentsSectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const DepartmentsSection = dynamic(
  () =>
    import('../sections/departments-section').then(m => m.DepartmentsSection),
  { ssr: false, loading: () => <DepartmentsSectionSkeleton /> }
);

const breadcrumbItems = [{ title: 'الإدارات', link: paths.departmentsPage() }];

export const DepartmentsView = () => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <DepartmentsSection />
    </div>
  );
};
