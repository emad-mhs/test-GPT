import { FormError } from '@/components/form-error';
import { UserRoles } from '../../types';
import { protectedPage } from '../../utils/auth';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRoles[];
}

export const RoleGate = async ({ children, allowedRole }: RoleGateProps) => {
  const user = await protectedPage();

  if (!allowedRole?.includes(user?.role as UserRoles)) {
    return <FormError message='ليست لديك الصلاحيات لعرض المحتوي!' />;
  }

  return <>{children}</>;
};
