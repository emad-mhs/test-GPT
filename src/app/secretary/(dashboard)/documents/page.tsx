import { DEFAULT_LIMIT } from '@/constants';
import { DocumentsView } from '@/modules/secretary/documents/ui/views/documents-view';
import { RoleGate } from '@/modules/auth/ui/components/role-gate';
import { UserRoles } from '@/modules/auth/types';
import { protectedPage } from '@/modules/auth/utils/auth';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    search: string | undefined;
    from: string | undefined;
    to: string | undefined;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { search, from, to } = await searchParams;

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
        <DocumentsView search={search} from={from} to={to} />
      </RoleGate>
    </HydrationBoundary>
  );
};

export default Page;
