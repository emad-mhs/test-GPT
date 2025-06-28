'use client';

import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV_DATA } from './data';
import { ChevronUp } from './icons';
import { MenuItem } from './menu-item';
import { useSidebarContext } from './sidebar-context';
import { ArrowRightIcon } from 'lucide-react';
import { paths } from '@/lib/paths';

export function Sidebar() {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => (prev.includes(title) ? [] : [title]));

    // Uncomment the following line to enable multiple expanded items
    // setExpandedItems((prev) =>
    //   prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    // );
  };

  useEffect(() => {
    const matchedGroup = NAV_DATA.flatMap(section => section.items)
      .filter(item => item.items?.some(sub => sub.url === pathname))
      .map(item => item.title);

    if (matchedGroup.length > 0) {
      setExpandedItems(matchedGroup);
    }
  }, [pathname]);

  return (
    <>
      {isMobile && isOpen && (
        <div
          className='fixed inset-0 z-40 bg-dark/50 transition-opacity duration-300'
          onClick={() => setIsOpen(false)}
          aria-hidden='true'
        />
      )}

      <aside
        className={cn(
          'bg-sidebar max-w-[290px] overflow-hidden border-r border-gray-200 transition-[width] duration-200 ease-linear dark:border-gray-800',
          isMobile ? 'fixed top-0 bottom-0 z-50' : 'sticky top-0 h-screen',
          isOpen ? 'w-full' : 'w-0'
        )}
        aria-label='Main navigation'
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className='flex h-full flex-col py-10 pl-[7px] pr-[25px]'>
          {/* Logo Section */}
          <div className='relative pr-4.5'>
            <Link
              href={paths.secretaryDashboard()}
              onClick={() => isMobile && toggleSidebar()}
              className='px-0 py-2.5 min-[850px]:py-0'
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className='absolute top-1/2 right-0 left-3/4 -translate-y-1/2 text-right'
              >
                <span className='sr-only'>Close Menu</span>
                <ArrowRightIcon className='ml-auto size-6' />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className='custom-scrollbar mt-6 flex-1 overflow-y-auto pl-3 min-[850px]:mt-10'>
            {NAV_DATA.map(section => (
              <div key={section.label} className='mb-6'>
                <h2 className='mb-5 text-sm font-medium text-dark-4 dark:text-dark-6'>
                  {section.label}
                </h2>

                <nav role='navigation' aria-label={section.label}>
                  <ul className='space-y-2'>
                    {section.items.map(item => {
                      const hasChildren = !!item.items?.length;
                      const isActive = hasChildren
                        ? item.items!.some(sub => sub.url === pathname)
                        : pathname === item.url;

                      return (
                        <li key={item.title}>
                          {hasChildren ? (
                            <>
                              {/* عنصر رئيسي قابل للتوسيع */}
                              <MenuItem
                                isActive={isActive}
                                onClick={() => toggleExpanded(item.title)}
                                className={cn(
                                  'flex items-center gap-3 py-2 px-3 rounded'
                                )}
                              >
                                <item.icon className='size-6 shrink-0' />
                                <span>{item.title}</span>
                                <ChevronUp
                                  className={cn(
                                    'mr-auto transition-transform duration-200',
                                    expandedItems.includes(item.title)
                                      ? 'rotate-0'
                                      : 'rotate-180'
                                  )}
                                />
                              </MenuItem>

                              {/* قائمة الفرعيّات */}
                              {expandedItems.includes(item.title) && (
                                <ul className='ml-6 mt-2 space-y-1'>
                                  {item.items!.map(sub => {
                                    const isSubActive = pathname === sub.url;
                                    return (
                                      <li key={sub.title}>
                                        <MenuItem
                                          as='link'
                                          href={sub.url}
                                          isActive={isSubActive}
                                          className={cn(
                                            'block py-1 px-3 rounded'
                                          )}
                                        >
                                          <span>{sub.title}</span>
                                        </MenuItem>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </>
                          ) : (
                            /* عنصر بدون فرعيّات */
                            <MenuItem
                              isActive={isActive}
                              as='link'
                              href={item.url!}
                              className={cn(
                                'flex items-center gap-3 py-2 px-3 rounded'
                              )}
                            >
                              <item.icon className='size-6 shrink-0' />
                              <span>{item.title}</span>
                            </MenuItem>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
