'use client';

import { MailStatuses, MailTypes } from '@/modules/secretary/mails/types';
import { FiltersSection } from '@/modules/secretary/mails/ui/sections/filters-section';
import { WelcomeMsgSection } from '@/modules/secretary/summary/ui/sections/welcome-msg-section';

import { DataChartsSection } from '../sections/data-charts-section';
import { DataGridSection } from '../sections/data-grid-section';

interface SummaryViewProps {
  type: MailTypes | undefined;
  status: MailStatuses | undefined;
  senderId: string | undefined;
  receiverId: string | undefined;
  from: string | undefined;
  to: string | undefined;
}

export const SummaryView = ({
  type,
  status,
  senderId,
  receiverId,
  from,
  to,
}: SummaryViewProps) => {
  return (
    <main className='px-3 pt-6'>
      <WelcomeMsgSection />
      <FiltersSection />
      <div className='max-w-(--breakpoint-2xl) mx-auto w-full pb-10 '>
        <DataGridSection
          type={type}
          status={status}
          senderId={senderId}
          receiverId={receiverId}
          from={from}
          to={to}
        />
        <DataChartsSection
          type={type}
          status={status}
          senderId={senderId}
          receiverId={receiverId}
          from={from}
          to={to}
        />
      </div>
    </main>
  );
};
