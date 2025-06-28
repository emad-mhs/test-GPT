import { useState } from 'react';
import {
  AreaChart,
  BarChart3,
  FileSearch,
  LineChart,
  Loader,
} from 'lucide-react';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaVariant } from './area-variant';
import { BarVariant } from './bar-variant';
import { LineVariant } from './line-variant';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  data?: {
    // date: string | null;
    date: Date | null;
    outgoing: number;
    incoming: number;
  }[];
};

export const Chart = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState('area');

  const onTypeChange = (type: string) => {
    setChartType(type);
  };

  return (
    <Card className='border-none drop-shadow-xs'>
      <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
        <CardTitle className='text-xl line-clamp-1'>البريد</CardTitle>
        <Select dir='rtl' defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
            <SelectValue placeholder='Chart type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='area'>
              <div className='flex items-center'>
                <AreaChart className='size-4 ml-2 shrink-0' />
                <p className='line-clamp-1'>مخطط المنطقة</p>
              </div>
            </SelectItem>
            <SelectItem value='line'>
              <div className='flex items-center'>
                <LineChart className='size-4 ml-2 shrink-0' />
                <p className='line-clamp-1'>خط الرسم البياني</p>
              </div>
            </SelectItem>
            <SelectItem value='bar'>
              <div className='flex items-center'>
                <BarChart3 className='size-4 ml-2 shrink-0' />
                <p className='line-clamp-1'>شريط الرسم البياني</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className='flex flex-col gap-y-4 items-center justify-center h-[350px] w-full'>
            <FileSearch className='size-6 text-muted-foreground' />
            <p className='text-muted-foreground text-sm'>
              لا توجد بيانات لهذه الفترة
            </p>
          </div>
        ) : (
          <>
            {chartType === 'line' && <LineVariant data={data} />}
            {chartType === 'area' && <AreaVariant data={data} />}
            {chartType === 'bar' && <BarVariant data={data} />}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export const ChartLoading = () => {
  return (
    <Card className='border-none drop-shadow-xs'>
      <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-8 lg:w-[120px] w-full' />
      </CardHeader>
      <CardContent>
        <div className='h-[350px] w-full flex items-center justify-center'>
          <Loader className='h-6 w-6 text-slate-300 animate-spin' />
        </div>
      </CardContent>
    </Card>
  );
};
