import { format } from 'date-fns';

import { Separator } from '@/components/ui/separator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomTooltip = ({ active, payload }: any) => {
  if (!active) return null;

  const date = payload[0].payload.date;
  const outgoing = payload[0].value;
  const incoming = payload[1].value;

  return (
    <div className='rounded-sm bg-white shadow-xs border overflow-hidden'>
      <div className='text-sm p-2 px-3 bg-muted text-muted-foreground'>
        {format(date, 'MMM dd, yyyy')}
      </div>
      <Separator />
      <div className='p-2 px-3 space-y-1'>
        <div className='flex items-center justify-between gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <div className='size-1.5 bg-blue-500 rounded-full' />
            <p className='text-sm text-muted-foreground'>الصادر</p>
          </div>
          <p className='text-sm text-right font-medium'>{outgoing}</p>
        </div>
        <div className='flex items-center justify-between gap-x-4'>
          <div className='flex items-center gap-x-2'>
            <div className='size-1.5 bg-rose-500 rounded-full' />
            <p className='text-sm text-muted-foreground'>الوارد</p>
          </div>
          <p className='text-sm text-right font-medium'>{incoming}</p>
        </div>
      </div>
    </div>
  );
};
