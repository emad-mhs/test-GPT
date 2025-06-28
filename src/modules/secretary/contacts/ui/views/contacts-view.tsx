'use client';

import { paths } from '@/lib/paths';
import { BreadCrumb } from '@/components/breadcrumb';
import { ContactsSection } from '../sections/contacts-section';

interface ContactsViewProps {
  search: string | undefined;
}

const breadcrumbItems = [{ title: 'جهات الاتصال', link: paths.contactsPage() }];

export const ContactsView = ({ search }: ContactsViewProps) => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <ContactsSection search={search} />
    </div>
  );
};
