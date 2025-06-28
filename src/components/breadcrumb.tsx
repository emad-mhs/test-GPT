'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';
import { paths } from '@/lib/paths';

type BreadCrumbItem = {
  title?: string;
  link: string;
};

type BreadCrumbProps = {
  items: BreadCrumbItem[];
};

export const BreadCrumb = ({ items }: BreadCrumbProps) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      className='flex items-center space-x-1 space-x-reverse text-sm text-muted-foreground'
      aria-label='breadcrumb'
    >
      <Link
        href={paths.secretaryDashboard()}
        className='text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition overflow-hidden text-ellipsis whitespace-nowrap'
      >
        لوحة التحكم
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const title = item.title || '—';

        return (
          <React.Fragment key={`${item.link}-${index}`}>
            <ChevronLeftIcon className='size-4 lg:size-5 text-muted-foreground' />

            {isLast ? (
              <span
                className='text-sm lg:text-lg font-semibold text-foreground'
                aria-current='page'
              >
                {title}
              </span>
            ) : (
              <Link
                href={item.link}
                className='text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition'
              >
                {title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
