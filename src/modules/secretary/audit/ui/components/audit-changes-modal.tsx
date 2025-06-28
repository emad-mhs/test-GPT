'use client';

import { AuditLog } from '../../types';
import { ChangeDiffViewer } from './field-diff';
import { ResponsiveModal } from '@/components/responsive-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface AuditChangesProp {
  log: AuditLog;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

export function AuditChangesModal({
  log,
  open,
  onOpenChangeAction,
}: AuditChangesProp) {
  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChangeAction}>
      <Card className='w-full h-full border-none'>
        <CardHeader>
          <CardTitle className='text-xl font-bold'>سجل التعديلات</CardTitle>
          <CardDescription>التغييرات على السجل #{log.recordId}</CardDescription>
        </CardHeader>

        <div className='px-6'>
          <Separator />
        </div>

        <CardContent>
          <ChangeDiffViewer log={log} />
        </CardContent>
      </Card>
    </ResponsiveModal>
  );
}
