'use client';

import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { SidebarProvider } from '@/modules/secretary/home/ui/components/sidebar/sidebar-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <ThemeProvider defaultTheme='light' attribute='class'>
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
}
