'use client';
import { ErrorFallback } from '@/components/error-fallback';
import { useTRPC } from '@/trpc/client';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/table';
import { Heading } from '@/components/heading';
import { Button } from '@/components/ui/button';
import { InfiniteScroll } from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { AuditChangesModal } from '@/modules/secretary/audit/ui/components/audit-changes-modal';
import { format } from 'date-fns';
import { AuditLog, TableNames } from '@/modules/secretary/audit/types';
import { Card } from '@/components/ui/card';
import { DocumentAuditTrailSectionSkeleton } from './skeleton';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';

interface DocumentAuditTrailSectionProps {
  documentId: string;
}

export const DocumentAuditTrailSection = ({
  documentId,
}: DocumentAuditTrailSectionProps) => {
  return (
    <Suspense fallback={<DocumentAuditTrailSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <MailAuditTrailSuspense documentId={documentId} />
      </ErrorBoundary>
    </Suspense>
  );
};

export function MailAuditTrailSuspense({ documentId }: { documentId: string }) {
  const trpc = useTRPC();

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // const [logs, query] = trpc.audit.getLogs.useSuspenseInfiniteQuery(
  //   {
  //     limit: DEFAULT_LIMIT,
  //     tableName: TableNames.DOCUMENT,
  //     recordId: documentId,
  //   },
  //   {
  //     getNextPageParam: lastPage => lastPage.nextCursor,
  //   }
  // );
  const query = useSuspenseInfiniteQuery(
    trpc.audit.getLogs.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        tableName: TableNames.DOCUMENT,
        recordId: documentId,
      },
      {
        getNextPageParam: lastPage => lastPage.nextCursor,
      }
    )
  );

  return (
    <div className='flex-1 p-4 pt-6'>
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

      <Card className='grid  border-none drop-shadow-xs px-7.5 pb-4 pt-7.5 shadow-1 dark:shadow-card'>
        <div className='gap-y-2 flex flex-col pb-4 md:flex-row items-start justify-between'>
          <Heading
            title='سجل التعديلات'
            description='الاطلاع علي التعذيلات التي قام بها المستخدمون'
          />
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
            {query.data.pages
              .flatMap(p => p.items)
              .map(log => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm')}
                  </TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell className='text-center'>
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
      </Card>
    </div>
  );
}
