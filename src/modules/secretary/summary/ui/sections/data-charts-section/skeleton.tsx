import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader } from 'lucide-react';

export const DataChartsSectionSkeleton = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-6 gap-8'>
      <div className='col-span-1 lg:col-span-3 xl:col-span-4'>
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
      </div>
      <div className='col-span-1 lg:col-span-3 xl:col-span-2'>
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
      </div>
    </div>
  );
};
