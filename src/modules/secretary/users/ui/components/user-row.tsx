'use client';

import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/table';
import { Check } from 'lucide-react';
import { paths } from '@/lib/paths';
import { convertRole } from '../../utils';
import { UserAvatar } from './user-avatar';
import { User } from '../../types';

interface UserRowProps {
  user: User;
}

export const UserRow = ({ user }: UserRowProps) => {
  const router = useRouter();
  const userUrl = paths.userSettingsPage({ userId: user.id });

  return (
    <TableRow
      className='cursor-pointer'
      onClick={() => router.push(userUrl)}
      onMouseEnter={() => router.prefetch(userUrl)}
    >
      <TableCell className='pr-6'>
        <div className='flex items-center gap-x-2 text-sm font-medium'>
          <UserAvatar
            className='size-6'
            name={user.name}
            image={user.imageUrl}
          />
          <p className='line-clamp-1'>{user.name}</p>
        </div>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.department}</TableCell>
      <TableCell>{convertRole(user.role)}</TableCell>
      <TableCell>{user.isTwoFactorEnabled ? <Check /> : ''}</TableCell>
      <TableCell>{user.canAdd ? <Check /> : ''}</TableCell>
      <TableCell>{user.canUpdate ? <Check /> : ''}</TableCell>
      <TableCell>{user.canDelete ? <Check /> : ''}</TableCell>
    </TableRow>
  );
};
