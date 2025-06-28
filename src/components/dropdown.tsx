'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type KeyboardEventHandler,
  type PropsWithChildren,
} from 'react';

import { cn } from '@/lib/utils';
import { useClickOutside } from '@/hooks/use-click-outside';
import { SetStateActionType } from '@/types/set-state-action-type';

type DropdownContextType = {
  isOpen: boolean;
  handleOpen: () => void;
  handleClose: () => void;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

function useDropdownContext() {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown.* components must be used within <Dropdown>');
  }
  return context;
}

type DropdownProps = {
  isOpen: boolean;
  setIsOpenAction: SetStateActionType<boolean>;
  children: React.ReactNode;
};

export function Dropdown({ isOpen, setIsOpenAction, children }: DropdownProps) {
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleClose = () => setIsOpenAction(false);
  const handleOpen = () => setIsOpenAction(true);

  const handleKeyDown: KeyboardEventHandler = event => {
    if (event.key === 'Escape') handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    } else {
      setTimeout(() => {
        triggerRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  return (
    <DropdownContext.Provider value={{ isOpen, handleOpen, handleClose }}>
      <div className='relative' onKeyDown={handleKeyDown}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

type TriggerProps = React.HTMLAttributes<HTMLButtonElement>;

export function DropdownTrigger({
  children,
  className,
  ...props
}: TriggerProps) {
  const { handleOpen, isOpen } = useDropdownContext();

  return (
    <button
      type='button'
      onClick={handleOpen}
      aria-haspopup='menu'
      aria-expanded={isOpen}
      data-state={isOpen ? 'open' : 'closed'}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

type ContentProps = {
  align?: 'start' | 'end' | 'center';
  className?: string;
  children: React.ReactNode;
};

export function DropdownContent({
  align = 'center',
  className,
  children,
}: ContentProps) {
  const { isOpen, handleClose } = useDropdownContext();
  const contentRef = useClickOutside<HTMLDivElement>(() => {
    if (isOpen) handleClose();
  });

  if (!isOpen) return null;

  const alignment = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  }[align];

  return (
    <div
      ref={contentRef}
      role='menu'
      aria-orientation='vertical'
      className={cn(
        'absolute z-50 mt-2 min-w-[8rem] origin-top-right rounded-lg shadow-md',
        'fade-in-0 zoom-in-95 animate-in',
        alignment,
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownClose({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const { handleClose } = useDropdownContext();

  return (
    <div onClick={handleClose} className={className}>
      {children}
    </div>
  );
}
