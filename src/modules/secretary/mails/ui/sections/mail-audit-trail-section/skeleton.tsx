'use client';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { Skeleton } from '@/components/ui/skeleton';

export function MailAuditTrailSectionSkeleton() {
  return (
    <div className='flex-1 p-4 pt-6'>
      <Card className='grid border-none drop-shadow-xs px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
        {/* Heading / controls skeleton */}
        <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
          <Skeleton className='h-6 w-40' /> {/* title */}
          <Skeleton className='h-6 w-32' /> {/* maybe a button */}
        </div>

        <Table>
          <TableHeader className='bg-muted'>
            <TableRow>
              <TableHead className='text-right w-40'>الوقت</TableHead>
              <TableHead className='text-right w-40'>المستخدم</TableHead>
              <TableHead className='text-center'>التفاصيل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className='h-4 w-28' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-24' />
                </TableCell>
                <TableCell className='text-center'>
                  <Skeleton className='h-6 w-16 mx-auto' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
