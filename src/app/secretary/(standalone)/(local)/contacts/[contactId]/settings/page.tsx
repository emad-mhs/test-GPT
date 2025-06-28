import { UserRoles } from '@/modules/auth/types';
import { RoleGate } from '@/modules/auth/ui/components/role-gate';
import { protectedPage } from '@/modules/auth/utils/auth';
import { ContactSettingsView } from '@/modules/secretary/contacts/ui/views/contact-settings-view';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

interface PageProps {
  params: Promise<{
    contactId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  await protectedPage();
  const queryClient = getQueryClient();

  const { contactId } = await params;

  void queryClient.prefetchQuery(
    trpc.contacts.getOne.queryOptions({ contactId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RoleGate allowedRole={[UserRoles.ADMIN, UserRoles.MANAGER]}>
        <ContactSettingsView contactId={contactId} />
      </RoleGate>
    </HydrationBoundary>
  );
};

export default Page;
