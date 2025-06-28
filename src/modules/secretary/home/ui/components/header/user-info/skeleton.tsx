import { Skeleton } from '@/components/ui/skeleton';

export const UserInfoSkeleton = () => {
  return (
    <div className='flex items-center gap-3'>
      {/* الصورة الرمزية */}
      <Skeleton className='size-12 rounded-full' />

      {/* اسم المستخدم وسهم القائمة - يظهر فقط على الشاشات الكبيرة */}
      <div className='hidden lg:flex flex-col gap-1'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-4 w-20' />
      </div>
    </div>
  );
};
