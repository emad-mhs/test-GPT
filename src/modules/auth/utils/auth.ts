// import { auth } from '@/auth';

// export const currentUser = async () => {
//   const session = await auth();

//   return session?.user;
// };

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { paths } from '@/lib/paths';

export async function protectedPage() {
  // unwrap your session however you like:
  const session = await auth();

  if (!session) {
    // kick them to the login screen
    redirect(paths.login());
  }

  // you can also return the session for downstream use
  return session.user;
}
