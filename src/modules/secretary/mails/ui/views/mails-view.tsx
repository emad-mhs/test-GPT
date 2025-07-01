'use client';

import dynamic from 'next/dynamic';

import { paths } from '@/lib/paths';

import { BreadCrumb } from '@/components/breadcrumb';
import { Separator } from '@/components/ui/separator';

// Skeletons
const MailsSectionSkeleton = dynamic(
  () =>
    import('../sections/mails-section/skeleton').then(
      m => m.MailsSectionSkeleton
    ),
  { ssr: false }
);

const FiltersSectionSkeleton = dynamic(
  () =>
    import('../sections/filters-section/skeleton').then(
      m => m.FiltersSectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const MailsSection = dynamic(
  () => import('../sections/mails-section').then(m => m.MailsSection),
  { ssr: false, loading: () => <MailsSectionSkeleton /> }
);

const FiltersSection = dynamic(
  () => import('../sections/filters-section').then(m => m.FiltersSection),
  { ssr: false, loading: () => <FiltersSectionSkeleton /> }
);

const breadcrumbItems = [{ title: 'البريد', link: paths.mailsPage() }];

export const MailsView = () => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Separator />
      <FiltersSection />
      <MailsSection />
    </div>
  );
};
