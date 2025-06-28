import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const FormSectionSkeleton = () => {
  return (
    <div className='flex flex-col gap-y-4'>
      <Card className='w-full h-full bg-card border-none shadow-none'>
        <CardHeader className='flex flex-row items-center gap-x-4 px-7 space-y-0'>
          <Skeleton className='h-8 w-24' />
          <CardTitle className='text-xl font-bold'>
            <Skeleton className='h-6 w-40' />
          </CardTitle>
        </CardHeader>

        <div className='px-7'>
          <Separator />
        </div>

        <CardContent className='px-7 space-y-6 mt-6'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <div className='flex justify-between mt-8'>
            <Skeleton className='h-10 w-24' />
            <Skeleton className='h-10 w-32' />
          </div>
        </CardContent>
      </Card>

      <Card className='w-full h-full bg-card border-none shadow-none'>
        <CardContent className='px-7 space-y-4'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-64' />
          <Skeleton className='h-10 w-28 mr-auto' />
        </CardContent>
      </Card>
    </div>
  );
};
