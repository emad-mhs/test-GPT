import { redirect } from 'next/navigation';

import { paths } from '@/lib/paths';
// import { trpc } from '@/trpc/server';
import { protectedPage } from '@/modules/auth/utils/auth';

const Home = async () => {
  const user = await protectedPage();

  // void trpc.users.getSession.prefetch();

  if (user) {
    redirect(paths.secretaryDashboard());
  }
};

export default Home;
