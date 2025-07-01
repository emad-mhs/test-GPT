import { getQueryClient, trpc } from '@/trpc/server';
import { DEFAULT_LIMIT } from '@/constants';
import { AuditLogsView } from '@/modules/secretary/audit/ui/views/audit-logs-view';

import { protectedPage } from '@/modules/auth/utils/auth';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

const Page = async () => {
  await protectedPage();
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.audit.getLogs.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuditLogsView />
    </HydrationBoundary>
  );
};

export default Page;
