import { Skeleton } from '@/components/ui/skeleton';

export const FiltersSectionSkeleton = () => {
  return (
    <div className='flex flex-col my-5 lg:flex-row lg:flex-wrap items-center gap-y-2 lg:gap-y-0 lg:gap-x-2'>
      {/* نوع الفلتر */}
      <Skeleton className='h-10 w-40 rounded-md' />

      {/* جهة الإرسال */}
      <Skeleton className='h-10 w-52 rounded-md' />

      {/* جهة الاستلام */}
      <Skeleton className='h-10 w-52 rounded-md' />
    </div>
  );
};
