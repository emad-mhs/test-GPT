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
const DocumentAuditTrailSectionSkeleton = dynamic(
  () =>
    import('../sections/document-audit-trail-section/skeleton').then(
      m => m.DocumentAuditTrailSectionSkeleton
    ),
  { ssr: false }
);

// Lazy-loaded AuditSection
const FormSection = dynamic(
  () => import('../sections/form-section').then(m => m.FormSection),
  { ssr: false, loading: () => <FormSectionSkeleton /> }
);
const DocumentAuditTrailSection = dynamic(
  () =>
    import('../sections/document-audit-trail-section').then(
      m => m.DocumentAuditTrailSection
    ),
  { ssr: false, loading: () => <DocumentAuditTrailSectionSkeleton /> }
);

interface PageProps {
  documentId: string;
}

export const DocumentView = ({ documentId }: PageProps) => {
  return (
    <div>
      <FormSection documentId={documentId} />
      <DocumentAuditTrailSection documentId={documentId} />
    </div>
  );
};
