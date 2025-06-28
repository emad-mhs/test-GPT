'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const VerifyMailSectionSkeleton = () => {
  return (
    <div className='max-w-(--breakpoint-2xl) mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-xs'>
        <CardHeader className='gap-y-2 flex-row items-center justify-between'>
          <CardTitle className='lg:text-xl line-clamp-1'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <Skeleton className='h-6 w-[200px] md:w-[300px]' />
              <Skeleton className='h-6 w-20 rounded-md' />
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Separator />
          <div className='py-5 space-y-6'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='flex items-center gap-3'>
                <Skeleton className='h-5 w-5 rounded-full' />
                <Skeleton className='h-4 w-[200px] md:w-[300px]' />
              </div>
            ))}

            <div className='flex items-start gap-3'>
              <Skeleton className='h-5 w-5 rounded-full' />
              <div className='space-y-1'>
                <Skeleton className='h-4 w-[100px]' />
                <Skeleton className='h-4 w-[200px]' />
                <Skeleton className='h-4 w-[150px]' />
              </div>
            </div>
          </div>

          <Separator />

          <div className='mt-6 w-full border border-input rounded-lg overflow-hidden'>
            <Skeleton className='w-full h-[500px]' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
