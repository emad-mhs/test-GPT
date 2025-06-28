import { getQueryClient, trpc } from '@/trpc/server';
import { protectedPage } from '@/modules/auth/utils/auth';
import { TrackingView } from '@/modules/secretary/tracking/ui/views/tracking-view';
import { DEFAULT_LIMIT } from '@/constants';
import { MailTypes } from '@/modules/secretary/mails/types';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    search: string | undefined;
    type: MailTypes | undefined;
    senderId: string | undefined;
    receiverId: string | undefined;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { search, type, senderId, receiverId } = await searchParams;

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.tracking.dueSoon.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrackingView
        search={search}
        type={type}
        senderId={senderId}
        receiverId={receiverId}
      />
    </HydrationBoundary>
  );
};

export default Page;
