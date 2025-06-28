import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { useSidebarContext } from './sidebar-context';
import type { ReactNode } from 'react';

const menuItemBaseStyles = cva(
  'rounded-lg px-3.5 font-medium text-dark-4 transition-all duration-200 dark:text-dark-6',
  {
    variants: {
      isActive: {
        true: 'bg-[rgba(87,80,241,0.07)] text-primary hover:bg-[rgba(87,80,241,0.07)] dark:bg-[#FFFFFF1A] dark:text-white',
        false:
          'hover:bg-gray-100 hover:text-dark hover:dark:bg-[#FFFFFF1A] hover:dark:text-white',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

type BaseProps = {
  className?: string;
  children: ReactNode;
  isActive?: boolean;
};

type ButtonProps = BaseProps & {
  as?: 'button';
  onClick: () => void;
};

type LinkProps = BaseProps & {
  as: 'link';
  href: string;
};

export function MenuItem(props: ButtonProps | LinkProps) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  const styles = menuItemBaseStyles({
    isActive: props.isActive,
  });

  if (props.as === 'link') {
    return (
      <Link
        href={props.href}
        onClick={() => isMobile && toggleSidebar()}
        className={cn('relative block py-2', styles, props.className)}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      aria-expanded={props.isActive}
      className={cn(
        'flex w-full items-center gap-3 py-3',
        styles,
        props.className
      )}
    >
      {props.children}
    </button>
  );
}
