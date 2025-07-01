// import { trpc } from '@/trpc/client';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '@/components/error-fallback';
import { DEFAULT_LIMIT } from '@/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { format } from 'date-fns';

import { InfiniteScroll } from '@/components/infinite-scroll';
import { Heading } from '@/components/heading';
import { AuditChangesModal } from '../../components/audit-changes-modal';
import { AuditLog } from '../../../types';
import { Button } from '@/components/ui/button';
import { AuditLogsSectionSkeleton } from './skeleton';
import { useTRPC } from '@/trpc/client';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useFilters } from '@/hooks/use-filter-param';

export const AuditLogsSection = () => {
  return (
    <Suspense fallback={<AuditLogsSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuditSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const AuditSectionSuspense = () => {
  const trpc = useTRPC();
  const { filters } = useFilters();

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const query = useSuspenseInfiniteQuery(
    trpc.audit.getLogs.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        tableName: filters.tableName,
        userId: filters.userId,
        from: filters.from,
        to: filters.to,
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
      }
    )
  );

  return (
    <>
      {/* only mount the modal when we have a log */}
      {selectedLog && (
        <AuditChangesModal
          log={selectedLog}
          open={!!selectedLog}
          onOpenChangeAction={open => {
            if (!open) setSelectedLog(null);
          }}
        />
      )}

      <div className='grid rounded-[10px] bg-card px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
        <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
          <Heading
            title='سجل التعديلات'
            description='الاطلاع علي التعذيلات التي قام بها المستخدمون'
          />
        </div>
        <Table>
          <TableHeader className='bg-muted'>
            <TableRow>
              <TableHead className='text-right'>الوقت</TableHead>
              <TableHead className='text-right'>الجدول</TableHead>
              <TableHead className='text-right'>معرّف السجل</TableHead>
              <TableHead className='text-right'>المستخدم</TableHead>
              <TableHead className='text-right'>التفاصيل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {query.data?.pages
              .flatMap(p => p.items)
              .map(log => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>{log.tableName}</TableCell>
                  <TableCell>{log.entityLabel as string}</TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>
                    <Button
                      variant='primary'
                      size='sm'
                      onClick={() => setSelectedLog(log)}
                    >
                      تفاصيل
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <InfiniteScroll
          isManual
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={query.fetchNextPage}
        />
      </div>
    </>
  );
};
