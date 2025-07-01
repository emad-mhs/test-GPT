import { DEFAULT_LIMIT } from '@/constants';
import { getQueryClient, trpc } from '@/trpc/server';
import { MailsView } from '@/modules/secretary/mails/ui/views/mails-view';
import { protectedPage } from '@/modules/auth/utils/auth';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

const Page = async () => {
  await protectedPage();
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchQuery(trpc.categories.getAll.queryOptions());
  void queryClient.prefetchQuery(trpc.departments.getAll.queryOptions());
  void queryClient.prefetchQuery(trpc.contacts.getAll.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.mails.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MailsView />
    </HydrationBoundary>
  );
};

export default Page;
