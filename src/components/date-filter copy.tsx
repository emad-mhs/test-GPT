'use client';

import qs from 'query-string';
import { useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from '@/components/ui/popover';
import { formatDateRange } from '@/lib/utils';

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse only if both from & to exist
  const initial = useMemo<DateRange | undefined>(() => {
    const f = searchParams.get('from');
    const t = searchParams.get('to');
    if (f && t) {
      const from = new Date(f);
      const to = new Date(t);
      if (!isNaN(from.valueOf()) && !isNaN(to.valueOf())) {
        return { from, to };
      }
    }
    return undefined;
  }, [searchParams]);

  const [date, setDate] = useState<DateRange | undefined>(initial);

  const pushToUrl = (range: DateRange | undefined) => {
    const query: Record<string, string | undefined> = {
      // only include from/to if range is defined
      from: range?.from?.toISOString().slice(0, 10),
      to: range?.to?.toISOString().slice(0, 10),
      // preserve other filters
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      senderId: searchParams.get('senderId') || undefined,
      receiverId: searchParams.get('receiverId') || undefined,
      tableName: searchParams.get('tableName') || undefined,
      userId: searchParams.get('userId') || undefined,
    };

    const url = qs.stringifyUrl(
      { url: pathname, query },
      { skipEmptyString: true, skipNull: true }
    );
    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  const label = date ? formatDateRange(date) : 'التاريخ'; // or any placeholder you like

  const isApplyDisabled = !(date?.from && date?.to);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size='sm'
          variant='outline'
          className='flex-row justify-between w-full lg:w-auto h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-muted-foreground text-muted-foreground transition'
        >
          <CalendarIcon className='ml-2 h-4 w-4' />
          <span>{label}</span>
          <ChevronDown className='mr-2 size-4 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-full lg:w-auto p-0' align='start'>
        <Calendar
          mode='range'
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />

        <div className='p-4 flex gap-x-2'>
          <Button
            variant='secondary'
            className='flex-1'
            onClick={onReset}
            disabled={isApplyDisabled}
          >
            إلغاء
          </Button>
          <PopoverClose asChild>
            <Button
              className='flex-1'
              onClick={() => pushToUrl(date)}
              disabled={isApplyDisabled}
            >
              تطبيق
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
