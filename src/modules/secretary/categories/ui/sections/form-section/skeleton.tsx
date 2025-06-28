// import { Skeleton } from '@/components/ui/skeleton';

// export const FormSectionSkeleton = () => {
//   return (
//     <div>
//       <div className='flex items-center justify-between mb-6'>
//         <div className='space-y-2'>
//           <Skeleton className='h-7 w-32' />
//           <Skeleton className='h-4 w-40' />
//         </div>
//         <Skeleton className='h-9 w-24' />
//       </div>
//       <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
//         <div className='space-y-8 lg:col-span-3'>
//           <div className='space-y-2'>
//             <Skeleton className='h-5 w-16' />
//             <Skeleton className='h-10 w-full' />
//           </div>
//           <div className='space-y-2'>
//             <Skeleton className='h-5 w-24' />
//             <Skeleton className='h-[220px] w-full' />
//           </div>
//           <div className='space-y-2'>
//             <Skeleton className='h-5 w-20' />
//             <Skeleton className='h-[84px] w-[153px]' />
//           </div>
//           <div className='space-y-2'>
//             <Skeleton className='h-5 w-20' />
//             <Skeleton className='h-10 w-full' />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const FormSectionSkeleton = () => {
  return (
    <div className='flex flex-col gap-y-4'>
      <Card className='w-full h-full bg-card border-none shadow-none'>
        {/* رأس البطاقة */}
        <CardHeader className='flex flex-row items-center gap-x-4 px-7'>
          <Skeleton className='h-8 w-20' /> {/* زر الرجوع */}
          <Skeleton className='h-6 w-40' /> {/* عنوان الصفحة */}
        </CardHeader>

        {/* فاصل */}
        <div className='px-7'>
          <Separator />
        </div>

        {/* محتوى النموذج */}
        <CardContent className='px-7'>
          <div className='space-y-6'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-24' /> {/* عنوان الحقل */}
              <Skeleton className='h-10 w-full' /> {/* حقل الاسم */}
            </div>

            <Separator className='my-6' />

            <div className='flex justify-between'>
              <Skeleton className='h-10 w-24' /> {/* زر إلغاء */}
              <Skeleton className='h-10 w-32' /> {/* زر حفظ */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* منطقة الخطر */}
      <Card className='w-full h-full bg-card border-none shadow-none'>
        <CardContent className='px-7 pt-4'>
          <div className='space-y-4'>
            <Skeleton className='h-6 w-32' /> {/* عنوان منطقة الخطر */}
            <Skeleton className='h-4 w-2/3' /> {/* وصف الحذف */}
            <Separator className='mt-6' />
            <Skeleton className='h-9 w-36 mt-4 mr-auto' /> {/* زر الحذف */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
