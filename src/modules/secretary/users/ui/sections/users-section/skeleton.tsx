import { Skeleton } from '@/components/ui/skeleton';

export const UsersSectionSkeleton = () => {
  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
      {/* العنوان وزر الإضافة */}
      <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
        <div>
          <Skeleton className='h-6 w-36 mb-2' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-8 w-28' />
      </div>

      {/* رأس الجدول */}
      <div className='bg-muted px-4 py-2 rounded grid grid-cols-8 gap-4 text-sm'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
      </div>

      {/* صفوف المستخدمين المؤقتة */}
      <div className='divide-y divide-muted/40 mt-2 space-y-3'>
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className='grid grid-cols-8 gap-4 px-4 py-3 items-center'
          >
            <div className='flex items-center gap-2'>
              <Skeleton className='size-6 rounded-full' />
              <Skeleton className='h-4 w-24' />
            </div>
            <Skeleton className='h-4 w-28' />
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-5' />
            <Skeleton className='h-4 w-5' />
            <Skeleton className='h-4 w-5' />
            <Skeleton className='h-4 w-5' />
          </div>
        ))}
      </div>
    </div>
  );
};
