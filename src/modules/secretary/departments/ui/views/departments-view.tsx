'use client';

import { paths } from '@/lib/paths';

import { BreadCrumb } from '@/components/breadcrumb';

import { DepartmentsSection } from '../sections/departments-section';

interface DepartmentsViewProps {
  search: string | undefined;
}

const breadcrumbItems = [{ title: 'الإدارات', link: paths.departmentsPage() }];

export const DepartmentsView = ({ search }: DepartmentsViewProps) => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <DepartmentsSection search={search} />
    </div>
  );
};
