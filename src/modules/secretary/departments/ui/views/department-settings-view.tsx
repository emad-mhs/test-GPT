import { FormSection } from '../sections/form-section';

interface PageProps {
  departmentId: string;
}

export const DepartmentSettingsView = ({ departmentId }: PageProps) => {
  return (
    <div className='px-4 pt-2.5 lg:w-2/5'>
      <FormSection departmentId={departmentId} />
    </div>
  );
};
