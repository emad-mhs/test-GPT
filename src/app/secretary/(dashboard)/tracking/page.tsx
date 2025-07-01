import { getQueryClient, trpc } from '@/trpc/server';
import { protectedPage } from '@/modules/auth/utils/auth';
import { TrackingView } from '@/modules/secretary/tracking/ui/views/tracking-view';
import { DEFAULT_LIMIT } from '@/constants';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

const Page = async () => {
  await protectedPage();
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.tracking.dueSoon.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackingView />
    </HydrationBoundary>
  );
};

export default Page;
