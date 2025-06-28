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
      {/* البطاقة الرئيسية */}
      <Card className='w-full h-full border-none shadow-none bg-card'>
        <CardHeader className='flex flex-row items-center gap-x-4 px-7'>
          <Skeleton className='h-8 w-20' /> {/* زر الرجوع */}
          <Skeleton className='h-6 w-40' /> {/* عنوان الصفحة */}
        </CardHeader>

        <div className='px-7'>
          <Separator />
        </div>

        <CardContent className='px-7'>
          <div className='space-y-5'>
            {/* حقول النموذج */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='space-y-2'>
                <Skeleton className='h-4 w-28' /> {/* عنوان الحقل */}
                <Skeleton className='h-10 w-full' /> {/* الحقل نفسه */}
              </div>
            ))}

            {/* Switches */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`switch-${i}`}
                className='flex items-center justify-between border border-input p-3 rounded-lg shadow-xs'
              >
                <div className='space-y-1'>
                  <Skeleton className='h-4 w-36' />
                  <Skeleton className='h-3 w-52' />
                </div>
                <Skeleton className='h-6 w-10 rounded-full' />
              </div>
            ))}

            <Separator className='my-4' />

            {/* أزرار الحفظ والإلغاء */}
            <div className='flex items-center justify-between'>
              <Skeleton className='h-10 w-24' />
              <Skeleton className='h-10 w-36' />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* منطقة الخطر */}
      <Card className='w-full h-full border-none shadow-none bg-card'>
        <CardContent className='px-7'>
          <div className='space-y-4'>
            <Skeleton className='h-5 w-28' /> {/* العنوان */}
            <Skeleton className='h-4 w-2/3' /> {/* الوصف */}
            <Separator className='my-4' />
            <Skeleton className='h-9 w-36 mr-auto' /> {/* زر الحذف */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
