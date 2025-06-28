import { getQueryClient, trpc } from '@/trpc/server';
import { MailView } from '@/modules/secretary/mails/ui/views/mail-view';
import { protectedPage } from '@/modules/auth/utils/auth';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface PageProps {
  params: Promise<{
    mailId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { mailId } = await params;

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchQuery(trpc.categories.getAll.queryOptions());
  void queryClient.prefetchQuery(trpc.departments.getAll.queryOptions());
  void queryClient.prefetchQuery(trpc.contacts.getAll.queryOptions());
  void queryClient.prefetchQuery(trpc.mails.getOne.queryOptions({ mailId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MailView mailId={mailId} />
    </HydrationBoundary>
  );
};

export default Page;
