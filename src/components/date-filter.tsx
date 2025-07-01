'use client';

import { useState, useEffect } from 'react';
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
import { useFilters } from '@/hooks/use-filter-param';

export const DateFilter = () => {
  // نستخدم الهُوك العامّ للاحتفاظ بالفلاتر و setters الخاصة بها
  const {
    filters: { from, to },
    setFrom,
    setTo,
  } = useFilters();

  // Parse only if both from & to exist
  // const initial = useMemo<DateRange | undefined>(() => {
  //   const f = searchParams.get('from');
  //   const t = searchParams.get('to');
  //   if (f && t) {
  //     const from = new Date(f);
  //     const to = new Date(t);
  //     if (!isNaN(from.valueOf()) && !isNaN(to.valueOf())) {
  //       return { from, to };
  //     }
  //   }
  //   return undefined;
  // }, [searchParams]);
  // نبني الحالة المحلية لمحرِّك الـ date_picker من قيمة الـ URL الحالية
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (from && to) {
      const f = new Date(from);
      const t = new Date(to);
      if (!isNaN(f.valueOf()) && !isNaN(t.valueOf())) {
        return { from: f, to: t };
      }
    }
    return undefined;
  });

  // إذا تغيَّرت قيمة الـ URL من خارج هذا المكوّن، نزامن الحالة المحلية
  useEffect(() => {
    if (from && to) {
      const f = new Date(from);
      const t = new Date(to);
      if (!isNaN(f.valueOf()) && !isNaN(t.valueOf())) {
        setDateRange({ from: f, to: t });
        return;
      }
    }
    setDateRange(undefined);
  }, [from, to]);

  const isApplyDisabled = !(dateRange?.from && dateRange?.to);

  // عند الضغط على "تطبيق": حدّث الـ URL
  const handleApply = () => {
    if (dateRange?.from && dateRange.to) {
      const f = dateRange.from.toISOString().slice(0, 10);
      const t = dateRange.to.toISOString().slice(0, 10);
      setFrom(f);
      setTo(t);
    }
  };

  // عند الضغط على "إلغاء": مسح الفلترين من الـ URL
  const handleReset = () => {
    setDateRange(undefined);
    setFrom(''); // clearOnDefault سيزيل الباراميتر
    setTo('');
  };

  const label = dateRange ? formatDateRange(dateRange) : 'التاريخ';

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
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
        />

        <div className='p-4 flex gap-x-2'>
          <Button
            variant='secondary'
            className='flex-1'
            onClick={handleReset}
            disabled={isApplyDisabled}
          >
            إلغاء
          </Button>
          <PopoverClose asChild>
            <Button
              className='flex-1'
              onClick={handleApply}
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
