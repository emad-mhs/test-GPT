import { FormSection } from '../sections/form-section';

interface PageProps {
  contactId: string;
}

export const ContactSettingsView = ({ contactId }: PageProps) => {
  return (
    <div className='px-4 pt-2.5 lg:w-2/5'>
      <FormSection contactId={contactId} />
    </div>
  );
};
