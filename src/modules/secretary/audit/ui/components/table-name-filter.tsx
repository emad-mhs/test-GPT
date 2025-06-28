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
import { Mails } from 'lucide-react';
import { TABLE_NAME_TYPES } from '../../types';

export const TableNameFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const tableName = params.get('tableName') || 'all';
  const userId = params.get('userId');
  const from = params.get('from');
  const to = params.get('to');

  // const { isLoading: isLoadingSummary } = useGetSummary();

  const onChange = (newValue: string) => {
    const query = {
      tableName: newValue,
      userId,
      from,
      to,
    };

    if (newValue === 'all') {
      query.tableName = '';
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
      value={tableName}
      onValueChange={onChange}
      // disabled={isLoadingSummary}
    >
      <SelectTrigger className='lg:w-auto w-full justify-between h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 focus:ring-offset-0 focus:ring-transparent outline-hidden text-muted-foreground focus:bg-white/30 transition'>
        <Mails className='size-4 ml-2 text-muted-foreground' />
        <SelectValue className='ml-2' placeholder='اختر نوع البريد' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>كل الجداول</SelectItem>
        {TABLE_NAME_TYPES.map(type => (
          <SelectItem key={type.value} value={type.value}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
