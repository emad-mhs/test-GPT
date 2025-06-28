// ui/audit-logs-section-skeleton.tsx
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/table';

export function AuditLogsSectionSkeleton() {
  return (
    <div className='rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card animate-pulse'>
      {/* header placeholder */}
      <div className='flex flex-col gap-2 pb-4 items-start justify-between'>
        <Skeleton className='h-8 w-2/12' />
        <Skeleton className='h-6 w-1/4' />
      </div>

      <Table>
        <TableHeader className='bg-muted'>
          <TableRow>
            {['الوقت', 'الجدول', 'معرّف السجل', 'المستخدم', 'التفاصيل'].map(
              (_, i) => (
                <TableCell key={i} className='p-4'>
                  <Skeleton className='h-4 w-16' />
                </TableCell>
              )
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: 10 }).map((_, rowIdx) => (
            <TableRow key={rowIdx} className='border-b'>
              {Array.from({ length: 5 }).map((__, colIdx) => (
                <TableCell key={colIdx} className='p-4'>
                  <Skeleton className='h-4 w-full max-w-[120px]' />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* “Load more” button skeleton */}
      <div className='flex justify-center pt-4'>
        <Skeleton className='h-8 w-32 rounded' />
      </div>
    </div>
  );
}
