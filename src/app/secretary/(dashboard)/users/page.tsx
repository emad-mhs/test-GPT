import { DEFAULT_LIMIT } from '@/constants';
import { getQueryClient, trpc } from '@/trpc/server';
import { protectedPage } from '@/modules/auth/utils/auth';
import { RoleGate } from '@/modules/auth/ui/components/role-gate';
import { UserRoles } from '@/modules/auth/types';
import { UsersView } from '@/modules/secretary/users/ui/views/users-view';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

const Page = async () => {
  await protectedPage();
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchQuery(trpc.departments.getAll.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.users.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoleGate allowedRole={[UserRoles.ADMIN]}>
        <UsersView />
      </RoleGate>
    </HydrationBoundary>
  );
};

export default Page;
