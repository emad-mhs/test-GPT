'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const FormSectionSkeleton = () => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <Card className='border-none drop-shadow-xs'>
        <CardHeader className='flex flex-col gap-y-2 lg:flex-row lg:items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Skeleton className='h-6 w-6 rounded-md' />
            <Skeleton className='h-6 w-[200px]' />
          </CardTitle>
          <Skeleton className='h-8 w-24' />
        </CardHeader>
        <CardContent>
          <Separator className='my-4' />
          <div className='flex flex-col gap-y-4'>
            <Skeleton className='h-6 w-[300px] mr-auto' />
            <Skeleton className='h-6 w-[100px]' />
            <Skeleton className='h-15 lg:max-w-md' />

            <div className='flex items-center gap-x-4'>
              <Skeleton className='h-[72px] w-[72px] rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-64' />
                <Skeleton className='h-8 w-24' />
              </div>
            </div>

            <Skeleton className='h-6 w-[100px]' />
            <Skeleton className='h-8 lg:max-w-md' />
            <Skeleton className='h-6 w-[100px]' />
            <Skeleton className='h-15 lg:max-w-md rounded-md' />
            <div className='max-w-md flex gap-4 pt-6'>
              <Skeleton className='h-10 w-24' />
              <Skeleton className='h-10 w-36 mr-auto' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
