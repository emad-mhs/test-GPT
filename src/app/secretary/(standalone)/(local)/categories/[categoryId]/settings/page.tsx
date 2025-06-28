import { DEFAULT_LIMIT } from '@/constants';
import { UserRoles } from '@/modules/auth/types';
import { RoleGate } from '@/modules/auth/ui/components/role-gate';
import { protectedPage } from '@/modules/auth/utils/auth';
import { CategorySettingsView } from '@/modules/secretary/categories/ui/views/category-settings-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface PageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { categoryId } = await params;

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
        <CategorySettingsView categoryId={categoryId} />
      </RoleGate>
    </HydrationBoundary>
  );
};

export default Page;
