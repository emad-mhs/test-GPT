import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const SettingsFormSectionSkeleton = () => {
  return (
    <div className='space-y-6'>
      <Card className='border-none shadow-none'>
        <CardHeader className='flex flex-row items-center px-7'>
          <Skeleton className='h-8 w-24' />
          <Skeleton className='h-6 w-32' />
        </CardHeader>

        <div className='px-7'>
          <Separator />
        </div>

        <CardContent className='px-7'>
          <div className='space-y-6'>
            {/* subject */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='h-24 w-full' />
            </div>

            {/* sender */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-16' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* receiver */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-10 w-full' />
            </div>

            {/* attachments */}
            <div className='space-y-2'>
              <Skeleton className='h-5 w-28' />
              <Skeleton className='h-10 w-full' />
            </div>

            <Separator className='my-6' />

            {/* buttons */}
            <div className='flex justify-between'>
              <Skeleton className='h-10 w-24' />
              <Skeleton className='h-10 w-36' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className='border-none shadow-none'>
        <CardContent className='space-y-4'>
          <Skeleton className='h-6 w-40' />
          <Skeleton className='h-4 w-2/3' />
          <Separator className='mt-4' />
          <Skeleton className='h-9 w-36 mt-4 mr-auto' />
        </CardContent>
      </Card>
    </div>
  );
};
