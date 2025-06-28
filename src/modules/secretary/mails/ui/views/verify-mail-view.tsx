import { VerifyMailSection } from '../sections/verify-mail-section';

interface PageProps {
  mailId: string;
}

export const VerifyMailView = ({ mailId }: PageProps) => {
  return (
    <div className='px-4 pt-2.5'>
      <VerifyMailSection mailId={mailId} />
    </div>
  );
};
