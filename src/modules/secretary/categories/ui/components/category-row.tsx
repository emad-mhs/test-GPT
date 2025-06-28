'use client';

import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/table';
import { paths } from '@/lib/paths';
import { Category } from '../../types';

interface CategoryRowProps {
  category: Category;
}

export const CategoryRow = ({ category }: CategoryRowProps) => {
  const router = useRouter();
  const categoryUrl = paths.categoryPage({
    categoryId: category.id,
  });
  return (
    <TableRow
      key={category.id}
      className='cursor-pointer text-right text-base font-light'
      onClick={() => router.push(categoryUrl)}
      onMouseEnter={() => router.prefetch(categoryUrl)}
    >
      <TableCell className='line-clamp-3'>{category.name}</TableCell>
    </TableRow>
  );
};
