'use client';

import * as React from 'react';
import { Check, ChevronDown, PlusCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { departmentsMain } from '@/modules/secretary/departments/types';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

interface Option {
  label: string;
  value: string;
}

interface SelectSwitcherProps {
  value?: string | null;
  options?: Option[];
  placeholder?: string;
  listHeading?: string;
  createLabel?: string;
  disabled?: boolean;
  onChangeAction: (value?: string) => void;
  onOpenAction: () => void;
}

export const SelectSwitcher = ({
  value,
  options = [],
  placeholder = 'اختر من القائمة',
  listHeading,
  createLabel = 'إضافة جديد',
  disabled = false,
  onChangeAction,
  onOpenAction,
}: SelectSwitcherProps) => {
  const trpc = useTRPC();

  const [isOpen, setIsOpen] = React.useState(false);

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const isSecretary = session?.user.departmentId === departmentsMain.SECRETARY;
  const selected = options.find(opt => opt.value === value);

  const handleSelect = (option: Option) => {
    setIsOpen(false);
    onChangeAction(option.value);
  };

  const handleOpenCreate = () => {
    setIsOpen(false);
    onOpenAction();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          role='combobox'
          aria-expanded={isOpen}
          aria-label={placeholder}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm font-normal ring-offset-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50'
          )}
        >
          {selected ? selected.label : placeholder}
          <ChevronDown className='mr-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-full p-0'>
        <Command onWheel={e => e.stopPropagation()}>
          <CommandList>
            <CommandInput placeholder='بحث...' />

            <CommandEmpty>لا توجد نتائج</CommandEmpty>

            <CommandGroup heading={listHeading}>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option)}
                  className='text-sm'
                >
                  {option.label}
                  <Check
                    className={cn(
                      'mr-auto h-4 w-4',
                      selected?.value === option.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {isSecretary && (
            <>
              <CommandSeparator />
              <CommandList>
                <CommandGroup>
                  <CommandItem onSelect={handleOpenCreate}>
                    <PlusCircle className='ml-2 h-5 w-5' />
                    {createLabel}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
