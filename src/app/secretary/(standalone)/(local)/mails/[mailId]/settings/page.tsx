import { protectedPage } from '@/modules/auth/utils/auth';
import { MailSettingsView } from '@/modules/secretary/mails/ui/views/mail-settings-view';
import { getQueryClient, trpc } from '@/trpc/server';
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

  void queryClient.prefetchQuery(trpc.mails.getOne.queryOptions({ mailId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MailSettingsView mailId={mailId} />
    </HydrationBoundary>
  );
};

export default Page;
