import { VerifyMailView } from '@/modules/secretary/mails/ui/views/verify-mail-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface PageProps {
  params: Promise<{
    mailId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const queryClient = getQueryClient();
  const { mailId } = await params;

  void queryClient.prefetchQuery(
    trpc.mails.verifyMail.queryOptions({ mailId })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VerifyMailView mailId={mailId} />
    </HydrationBoundary>
  );
};

export default Page;
