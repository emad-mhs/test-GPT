import { Skeleton } from '@/components/ui/skeleton';

export const DepartmentsSectionSkeleton = () => {
  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
      <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
        <div>
          <Skeleton className='h-6 w-40 mb-2' />
          <Skeleton className='h-4 w-72' />
        </div>
        <Skeleton className='h-8 w-32' />
      </div>

      <div className='space-y-2'>
        {/* Header Skeleton */}
        <div className='flex justify-between bg-muted px-4 py-2 rounded'>
          <Skeleton className='h-4 w-40' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-4 w-20' />
        </div>

        {/* Row Skeletons */}
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className='flex justify-between px-4 py-3 border-b border-muted/40'
          >
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-20' />
          </div>
        ))}
      </div>
    </div>
  );
};
