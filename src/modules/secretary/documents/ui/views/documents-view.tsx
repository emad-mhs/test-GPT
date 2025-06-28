'use client';

import { paths } from '@/lib/paths';

import { BreadCrumb } from '@/components/breadcrumb';

import { DocumentsSection } from '../sections/documents-section';
import { Separator } from '@/components/ui/separator';
import { FiltersSection } from '../sections/filter-section';

interface DocumentsViewProps {
  search: string | undefined;
  from: string | undefined;
  to: string | undefined;
}

const breadcrumbItems = [{ title: 'الملفات', link: paths.documentsPage() }];

export const DocumentsView = ({ search, from, to }: DocumentsViewProps) => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Separator />
      <FiltersSection />
      <DocumentsSection search={search} from={from} to={to} />
    </div>
  );
};
