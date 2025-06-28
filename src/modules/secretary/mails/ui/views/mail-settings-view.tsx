import { SettingsFormSection } from '../sections/settings-form-section';

interface PageProps {
  mailId: string;
}

export const MailSettingsView = ({ mailId }: PageProps) => {
  return (
    <div className='px-4 pt-2.5 lg:w-2/5 '>
      <SettingsFormSection mailId={mailId} />
    </div>
  );
};
