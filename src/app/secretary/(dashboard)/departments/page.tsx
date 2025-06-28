import { DEFAULT_LIMIT } from '@/constants';
import { getQueryClient, trpc } from '@/trpc/server';
import { RoleGate } from '@/modules/auth/ui/components/role-gate';
import { UserRoles } from '@/modules/auth/types';
import { DepartmentsView } from '@/modules/secretary/departments/ui/views/departments-view';
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
    trpc.departments.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoleGate allowedRole={[UserRoles.ADMIN, UserRoles.MANAGER]}>
        <DepartmentsView search={search} />
      </RoleGate>
    </HydrationBoundary>
  );
};

export default Page;
