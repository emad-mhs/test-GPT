'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LogOutIcon, UserIcon } from './icons';
import { ChevronUpIcon } from '@/assets/icons';

import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from '@/components/dropdown';
import { cn } from '@/lib/utils';
import { paths } from '@/lib/paths';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { UserInfoSkeleton } from './skeleton';
import { signOut } from 'next-auth/react';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

export const UserInfo = () => (
  <Suspense fallback={<UserInfoSkeleton />}>
    <ErrorBoundary fallback={<p>حدث خطأ في تحميل البيانات</p>}>
      <UserInfoSuspense />
    </ErrorBoundary>
  </Suspense>
);

function UserInfoSuspense() {
  const trpc = useTRPC();

  const [isOpen, setIsOpen] = useState(false);

  // Fetch session
  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const user = session.user;
  const avatarSrc = user.imageUrl || '/default-avatar.png';

  return (
    <Dropdown isOpen={isOpen} setIsOpenAction={setIsOpen}>
      <DropdownTrigger className='rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark'>
        <span className='sr-only'>الحساب</span>

        <figure className='flex items-center gap-3'>
          <UserAvatar src={avatarSrc} alt={user?.name as string} />
          <figcaption className='flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only'>
            <span>{user?.name}</span>
            <ChevronUpIcon
              aria-hidden
              className={cn(
                'rotate-180 transition-transform',
                isOpen && 'rotate-0'
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className='border border-stroke bg-popover shadow-md dark:border-dark-3 min-[230px]:min-w-[17.5rem]'
        align='start'
      >
        <figure className='flex items-center gap-2.5 px-5 py-3.5'>
          <div className='relative w-[50px] h-[50px]'>
            <UserAvatar src={avatarSrc} alt={user?.name as string} />
          </div>
          <figcaption className='space-y-1 text-base font-medium'>
            <div className='mb-2 leading-none'>{user?.name}</div>
            <div className='leading-none text-gray-6'>{user?.email}</div>
          </figcaption>
        </figure>

        <hr className='border-[#E8E8E8] dark:border-dark-3' />

        <div className='p-2'>
          <UserDropdownItem
            href={paths.profilePage({ userId: user?.id ?? '' })}
            icon={<UserIcon />}
            label='الملف الشخصي'
            onClick={() => setIsOpen(false)}
          />
        </div>

        <hr className='border-[#E8E8E8] dark:border-dark-3' />

        <div className='p-2'>
          <UserDropdownItem
            icon={<LogOutIcon />}
            label='تسجيل الخروج'
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            asButton
            variant='danger'
          />
        </div>
      </DropdownContent>
    </Dropdown>
  );
}

function UserAvatar({ src, alt }: { src: string; alt?: string }) {
  return (
    <Image
      src={src}
      alt={`صورة المستخدم ${alt ?? ''}`}
      width={48}
      height={48}
      className='size-12 rounded-full'
    />
  );
}

function UserDropdownItem({
  href,
  icon,
  label,
  onClick,
  asButton = false,
  variant = 'default',
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  asButton?: boolean;
  variant?: 'default' | 'danger';
}) {
  const baseClasses =
    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-base font-medium transition';

  const variantClasses =
    variant === 'danger'
      ? 'text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900 dark:hover:text-white'
      : 'text-[#4B5563] dark:text-dark-6 hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white';

  const classes = `${baseClasses} ${variantClasses}`;

  if (asButton) {
    return (
      <button onClick={onClick} className={classes}>
        {icon}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link href={href ?? '#'} onClick={onClick} className={classes}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
