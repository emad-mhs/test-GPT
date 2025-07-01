'use client';

import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';

import { departmentsMain } from '@/modules/secretary/departments/types';
import { useTRPC } from '@/trpc/client';
import { UsersRound, Check, PlusCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilters } from '@/hooks/use-filter-param';
import { useCreateContactModal } from '@/modules/secretary/contacts/hooks/use-create-contact-modal';
import { useSuspenseQuery } from '@tanstack/react-query';

interface SenderSwitcherProps {
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export const SenderSwitcher: React.FC<SenderSwitcherProps> = ({
  options,
  placeholder = 'اختر الجهة المرسلة',
  disabled = false,
}) => {
  const trpc = useTRPC();

  // hook عام للفلاتر يدير قيمة senderId في الـ URL
  const { filters, setSenderId } = useFilters();
  const { senderId } = filters;

  const newContact = useCreateContactModal();

  // جلب بيانات الجلسة لمعرفة إذا كان سكرتير
  const { data: session } = useSuspenseQuery(
    trpc.users.getSession.queryOptions()
  );
  const isSecretary = session.user.departmentId === departmentsMain.SECRETARY;

  // لإظهار الاسم الحالي أو placeholder
  const current = options.find(o => o.value === senderId);

  // عند اختيار عنصر جديد
  const handleSelect = (value: string) => {
    // نستخدم '' لتمثيل "all" (سيتم مسح الباراميتر من الـ URL)
    setSenderId(value === 'all' ? '' : value);
  };

  // لإدارة فتح/إغلاق الـ popover
  const [open, setOpen] = React.useState(false);

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
            'w-full lg:w-auto justify-between h-9 px-3 rounded-md text-sm bg-white/10 hover:bg-white/20 transition'
          )}
        >
          <UsersRound className='size-4 ml-2' />
          {current?.label ?? placeholder}
          <ChevronDown className='size-4 mr-2 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-full lg:w-auto p-0'>
        <Command>
          <CommandInput placeholder='البحث...' />
          <CommandEmpty>لا توجد نتائج</CommandEmpty>
          <CommandList>
            <CommandGroup heading='جهات الاتصال'>
              {/* خيار "الكل" */}
              <CommandItem
                onSelect={() => handleSelect('all')}
                className='text-sm flex justify-between'
              >
                كل الجهات
                <Check
                  className={senderId === '' ? 'opacity-100' : 'opacity-0'}
                />
              </CommandItem>
              {/* بقية الخيارات */}
              {options.map(opt => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => handleSelect(opt.value)}
                  className='text-sm flex justify-between'
                >
                  {opt.label}
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      senderId === opt.value ? 'opacity-100' : 'opacity-0'
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
                    <PlusCircle className='ml-2 size-4' />
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
