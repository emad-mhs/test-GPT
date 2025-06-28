import { protectedPage } from '@/modules/auth/utils/auth';
import { DepartmentSettingsView } from '@/modules/secretary/departments/ui/views/department-settings-view';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface PageProps {
  params: Promise<{
    departmentId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { departmentId } = await params;

  void queryClient.prefetchQuery(
    trpc.departments.getOne.queryOptions({ departmentId })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DepartmentSettingsView departmentId={departmentId} />
    </HydrationBoundary>
  );
};

export default Page;
