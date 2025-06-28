import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const DataGridSectionSkeleton = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8'>
      <DataCardLoading />
      <DataCardLoading />
      <DataCardLoading />
    </div>
  );
};

const DataCardLoading = () => {
  return (
    <Card className='border-none drop-shadow-xs h-[192px]'>
      <CardHeader className='flex flex-row items-center jsutify-between gap-x-4'>
        <div className='space-y-2'>
          <Skeleton className='h-6 w-24' />
          <Skeleton className='h-4 w-40' />
        </div>
        <Skeleton className='size-12 mr-auto' />
      </CardHeader>
      <CardContent>
        <Skeleton className='shrink-0 h-10 w-24 mb-2' />
        <Skeleton className='shrink-0 h-4 w-40' />
      </CardContent>
    </Card>
  );
};
