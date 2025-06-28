'use client';

import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/table';
import { paths } from '@/lib/paths';

import { Document } from '../../types';
import { format } from 'date-fns';

interface DocumentRowProps {
  document: Document;
}

export const DocumentRow = ({ document }: DocumentRowProps) => {
  const router = useRouter();
  const docUrl = paths.documentPage({ documentId: document.id });

  return (
    <TableRow
      key={document.id}
      className='cursor-pointer'
      onClick={() => router.push(docUrl)}
      onMouseEnter={() => router.prefetch(docUrl)}
    >
      <TableCell className='pr-6 line-clamp-3'>{document.subject}</TableCell>
      <TableCell>{document.category}</TableCell>
      <TableCell className='text-right' dir='ltr'>
        {format(document.createdAt, 'dd MMMM, yyyy')}
      </TableCell>
    </TableRow>
  );
};
