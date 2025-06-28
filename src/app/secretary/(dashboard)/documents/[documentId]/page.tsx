import { getQueryClient, trpc } from '@/trpc/server';
import { DocumentView } from '@/modules/secretary/documents/ui/views/document-view';
import { RoleGate } from '@/modules/auth/ui/components/role-gate';
import { UserRoles } from '@/modules/auth/types';
import { protectedPage } from '@/modules/auth/utils/auth';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface PageProps {
  params: Promise<{
    documentId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { documentId } = await params;

  void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
  void queryClient.prefetchQuery(
    trpc.documents.getOne.queryOptions({ documentId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoleGate allowedRole={[UserRoles.ADMIN, UserRoles.MANAGER]}>
        <DocumentView documentId={documentId} />
      </RoleGate>
    </HydrationBoundary>
  );
};

export default Page;
