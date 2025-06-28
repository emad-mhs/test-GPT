import { FormSection } from '../sections/form-section';

interface PageProps {
  userId: string;
}

export const UserSettingsView = ({ userId }: PageProps) => {
  return (
    <div className='px-4 pt-2.5 lg:w-2/5'>
      <FormSection userId={userId} />
    </div>
  );
};
