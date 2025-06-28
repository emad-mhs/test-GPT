import { protectedPage } from '@/modules/auth/utils/auth';
import { UserSettingsView } from '@/modules/secretary/users/ui/views/user-settings-view';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { userId } = await params;

  void queryClient.prefetchQuery(trpc.users.getOne.queryOptions({ userId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserSettingsView userId={userId} />
    </HydrationBoundary>
  );
};

export default Page;
