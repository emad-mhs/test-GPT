'use client';

import { Separator } from '@/components/ui/separator';
import { BreadCrumb } from '@/components/breadcrumb';
import { paths } from '@/lib/paths';
import { AuditLogsSection } from '../sections/audit-section';
import { FiltersSection } from '../sections/filter-section';
import { TableNames } from '../../types';

interface AuditLogsViewProps {
  tableName: TableNames | undefined;
  userId: string | undefined;
  from: string | undefined;
  to: string | undefined;
}

const breadcrumbItems = [
  { title: 'سجل التعديلات', link: paths.auditLogsPage() },
];

export const AuditLogsView = ({
  tableName,
  userId,
  from,
  to,
}: AuditLogsViewProps) => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Separator />
      <FiltersSection />
      <div className='max-w-(--breakpoint-2xl) mx-auto w-full pb-10 '>
        <AuditLogsSection
          tableName={tableName}
          userId={userId}
          from={from}
          to={to}
        />
      </div>
    </div>
  );
};
