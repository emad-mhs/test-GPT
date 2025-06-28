'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const FormSectionSkeleton = () => {
  return (
    <div className='flex flex-col gap-y-4'>
      <Card className='w-full h-full bg-card border-none shadow-none'>
        <CardHeader className='flex flex-row items-center gap-x-4 px-7 space-y-0'>
          <Skeleton className='h-8 w-20' />
          <Skeleton className='h-6 w-40' />
        </CardHeader>

        <div className='px-7'>
          <Separator />
        </div>

        <CardContent className='px-7 space-y-4 mt-4'>
          {/* Simulate form fields */}
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-5 w-24' />
          <Skeleton className='h-10 w-full' />

          <Separator className='my-7' />

          <div className='flex items-center justify-between'>
            <Skeleton className='h-10 w-24' />
            <Skeleton className='h-10 w-32' />
          </div>
        </CardContent>
      </Card>

      {/* Danger zone card (if applicable) */}
      <Card className='w-full h-full bg-card border-none shadow-none'>
        <CardContent className='px-7 space-y-4'>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-full max-w-md' />
          <Separator className='mt-6' />
          <Skeleton className='h-8 w-28 mr-auto' />
        </CardContent>
      </Card>
    </div>
  );
};
