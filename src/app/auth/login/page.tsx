import { auth } from '@/auth';
import { paths } from '@/lib/paths';
import { LoginForm } from '@/modules/auth/ui/components/login-form';

import { redirect } from 'next/navigation';

const LoginPage = async () => {
  const user = await auth();

  if (user) {
    redirect(paths.home());
  }

  return <LoginForm />;
};

export default LoginPage;
