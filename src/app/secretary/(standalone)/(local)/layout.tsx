'use client';

import { ThemeToggleSwitch } from '@/modules/secretary/home/ui/components/header/theme-toggle';
import { UserInfo } from '@/modules/secretary/home/ui/components/header/user-info';
// import { ModeToggle } from '@/components/mode-toggle';
// import { UserButton } from '@/features/auth/components/user-button';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// import { UserButton } from "@/features/auth/components/user-button";

interface StandloneLayoutProps {
  children: React.ReactNode;
}

const StandloneLayout = ({ children }: StandloneLayoutProps) => {
  const { theme = 'light' } = useTheme();
  // const [logo, setLogo] = useState('/secretary-logos/logo.png');
  const [logo, setLogo] = useState('/secretary-logos/light.png');

  useEffect(() => {
    const effectiveTheme = theme === 'system' ? 'light' : theme;
    // setLogo(
    //   effectiveTheme === 'light'
    //     ? '@/assets/secretary-logos/logo.png'
    //     : '@/assets/secretary-logos/dark-logo.png'
    // );
    setLogo(
      effectiveTheme === 'light'
        ? '/secretary-logos/light.png'
        : '/secretary-logos/dark.png'
    );
  }, [theme]);

  return (
    <main className='bg-primary-foreground min-h-screen'>
      <div className='mx-auto max-w-screen-2xl p-4'>
        <nav className='flex justify-between items-center h-[73px]'>
          <Link href='/' className='px-0 py-2.5'>
            <Image src={logo} alt='Logo' height={56} width={152} />
          </Link>

          <div className='flex flex-row items-center justify-center gap-2'>
            <ThemeToggleSwitch />
            <UserInfo />
          </div>
        </nav>
        <div className='flex flex-col items-center justify-center py-4'>
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandloneLayout;
