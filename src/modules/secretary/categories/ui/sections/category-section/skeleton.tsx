import { Skeleton } from '@/components/ui/skeleton';

export const CategorySectionSkeleton = () => {
  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
      {/* العنوان وزر التعديل */}
      <div className='gap-y-2 flex flex-col md:flex-row items-start justify-between'>
        <Skeleton className='h-8 w-48 mb-4' />
        <Skeleton className='h-8 w-32' />
      </div>

      {/* رأس الجدول */}
      <div className='bg-muted px-4 py-2 rounded mt-4 flex justify-between'>
        <Skeleton className='h-4 w-64' />
        <Skeleton className='h-4 w-16' />
        <Skeleton className='h-4 w-28' />
      </div>

      {/* صفوف المحتوى */}
      <div className='divide-y divide-muted/40 mt-2'>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className='flex justify-between px-4 py-3'>
            <Skeleton className='h-4 w-64' />
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-28' />
          </div>
        ))}
      </div>
    </div>
  );
  // return (
  //   <>
  //     <div className='border-y'>
  //       <Table>
  //         <TableHeader className='bg-muted'>
  //           <TableRow>
  //             <TableHead className='pr-6 w-[510px] text-right'>
  //               اسم المجلد
  //             </TableHead>
  //           </TableRow>
  //         </TableHeader>
  //         <TableBody>
  //           {Array.from({ length: 10 }).map((_, index) => (
  //             <TableRow key={index}>
  //               <TableCell className='pl-6'>
  //                 <Skeleton className='h-6 w-[510px]' />
  //               </TableCell>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </div>
  //   </>
  // );
};
