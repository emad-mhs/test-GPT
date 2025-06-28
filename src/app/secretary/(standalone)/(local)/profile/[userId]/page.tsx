import { protectedPage } from '@/modules/auth/utils/auth';
import { ProfileView } from '@/modules/secretary/users/ui/views/profile-view';
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
      <ProfileView userId={userId} />
    </HydrationBoundary>
  );
};

export default Page;
