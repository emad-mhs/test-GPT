// import { Skeleton } from '@/components/ui/skeleton';

// export const ProfileSectionSkeleton = () => {
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

export const ProfileSectionSkeleton = () => {
  return (
    <div className='flex flex-col gap-y-4'>
      <Card className='w-full h-full border-none shadow-none bg-card'>
        <CardHeader className='flex flex-row items-center gap-x-4 px-7'>
          <Skeleton className='h-8 w-20' /> {/* زر العودة */}
          <Skeleton className='h-6 w-40' /> {/* العنوان */}
        </CardHeader>

        <div className='px-7'>
          <Separator />
        </div>

        <CardContent className='px-7 space-y-6'>
          {/* الصورة الشخصية */}
          <div className='flex items-center gap-4'>
            <Skeleton className='size-[72px] rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-28' />
              <Skeleton className='h-3 w-48' />
              <Skeleton className='h-8 w-24' />
            </div>
          </div>

          {/* الحقول */}
          {[
            'الاسم',
            'الإيميل',
            'كلمة المرور الحالية',
            'كلمة المرور الجديدة',
            'الإدارة',
          ].map((label, index) => (
            <div key={index} className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>
          ))}

          {/* المصادقة الثنائية */}
          <div className='flex items-center justify-between border border-input p-3 rounded-lg shadow-xs'>
            <div className='space-y-1'>
              <Skeleton className='h-4 w-40' />
              <Skeleton className='h-3 w-60' />
            </div>
            <Skeleton className='h-6 w-10 rounded-full' />
          </div>

          <Separator className='my-4' />

          {/* الأزرار */}
          <div className='flex justify-between'>
            <Skeleton className='h-10 w-24' /> {/* زر إلغاء */}
            <Skeleton className='h-10 w-36' /> {/* زر حفظ */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
