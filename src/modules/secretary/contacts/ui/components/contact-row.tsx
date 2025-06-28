'use client';

import { useRouter } from 'next/navigation';
import { TableRow, TableCell } from '@/components/table';
import { paths } from '@/lib/paths';
import { Contact } from '../../types';

interface ContactRowProps {
  contact: Contact;
}

export const ContactRow = ({ contact }: ContactRowProps) => {
  const router = useRouter();
  const contactUrl = paths.contactSettingsPage({
    contactId: contact.id,
  });
  return (
    <TableRow
      key={contact.id}
      className='cursor-pointer'
      onClick={() => router.push(contactUrl)}
      onMouseEnter={() => router.prefetch(contactUrl)}
    >
      <TableCell className='pr-6 line-clamp-3'>{contact.jobTitle}</TableCell>
      <TableCell>{contact.name}</TableCell>
      <TableCell>{contact.email}</TableCell>
      <TableCell className='text-sm truncate'>{contact.phone}</TableCell>
    </TableRow>
  );
};
