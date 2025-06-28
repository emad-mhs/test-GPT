import { FormSection } from '../sections/form-section';
import { MailAuditTrailSection } from '../sections/mail-audit-trail-section';

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
