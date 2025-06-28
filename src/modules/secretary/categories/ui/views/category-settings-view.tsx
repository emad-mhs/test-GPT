import { FormSection } from '../sections/form-section';

interface PageProps {
  categoryId: string;
}

export const CategorySettingsView = ({ categoryId }: PageProps) => {
  return (
    <div className='px-4 pt-2.5 lg:w-2/5'>
      <FormSection categoryId={categoryId} />
    </div>
  );
};
