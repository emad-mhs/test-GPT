'use client';

import { paths } from '@/lib/paths';

import { CategoriesSection } from '../sections/categories-section';
import { BreadCrumb } from '@/components/breadcrumb';

interface CategoriesViewProps {
  search: string | undefined;
}

const breadcrumbItems = [{ title: 'المجلدات', link: paths.categoriesPage() }];

export const CategoriesView = ({ search }: CategoriesViewProps) => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>

      <CategoriesSection search={search} />
    </div>
  );
};
