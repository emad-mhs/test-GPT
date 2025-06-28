import { Skeleton } from '@/components/ui/skeleton';

export const FiltersSectionSkeleton = () => {
  return (
    <div className='flex flex-col my-5  items-end gap-y-2 lg:gap-y-0 lg:gap-x-2'>
      {/* التاريخ */}
      <Skeleton className='h-10 w-44 rounded-md' />
    </div>
  );
};
