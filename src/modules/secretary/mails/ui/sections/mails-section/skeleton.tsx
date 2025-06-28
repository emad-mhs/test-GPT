'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';

export const MailsSectionSkeleton = () => {
  return (
    <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
      <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-6 w-24' />
          <Skeleton className='h-4 w-56' />
        </div>
        <Skeleton className='h-9 w-32' />
      </div>

      <Table>
        <TableHeader className='bg-muted'>
          <TableRow>
            {Array.from({ length: 6 }).map((_, idx) => (
              <TableHead key={idx}>
                <Skeleton className='h-4 w-20' />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Skeleton className='h-4 w-48' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-6' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-40 mb-1' />
                <Skeleton className='h-4 w-36' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-24' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-4 w-20' />
              </TableCell>
              <TableCell>
                <Skeleton className='h-6 w-16 rounded-full' />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
