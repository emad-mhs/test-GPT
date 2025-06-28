'use client';

import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/table';
import { paths } from '@/lib/paths';
import { Department } from '../../types';

interface DepartmentRowProps {
  department: Department;
}

export const DepartmentRow = ({ department }: DepartmentRowProps) => {
  const router = useRouter();
  const departmentUrl = paths.departmentSettingsPage({
    departmentId: department.id.toString(),
  });
  return (
    <TableRow
      key={department.id}
      className='cursor-pointer'
      onClick={() => router.push(departmentUrl)}
      onMouseEnter={() => router.prefetch(departmentUrl)}
    >
      <TableCell className='max-w-1'>{department.rank}</TableCell>
      <TableCell className='pr-6 line-clamp-3'>{department.name}</TableCell>
      <TableCell>{department.manager}</TableCell>
      <TableCell>{department.email}</TableCell>
      <TableCell className='text-sm truncate'>{department.phone}</TableCell>
    </TableRow>
  );
};
