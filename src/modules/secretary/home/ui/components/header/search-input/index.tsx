'use client';

import { Suspense, useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const SearchInput = () => (
  <Suspense fallback={<Skeleton className='h-10 w-full' />}>
    <SearchInputSuspense />
  </Suspense>
);

const SearchInputSuspense = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get('search') || '');

  const preservedParams = [
    'type',
    'status',
    'senderId',
    'receiverId',
    'from',
    'to',
  ];

  const buildUrl = (searchValue: string | null) => {
    const url = new URL(pathname, process.env.NEXT_PUBLIC_APP_URL);
    const params = new URLSearchParams();

    // احتفظ بالبارامترات الأخرى
    preservedParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) params.set(param, value);
    });

    if (searchValue && searchValue.trim()) {
      params.set('search', searchValue.trim());
    }

    url.search = params.toString();
    return url.toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(buildUrl(value));
  };

  const handleReset = () => {
    setValue('');
    router.push(buildUrl(null));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex w-full max-w-[600px] items-center'
    >
      <div className='relative w-full'>
        <input
          type='text'
          placeholder='بحث...'
          value={value}
          onChange={e => setValue(e.target.value)}
          className='w-full py-2 pl-12 pr-4 rounded-r-full border-none bg-white dark:bg-input focus:outline-none focus:ring-2 focus:ring-primary'
        />

        {value && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={handleReset}
            className='absolute left-2 top-1/2 -translate-y-1/2 rounded-full'
          >
            <XIcon className='text-gray-500' />
          </Button>
        )}
      </div>

      <button
        type='submit'
        disabled={!value.trim()}
        className='px-5 py-2.5 bg-accent-foreground/10 dark:bg-muted/70 rounded-l-full hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <SearchIcon className='size-5' />
      </button>
    </form>
  );
};
