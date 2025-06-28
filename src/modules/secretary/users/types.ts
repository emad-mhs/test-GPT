import { UserRoles } from '@/modules/auth/types';

export interface User {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  department?: string | null;
  role: UserRoles;
  isTwoFactorEnabled?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}
