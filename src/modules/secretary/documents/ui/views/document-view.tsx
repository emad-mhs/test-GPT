import { DocumentAuditTrailSection } from '../sections/document-audit-trail-section';
import { FormSection } from '../sections/form-section';

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
