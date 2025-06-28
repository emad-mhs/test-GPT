import { ProfileSection } from '../sections/profile-section';

interface PageProps {
  userId: string;
}

export const ProfileView = ({ userId }: PageProps) => {
  return (
    <div className='px-4 pt-2.5 lg:w-2/5'>
      <ProfileSection userId={userId} />
    </div>
  );
};
