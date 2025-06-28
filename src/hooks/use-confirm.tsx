import { JSX, useState, useCallback } from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/responsive-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps['variant'] = 'primary'
): [() => JSX.Element, () => Promise<boolean>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback(() => {
    return new Promise<boolean>(resolve => {
      setPromise({ resolve });
    });
  }, []);

  const handleClose = useCallback(() => {
    setPromise(null);
  }, []);

  const handleConfirm = useCallback(() => {
    promise?.resolve(true);
    handleClose();
  }, [promise, handleClose]);

  const handleCancel = useCallback(() => {
    promise?.resolve(false);
    handleClose();
  }, [promise, handleClose]);

  const ConfirmationDialog = () => (
    <ResponsiveModal open={!!promise} onOpenChange={handleClose}>
      <Card className='w-full h-full bg-popover border-none shadow-none'>
        <CardContent>
          <CardHeader className='p-0'>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div
            dir='rtl'
            className='pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end'
          >
            <Button
              onClick={handleCancel}
              variant='outline'
              className='w-full lg:w-auto'
            >
              إلغاء
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant}
              className='w-full lg:w-auto'
            >
              تأكيد
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmationDialog, confirm];
};
