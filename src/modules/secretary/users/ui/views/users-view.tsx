'use client';

import dynamic from 'next/dynamic';

import { paths } from '@/lib/paths';

import { BreadCrumb } from '@/components/breadcrumb';

// Skeletons
const UsersSectionSkeleton = dynamic(
  () =>
    import('../sections/users-section/skeleton').then(
      m => m.UsersSectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const UsersSection = dynamic(
  () => import('../sections/users-section').then(m => m.UsersSection),
  { ssr: false, loading: () => <UsersSectionSkeleton /> }
);

const breadcrumbItems = [{ title: 'المستخدمون', link: paths.usersPage() }];

export const UsersView = () => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <UsersSection />
    </div>
  );
};
