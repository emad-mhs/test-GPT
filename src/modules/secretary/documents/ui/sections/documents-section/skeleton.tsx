import { Skeleton } from '@/components/ui/skeleton';

export const DocumentsSectionSkeleton = () => {
  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
      {/* العنوان وزر الإضافة */}
      <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
        <div>
          <Skeleton className='h-6 w-32 mb-2' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-8 w-28' />
      </div>

      {/* رأس الجدول */}
      <div className='flex justify-between bg-muted px-4 py-2 rounded'>
        <Skeleton className='h-4 w-[200px]' />
        <Skeleton className='h-4 w-[100px]' />
        <Skeleton className='h-4 w-[120px]' />
      </div>

      {/* صفوف الملفات المؤقتة */}
      <div className='divide-y divide-muted/40 mt-2'>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className='flex justify-between px-4 py-3'>
            <Skeleton className='h-4 w-[200px]' />
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[120px]' />
          </div>
        ))}
      </div>
    </div>
  );
};
