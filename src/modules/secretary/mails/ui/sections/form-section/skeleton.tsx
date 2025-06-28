import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export const FormSectionSkeleton = () => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      {/* Breadcrumb */}
      <Skeleton className='h-4 w-32' />

      <Card className='border-none drop-shadow-xs'>
        <CardHeader>
          <div className='flex items-center gap-4'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <Skeleton className='h-6 w-60' />
            <Skeleton className='h-5 w-20 mr-auto' />
          </div>
        </CardHeader>

        <CardContent>
          <Separator />
          <div className='py-5 space-y-4'>
            <Skeleton className='h-4 w-60' />
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-4 w-48' />
          </div>

          <Separator className='my-4' />

          <div className='flex flex-col gap-y-5 pt-4'>
            {/* مرفقات PDF ومرفقات أخرى */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className='flex items-center gap-x-4'>
                <Skeleton className='h-[72px] w-[72px] rounded-md' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-4 w-64' />
                  <Skeleton className='h-8 w-24' />
                </div>
              </div>
            ))}

            {/* حقول النسخ والتوجيه والملاحظات */}
            <Skeleton className='h-10 w-80' />
            <Skeleton className='h-10 w-80' />
            <Skeleton className='h-32 w-full max-w-md' />
            <Skeleton className='h-10 w-80' />
          </div>

          <Separator className='my-7' />

          {/* أزرار الحفظ والإلغاء */}
          <div className='flex items-center justify-between max-w-md'>
            <Skeleton className='h-10 w-24' />
            <Skeleton className='h-10 w-32' />
          </div>
        </CardContent>
      </Card>
    </div>
  );
  // return (
  //   <div>
  //     <div className='flex items-center justify-between mb-6'>
  //       <div className='space-y-2'>
  //         <Skeleton className='h-7 w-32' />
  //         <Skeleton className='h-4 w-40' />
  //       </div>
  //       <Skeleton className='h-9 w-24' />
  //     </div>
  //     <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
  //       <div className='space-y-8 lg:col-span-3'>
  //         <div className='space-y-2'>
  //           <Skeleton className='h-5 w-16' />
  //           <Skeleton className='h-10 w-full' />
  //         </div>
  //         <div className='space-y-2'>
  //           <Skeleton className='h-5 w-24' />
  //           <Skeleton className='h-[220px] w-full' />
  //         </div>
  //         <div className='space-y-2'>
  //           <Skeleton className='h-5 w-20' />
  //           <Skeleton className='h-[84px] w-[153px]' />
  //         </div>
  //         <div className='space-y-2'>
  //           <Skeleton className='h-5 w-20' />
  //           <Skeleton className='h-10 w-full' />
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};
