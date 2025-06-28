'use client';

import qs from 'query-string';
import * as React from 'react';
import { Check, ChevronDown, PlusCircle, UsersRound } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
import { useCreateUserModal } from '@/modules/secretary/users/hooks/use-create-user-modal';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface UserSwitcherProps extends PopoverTriggerProps {
  options?: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  value?: string;
}

export const UserSwitcher = ({
  className,
  options = [],
  placeholder,
  disabled,
}: UserSwitcherProps) => {
  const trpc = useTRPC();

  const newUser = useCreateUserModal();
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const userId = params.get('userId') || 'all';
  const tableName = params.get('tableName');
  const from = params.get('from');
  const to = params.get('to');

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );

  const isSecretary = session?.user.departmentId === departmentsMain.SECRETARY;

  const currentUser = options.find(item => item.value === userId);

  const [open, setOpen] = React.useState(false);

  const onChange = (newValue: string) => {
    setOpen(false);
    const query = {
      userId: newValue,
      tableName,
      from,
      to,
    };

    if (newValue === 'all') {
      query.userId = '';
    }

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          aria-label={placeholder}
          disabled={disabled}
          className={cn(
            'lg:w-auto w-full justify-between h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 outline-hidden text-muted-foreground hover:text-muted-foreground focus:bg-white/30 transition',
            className
          )}
        >
          <UsersRound className='size-4 ml-2' />
          {currentUser ? currentUser.label : placeholder}
          <ChevronDown className='mr-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='lg:w-auto w-full p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='البحث...' />
            <CommandEmpty>جهة الاتصال غير موجودة</CommandEmpty>
            <CommandGroup heading='جهات الاتصال'>
              {options.map(contact => (
                <CommandItem
                  key={contact.value}
                  onSelect={() => onChange(contact.value)}
                  className='text-sm'
                >
                  {contact.label}
                  <Check
                    className={cn(
                      'mr-auto h-4 w-4',
                      currentUser?.value === contact.value
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
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      newUser.open();
                    }}
                  >
                    <PlusCircle className='ml-2 h-5 w-5' />
                    إنشاء جهة اتصال
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
