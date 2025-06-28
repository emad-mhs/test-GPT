// import { redirect } from 'next/navigation';

import { RegisterForm } from '@/modules/auth/ui/components/register-form';

// import { paths } from '@/lib/paths';
// import { currentUser } from '@/lib/auth';

// import { UserRole } from '@/features/users/types';

const RegisterPage = async () => {
  // const user = await currentUser();
  // if (user?.role !== UserRole.ADMIN) {
  //   redirect(paths.login());
  // }

  return <RegisterForm />;
};

export default RegisterPage;
