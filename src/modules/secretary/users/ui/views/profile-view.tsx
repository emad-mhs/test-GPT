'use client';

import dynamic from 'next/dynamic';

// Skeletons
const ProfileSectionSkeleton = dynamic(
  () =>
    import('../sections/profile-section/skeleton').then(
      m => m.ProfileSectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const ProfileSection = dynamic(
  () => import('../sections/profile-section').then(m => m.ProfileSection),
  { ssr: false, loading: () => <ProfileSectionSkeleton /> }
);
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
