// import { getQueryClient, trpc } from '@/trpc/server';
// import { MailStatuses, MailTypes } from '@/modules/secretary/mails/types';
// import { SummaryView } from '@/modules/secretary/summary/ui/views/summary-view';
// import { protectedPage } from '@/modules/auth/utils/auth';
// import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

// export const dynamic = 'force-dynamic';

// interface PageProps {
//   searchParams: Promise<{
//     type: MailTypes | undefined;
//     status: MailStatuses | undefined;
//     senderId: string | undefined;
//     receiverId: string | undefined;
//     from: string | undefined;
//     to: string | undefined;
//   }>;
// }

// const Page = async ({ searchParams }: PageProps) => {
//   await protectedPage();
//   const queryClient = getQueryClient();

//   const { type, status, senderId, receiverId, from, to } = await searchParams;

//   void queryClient.prefetchQuery(trpc.users.getSession.queryOptions());
//   void queryClient.prefetchQuery(trpc.contacts.getAll.queryOptions());
//   void queryClient.prefetchQuery(
//     trpc.summary.getMany.queryOptions({
//       type,
//       status,
//       senderId,
//       receiverId,
//       from,
//       to,
//     })
//   );

//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       <SummaryView
//         type={type}
//         status={status}
//         senderId={senderId}
//         receiverId={receiverId}
//         from={from}
//         to={to}
//       />
//     </HydrationBoundary>
//   );
// };

// export default Page;
