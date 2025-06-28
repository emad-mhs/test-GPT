/* eslint-disable @next/next/no-img-element */
'use client';

import { format } from 'date-fns';
import { formattedRefNum } from '../../utils';
import { MailTypes } from '../../types';

interface Props {
  type: MailTypes;
  refNum: string;
  subject: string;
  receiver: string;
}

export const Receipt = ({ type, refNum, subject, receiver }: Props) => {
  const today = format(new Date(), 'MMM dd yyyy');

  return (
    <div className='w-full h-[780px] flex flex-col justify-between py-3 px-8 text-sm'>
      {/* Header */}
      <header className='flex justify-between border-b border-cyan-700 pb-2'>
        <img
          className='h-16'
          src='/secretary-receipt/شعار النسر الجمهوري.png'
          alt='شعار الجمهورية'
        />
        <div className='flex flex-col items-end text-right'>
          <img
            className='w-28'
            src='/secretary-receipt/مخطوطة الجمهورية اليمنية.png'
            alt='مخطوطة الجمهورية'
          />
          <p>وزارة الصناعة والتجارة</p>
          <p>إدارة السكرتارية والتوثيق</p>
        </div>
      </header>

      {/* Main */}
      <main className='-mt-32'>
        <div className='flex flex-col items-end space-y-1 mt-5'>
          <InfoRow label='التاريخ' value={today} />
          <InfoRow
            label='رقم المرجع'
            value={formattedRefNum({ type, refNum }) as string}
          />
        </div>

        <div className='mt-10 space-y-8 text-right'>
          <h1 className='text-center text-white font-black py-1 bg-blue-500'>
            سند استلام
          </h1>

          <InfoRow label='المرسل إليه' value={receiver} />
          <InfoRow label='الموضوع' value={subject} />

          <div className='space-y-3 font-bold'>
            {[
              'اسم المستلم',
              'المسمى الوظيفي',
              'رقم الهاتف',
              'الإيميل',
              'التاريخ',
            ].map(label => (
              <p key={label}>: {label}</p>
            ))}
            <p className='text-left mt-7 ml-20'>التوقيع</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='flex justify-between items-center pt-1 text-[10px] border-t border-cyan-700 space-x-1 space-x-reverse'>
        <FooterItem icon='click.png' text='www.moit-ye.com' />
        <FooterItem icon='mail.png' text='info@moit-ye.com' />
        <FooterItem icon='rotary-dial-telephone.png' text='02-245089' />
        <div className='flex items-center gap-1'>
          <img src='/secretary-receipt/line.png' alt='' className='size-4' />
          <span>عدن - التواهي - جولة الشيخ إسحاق</span>
          <img
            src='/secretary-receipt/location.png'
            alt='الموقع'
            className='size-3 ml-1'
          />
        </div>
      </footer>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className='flex flex-row-reverse gap-2'>
    <span className='font-bold'>: {label}</span>
    <span>{value}</span>
  </div>
);

const FooterItem = ({ icon, text }: { icon: string; text: string }) => (
  <div className='flex items-center gap-1'>
    <img src={`/secretary-receipt/${icon}`} alt='' className='size-4' />
    <span>{text}</span>
  </div>
);

export default Receipt;
