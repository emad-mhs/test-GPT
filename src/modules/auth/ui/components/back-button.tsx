'use client';

import Link from 'next/link';

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Link href={href} className='text-sm text-primary hover:underline'>
      {label}
    </Link>
  );
};
