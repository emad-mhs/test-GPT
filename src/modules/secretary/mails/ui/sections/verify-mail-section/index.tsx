'use client';

import {
  LucideBinary,
  LucideFileOutput,
  LucideFileStack,
  LucideFileSymlink,
  LucideMail,
  LucideSend,
  UsersRound,
} from 'lucide-react';

import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';

import { convertStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Info } from '../../components/info';
import { formattedRefNum } from '../../../utils';

import { MailTypes } from '../../../types';
import { VerifyMailSectionSkeleton } from './skeleton';
import { ErrorFallback } from '@/components/error-fallback';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

interface VerifyMailSectionProps {
  mailId: string;
}

export const VerifyMailSection = ({ mailId }: VerifyMailSectionProps) => {
  return (
    <Suspense fallback={<VerifyMailSectionSkeleton />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <VerifyMailSectionSuspense mailId={mailId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VerifyMailSectionSuspense = ({ mailId }: VerifyMailSectionProps) => {
  const trpc = useTRPC();
  const {
    data: { mail, ccList },
  } = useSuspenseQuery(
    trpc.mails.verifyMail.queryOptions({
      mailId,
    })
  );

  const sentMail =
    mail.type === MailTypes.PERSONAL ||
    mail.type === MailTypes.OUTGOING ||
    mail.type === MailTypes.LOCAL_OUTGOING;

  const ccNames = ccList?.map(cc => cc.jobTitle).join(', ');

  return (
    <div className='max-w-(--breakpoint-2xl) mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-xs'>
        <CardHeader className='gap-y-2 flex-row items-center justify-between'>
          <CardTitle className='lg:text-xl line-clamp-1'>
            <div className='flex items-center space-x-2'>
              <span>
                {sentMail ? (
                  <LucideFileOutput className='size-6 lg:size-8' />
                ) : (
                  <LucideFileSymlink className='size-6 lg:size-8' />
                )}
              </span>
              <h2 className='max-w-prose py-2 text-sm md:text-xl lg:text-3xl font-bold tracking-tight'>
                {mail?.subject}
              </h2>
              <Badge
                variant={mail.status}
                className='text-xs font-medium px-2 py-1'
              >
                {convertStatus(mail?.status as string)}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Separator />
          <div className='py-2 flex-col items-center justify-center space-y-3'>
            <Info
              icon={<LucideSend className='size-3 md:size-4 lg:size-6' />}
              title='المرسل'
              description={mail?.sender}
            />
            <Info
              icon={<LucideMail className='size-3 md:size-4 lg:size-6' />}
              title='المستلم'
              description={mail?.receiver}
            />
            {ccNames && (
              <div className='flex flex-col  gap-1 md:flex-row md:items-start lg:gap-3'>
                <div className='flex gap-2 fle items-center lg:gap-3 '>
                  <UsersRound className='size-4 lg:size-6' />
                  <h2 className='md:min-w-[60px] lg:min-w-[100px]  text-sm font-bold tracking-tight  lg:text-lg'>
                    نسخة لـ:
                  </h2>
                </div>
                <p className='text-sm mr-5 md:mr-0 lg:text-lg text-muted-foreground'>
                  {ccList?.map(cc => (
                    <span key={cc.jobTitle}>- {cc.jobTitle}</span>
                  ))}
                </p>
              </div>
            )}
            <Info
              icon={<LucideBinary className='size-3 md:size-4 lg:size-6' />}
              title='المرجع'
              description={
                formattedRefNum({
                  type: mail?.type,
                  refNum: mail?.refNum,
                }) || 'لايوجد'
              }
            />
            <Info
              icon={<LucideFileStack className='size-3 md:size-4 lg:size-6' />}
              title='عدد المرفقات'
              description={mail?.attachments || 'لايوجد'}
            />
          </div>

          <Separator />
          <div className='mt-4 w-full h-[80vh] overflow-auto'>
            <object
              data={mail?.fileUrl as string}
              type='application/pdf'
              className='border-0 top-0 w-full h-full'
              // width='100%'
              // height='auto'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
