import { getQueryClient, trpc } from '@/trpc/server';
import { DEFAULT_LIMIT } from '@/constants';
import { AuditLogsView } from '@/modules/secretary/audit/ui/views/audit-logs-view';

import { protectedPage } from '@/modules/auth/utils/auth';
import { TableNames } from '@/modules/secretary/audit/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    tableName: TableNames | undefined;
    userId: string | undefined;
    from: string | undefined;
    to: string | undefined;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { tableName, userId, from, to } = await searchParams;

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.audit.getLogs.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuditLogsView
        tableName={tableName}
        userId={userId}
        from={from}
        to={to}
      />
    </HydrationBoundary>
  );
};

export default Page;
