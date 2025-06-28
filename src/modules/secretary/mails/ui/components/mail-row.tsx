'use client';

import { TableRow, TableCell } from '@/components/table';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { convertStatus } from '@/lib/utils';
import { Mail } from '../../types';
import { formattedRefNum, getIcon } from '../../utils';
import { paths } from '@/lib/paths';

interface MailRowProps {
  mail: Mail;
}

export const MailRow = ({ mail }: MailRowProps) => {
  const router = useRouter();
  const mailUrl = paths.mailPage({ mailId: mail.id });

  return (
    <TableRow
      className='cursor-pointer'
      onClick={() => router.push(mailUrl)}
      onMouseEnter={() => router.prefetch(mailUrl)}
    >
      <TableCell>
        <div className='flex items-center max-w-lg pr-6 line-clamp-3'>
          {mail.subject}
        </div>
      </TableCell>
      <TableCell>{getIcon(mail.type)}</TableCell>
      <TableCell className='max-w-96'>
        <div>
          <div className='flex flex-row space-x-1 space-x-reverse font-bold'>
            <span>من: </span>
            {mail.sender}
          </div>
          <div className='flex flex-row space-x-1 space-x-reverse'>
            <span>إلى: </span>
            {mail.receiver}
          </div>
        </div>
      </TableCell>
      <TableCell className='text-right' dir='ltr'>
        {format(new Date(mail.createdAt), 'dd MMMM, yyyy')}
      </TableCell>
      <TableCell className='w-fit'>
        {formattedRefNum({ type: mail.type, refNum: mail.refNum })}
      </TableCell>
      <TableCell>
        <Badge
          variant={mail.status}
          className='text-xs font-medium px-3.5 py-2.5'
        >
          {convertStatus(mail.status)}
        </Badge>
      </TableCell>
    </TableRow>
  );
};
