'use client';

import { signIn } from 'next-auth/react';
// import { FcGoogle } from 'react-icons/fc';
//  import { FaGithub } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';
import { GitBranch, GoalIcon } from 'lucide-react';

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const onClick = (provider: 'google' | 'github') => {
    signIn(provider, {
      callbackUrl: callbackUrl || paths.home(),
    });
  };

  return (
    <div className='flex items-center w-full gap-x-2'>
      <Button
        size='lg'
        className='w-full'
        variant='outline'
        onClick={() => onClick('google')}
      >
        <GoalIcon className='size-5' />
      </Button>
      <Button
        size='lg'
        className='w-full'
        variant='outline'
        onClick={() => onClick('github')}
      >
        <GitBranch className='size-5' />
      </Button>
    </div>
  );
};
