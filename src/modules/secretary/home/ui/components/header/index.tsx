'use client';

import { useSidebarContext } from '../sidebar/sidebar-context';
import { MenuIcon } from './icons';
import { ThemeToggleSwitch } from './theme-toggle';
import { UserInfo } from './user-info';
import { Button } from '@/components/ui/button';
import { SearchInput } from './search-input';

export function Header() {
  const { toggleSidebar } = useSidebarContext();

  return (
    <header className='border-stroke shadow-1 dark:border-stroke-dark bg-sidebar sticky top-0 z-30 flex items-center justify-between border-b px-4 py-5 md:px-5 2xl:px-10'>
      <Button onClick={toggleSidebar} variant='ghost' className='size-8 p-0'>
        <MenuIcon />
        <span className='sr-only'>Toggle Sidebar</span>
      </Button>

      <SearchInput />

      <div className='flex gap-2 shrink-0'>
        <ThemeToggleSwitch />
        <UserInfo />
      </div>
    </header>
  );
}
