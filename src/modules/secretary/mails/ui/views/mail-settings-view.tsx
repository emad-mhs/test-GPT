'use client';

import dynamic from 'next/dynamic';

// Skeletons
const SettingsFormSectionSkeleton = dynamic(
  () =>
    import('../sections/settings-form-section/skeleton').then(
      m => m.SettingsFormSectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const SettingsFormSection = dynamic(
  () =>
    import('../sections/settings-form-section').then(
      m => m.SettingsFormSection
    ),
  { ssr: false, loading: () => <SettingsFormSectionSkeleton /> }
);

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
