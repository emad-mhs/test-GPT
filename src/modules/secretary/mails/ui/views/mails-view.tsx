'use client';

// import { useRouter } from 'next/navigation';
// import { ArrowRightIcon, Plus } from 'lucide-react';

import { paths } from '@/lib/paths';

// import { Heading } from '@/components/heading';
// import { Button } from '@/components/ui/button';
import { BreadCrumb } from '@/components/breadcrumb';
import { Separator } from '@/components/ui/separator';

import { MailStatuses, MailTypes } from '../../types';
import { MailsSection } from '../sections/mails-section';
import { FiltersSection } from '../sections/filters-section';
// import { useCreateMailModal } from '../../hooks/use-create-mail-modal';
// import { trpc } from '@/trpc/client';

interface MailsViewProps {
  search: string | undefined;
  type: MailTypes | undefined;
  status: MailStatuses | undefined;
  senderId: string | undefined;
  receiverId: string | undefined;
  from: string | undefined;
  to: string | undefined;
}

const breadcrumbItems = [{ title: 'البريد', link: paths.mailsPage() }];

export const MailsView = ({
  search,
  type,
  status,
  senderId,
  receiverId,
  from,
  to,
}: MailsViewProps) => {
  // const router = useRouter();
  // const newMail = useCreateMailModal();

  // const [{ session }] = trpc.users.getSession.useSuspenseQuery();

  // const canAdd = session?.user.canAdd;

  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
      </div>
      <Separator />
      <FiltersSection />
      <MailsSection
        search={search}
        type={type}
        status={status}
        senderId={senderId}
        receiverId={receiverId}
        from={from}
        to={to}
      />
    </div>
  );
};
