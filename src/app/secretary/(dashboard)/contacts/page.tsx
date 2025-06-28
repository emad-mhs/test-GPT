import { DEFAULT_LIMIT } from '@/constants';
import { getQueryClient, trpc } from '@/trpc/server';
import { ContactsView } from '@/modules/secretary/contacts/ui/views/contacts-view';
import { protectedPage } from '@/modules/auth/utils/auth';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    search: string | undefined;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { search } = await searchParams;

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.contacts.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContactsView search={search} />
    </HydrationBoundary>
  );
};

export default Page;
