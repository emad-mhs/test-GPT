'use client';

import dynamic from 'next/dynamic';

import { paths } from '@/lib/paths';
import { BreadCrumb } from '@/components/breadcrumb';

// Skeletons
const ContactsSectionSkeleton = dynamic(
  () =>
    import('../sections/contacts-section/skeleton').then(
      m => m.ContactsSectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const ContactsSection = dynamic(
  () => import('../sections/contacts-section').then(m => m.ContactsSection),
  { ssr: false, loading: () => <ContactsSectionSkeleton /> }
);

const breadcrumbItems = [{ title: 'جهات الاتصال', link: paths.contactsPage() }];

export const ContactsView = () => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <ContactsSection />
    </div>
  );
};
