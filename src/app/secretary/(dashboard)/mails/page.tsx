import { DEFAULT_LIMIT } from '@/constants';
import { getQueryClient, trpc } from '@/trpc/server';
import { MailsView } from '@/modules/secretary/mails/ui/views/mails-view';
import { MailStatuses, MailTypes } from '@/modules/secretary/mails/types';
import { protectedPage } from '@/modules/auth/utils/auth';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    search: string | undefined;
    type: MailTypes | undefined;
    status: MailStatuses | undefined;
    senderId: string | undefined;
    receiverId: string | undefined;
    from: string | undefined;
    to: string | undefined;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { search, type, status, senderId, receiverId, from, to } =
    await searchParams;

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
      <MailsView
        search={search}
        type={type}
        status={status}
        senderId={senderId}
        receiverId={receiverId}
        from={from}
        to={to}
      />
    </HydrationBoundary>
  );
};

export default Page;
