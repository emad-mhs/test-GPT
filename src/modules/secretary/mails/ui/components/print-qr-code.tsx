import { format } from 'date-fns';
import { MailTypes } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { formattedRefNum } from '../../utils';

interface Props {
  id: string;
  type: MailTypes;
  refNum: string | null;
  attachments: string | null;
}

export const PrintQrCode = ({ id, type, refNum, attachments }: Props) => {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/secretary/verify-mail/${id}`;

  return (
    <div className='flex items-start justify-between'>
      <div className='size-16 mt-[90px] ml-[80px]'>
        <QRCodeSVG value={url} size={65} level='M' />
      </div>
      <div className='flex flex-col -space-y-1 items-center text-sm mt-[103px] mr-[90px] '>
        <span>{formattedRefNum({ type, refNum }) ?? '-'}</span>
        <span>{format(new Date(), 'dd/MM/yyyy')}</span>
        <span>{attachments ?? '-'}</span>
      </div>
    </div>
  );
};
