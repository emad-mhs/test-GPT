'use client';

import { paths } from '@/lib/paths';

import { BreadCrumb } from '@/components/breadcrumb';

import { UsersSection } from '../sections/users-section';

interface UsersViewProps {
  search: string | undefined;
}

const breadcrumbItems = [{ title: 'المستخدمون', link: paths.usersPage() }];

export const UsersView = ({ search }: UsersViewProps) => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <UsersSection search={search} />
    </div>
  );
};
