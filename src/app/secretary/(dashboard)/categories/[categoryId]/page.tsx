import { CategoryView } from '@/modules/secretary/categories/ui/views/category-view';
import { DEFAULT_LIMIT } from '@/constants';
import { getQueryClient, trpc } from '@/trpc/server';
import { RoleGate } from '@/modules/auth/ui/components/role-gate';
import { UserRoles } from '@/modules/auth/types';

import { protectedPage } from '@/modules/auth/utils/auth';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface PageProps {
  params: Promise<{
    categoryId: string;
  }>;
  searchParams: Promise<{
    search: string | undefined;
  }>;
}

const Page = async ({ params, searchParams }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { categoryId } = await params;
  const { search } = await searchParams;

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchQuery(
    trpc.categories.getOne.queryOptions({ categoryId })
  );
  void queryClient.prefetchInfiniteQuery(
    trpc.categories.getCategoryItems.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
      categoryId,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoleGate allowedRole={[UserRoles.ADMIN, UserRoles.MANAGER]}>
        <CategoryView categoryId={categoryId} search={search} />
      </RoleGate>
    </HydrationBoundary>
  );
};

export default Page;
