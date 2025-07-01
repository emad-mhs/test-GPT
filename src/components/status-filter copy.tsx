'use client';

import qs from 'query-string';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { ListChecksIcon } from 'lucide-react';
import { MAIL_STATUSES } from '../modules/secretary/mails/types';

export const StatusFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const status = params.get('status') || 'all';
  const type = params.get('type');
  const search = params.get('search');
  const senderId = params.get('senderId');
  const receiverId = params.get('receiverId');
  const from = params.get('from');
  const to = params.get('to');

  // const { isLoading: isLoadingSummary } = useGetSummary();

  const onChange = (newValue: string) => {
    const query = {
      status: newValue,
      type,
      search,
      senderId,
      receiverId,
      from,
      to,
    };

    if (newValue === 'all') {
      query.status = '';
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <Select
      dir='rtl'
      value={status}
      onValueChange={onChange}
      // disabled={isLoadingSummary}
    >
      <SelectTrigger className='lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 focus:ring-offset-0 focus:ring-transparent outline-hidden text-muted-foreground focus:bg-white/30 transition'>
        <ListChecksIcon className='size-4 ml-2 text-muted-foreground' />
        <SelectValue placeholder='كل الحالات' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>كل الحالات</SelectItem>
        {MAIL_STATUSES.map(status => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
