'use client';

import dynamic from 'next/dynamic';

// Skeletons
const FormSectionSkeleton = dynamic(
  () =>
    import('../sections/form-section/skeleton').then(
      m => m.FormSectionSkeleton
    ),
  { ssr: false }
);
const MailAuditTrailSectionSkeleton = dynamic(
  () =>
    import('../sections/mail-audit-trail-section/skeleton').then(
      m => m.MailAuditTrailSectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const FormSection = dynamic(
  () => import('../sections/form-section').then(m => m.FormSection),
  { ssr: false, loading: () => <FormSectionSkeleton /> }
);

interface PageProps {
  mailId: string;
}
const MailAuditTrailSection = dynamic(
  () =>
    import('../sections/mail-audit-trail-section').then(
      m => m.MailAuditTrailSection
    ),
  { ssr: false, loading: () => <MailAuditTrailSectionSkeleton /> }
);

interface PageProps {
  mailId: string;
}

export const MailView = ({ mailId }: PageProps) => {
  return (
    <div>
      <FormSection mailId={mailId} />
      <MailAuditTrailSection mailId={mailId} />
    </div>
  );
};
