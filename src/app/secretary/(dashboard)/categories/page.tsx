import { CategoriesView } from '@/modules/secretary/categories/ui/views/categories-view';

import { DEFAULT_LIMIT } from '@/constants';
import { getQueryClient, trpc } from '@/trpc/server';
import { protectedPage } from '@/modules/auth/utils/auth';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

const Page = async () => {
  await protectedPage();
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchQuery(trpc.categories.getAll.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.categories.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CategoriesView />
    </HydrationBoundary>
  );
};

export default Page;
