'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mails } from 'lucide-react';
import { MAIL_TYPES } from '../modules/secretary/mails/types';
import { useFilters } from '@/hooks/use-filter-param';

export const TypeFilter = () => {
  const { filters, setType } = useFilters();

  return (
    <Select dir='rtl' value={filters.type ?? 'all'} onValueChange={setType}>
      <SelectTrigger className='lg:w-auto w-full justify-between h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 outline-hidden text-muted-foreground transition'>
        <Mails className='size-4 ml-2 text-muted-foreground' />
        <SelectValue className='ml-2' placeholder='اختر نوع البريد' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='all'>كل البريد</SelectItem>
        {MAIL_TYPES.map(t => (
          <SelectItem key={t.value} value={t.value}>
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
