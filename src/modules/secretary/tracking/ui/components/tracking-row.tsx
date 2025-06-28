'use client';

import { TableRow, TableCell } from '@/components/table';
import { differenceInCalendarDays, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { TrackingMail } from '../../types';
import { paths } from '@/lib/paths';
import { getIcon } from '@/modules/secretary/mails/utils';

interface MailRowProps {
  mail: TrackingMail;
}

export const TrackingRow = ({ mail }: MailRowProps) => {
  const router = useRouter();
  const mailUrl = paths.mailPage({ mailId: mail.id });

  const daysAgo = differenceInCalendarDays(new Date(), mail.dueDate!);
  // تخصيص اللون
  let colorClass = '';
  if (daysAgo === 0) colorClass = 'text-green-600';
  else if (daysAgo === 1) colorClass = 'text-yellow-600';
  else colorClass = 'text-red-600';

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
      <TableCell>
        <p className=' mr-5 md:mr-0 text-muted-foreground'>
          {mail.ccList?.map(cc => (
            <span className='block' key={cc}>
              - {cc}
            </span>
          ))}
        </p>
      </TableCell>
      <TableCell>
        <p className='mr-5 md:mr-0  text-muted-foreground'>
          {mail.departmentList?.map(cc => (
            <span className='block' key={cc}>
              - {cc}
            </span>
          ))}
        </p>
      </TableCell>
      <TableCell className={colorClass}>
        {format(new Date(mail.dueDate!), 'dd/MM/yyyy')}
      </TableCell>
    </TableRow>
  );
};
