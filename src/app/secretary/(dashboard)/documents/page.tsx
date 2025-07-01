import { DEFAULT_LIMIT } from '@/constants';
import { DocumentsView } from '@/modules/secretary/documents/ui/views/documents-view';
import { RoleGate } from '@/modules/auth/ui/components/role-gate';
import { UserRoles } from '@/modules/auth/types';
import { protectedPage } from '@/modules/auth/utils/auth';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

const Page = async () => {
  await protectedPage();
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchQuery(trpc.categories.getAll.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.documents.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoleGate allowedRole={[UserRoles.ADMIN, UserRoles.MANAGER]}>
        <DocumentsView />
      </RoleGate>
    </HydrationBoundary>
  );
};

export default Page;
