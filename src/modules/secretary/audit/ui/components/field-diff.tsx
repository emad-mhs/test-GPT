import { AuditLog } from '../../types';
import DiffViewer from 'react-diff-viewer';

export function ChangeDiffViewer({ log }: { log: AuditLog }) {
  const entries = Object.entries(log.changes);

  return (
    <div className='space-y-6'>
      {entries.map(([field, { before, after }], idx) => (
        <div key={idx} className='mb-6'>
          <h3 className='font-semibold mb-2'>{field}</h3>
          <DiffViewer
            oldValue={JSON.stringify(before) ?? ''}
            newValue={JSON.stringify(after) ?? ''}
            splitView={true}
            hideLineNumbers={true}
            // styles={{ .../* تتبع ألوان الـShadCN */ }}
          />
        </div>
      ))}
    </div>
  );
}
