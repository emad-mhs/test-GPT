'use client';

import { TrackingSection } from '../sections/tracking-section';
import { Separator } from '@/components/ui/separator';
import { BreadCrumb } from '@/components/breadcrumb';
import { paths } from '@/lib/paths';

import { MailTypes } from '@/modules/secretary/mails/types';
import { FiltersSection } from '../sections/filters-section';

interface TrackingViewProps {
  search: string | undefined;
  type: MailTypes | undefined;
  senderId: string | undefined;
  receiverId: string | undefined;
}

const breadcrumbItems = [{ title: 'يجب متابعته', link: paths.trackingPage() }];

export const TrackingView = ({
  search,
  type,
  senderId,
  receiverId,
}: TrackingViewProps) => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Separator />
      <FiltersSection />
      <TrackingSection
        search={search}
        type={type}
        senderId={senderId}
        receiverId={receiverId}
      />
    </div>
  );
};
