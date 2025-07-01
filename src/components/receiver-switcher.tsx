'use client';

import React from 'react';
import { Check, ChevronDown, PlusCircle, UsersRound } from 'lucide-react';

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
import { useCreateContactModal } from '@/modules/secretary/contacts/hooks/use-create-contact-modal';
import { departmentsMain } from '@/modules/secretary/departments/types';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useFilters } from '@/hooks/use-filter-param';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  // items: Record<string, any>[];
  options?: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  value?: string;
}

export const ReceiverSwitcher = ({
  className,
  options = [],
  placeholder,
  disabled,
}: StoreSwitcherProps) => {
  const trpc = useTRPC();
  const newContact = useCreateContactModal();

  // hook عام للفلاتر يدير قيمة senderId في الـ URL
  const { filters, setReceiverId } = useFilters();
  const { receiverId } = filters;

  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const isSecretary = session.user.departmentId === departmentsMain.SECRETARY;

  // لإظهار الاسم الحالي أو placeholder
  const currentContact = options.find(item => item.value === receiverId);

  // لإدارة فتح/إغلاق الـ popover
  const [open, setOpen] = React.useState(false);

  // عند اختيار عنصر جديد
  const onChange = (value: string) => {
    // نستخدم '' لتمثيل "all" (سيتم مسح الباراميتر من الـ URL)
    setReceiverId(value === 'all' ? '' : value);
    setOpen(false);
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
          {currentContact ? currentContact.label : placeholder}
          <ChevronDown className='mr-2 size-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      {/* <PopoverContent className='w-[200px] p-0'> */}
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
                  {/* <Store className='ml-2 h-4 w-4' /> */}
                  {contact.label}
                  <Check
                    className={cn(
                      'mr-auto h-4 w-4',
                      currentContact?.value === contact.value
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
                      newContact.open();
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
