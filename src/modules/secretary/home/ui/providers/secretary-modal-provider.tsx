'use client';

import { useMountedState } from 'react-use';

import { CreateCategoryModal } from '@/modules/secretary/categories/ui/components/create-category-modal';
import { CreateContactModal } from '@/modules/secretary/contacts/ui/components/create-contact-modal';
import { CreateDepartmentModal } from '@/modules/secretary/departments/ui/components/create-department-modal';
import { CreateDocumentModal } from '@/modules/secretary/documents/ui/components/create-document-modal';
import { CreateUserModal } from '@/modules/secretary/users/ui/components/create-user-modal';
import { CreateMailModal } from '@/modules/secretary/mails/ui/components/create-mail-modal';

export const ModalProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <CreateContactModal />

      <CreateDepartmentModal />

      <CreateCategoryModal />

      <CreateMailModal />

      <CreateDocumentModal />

      <CreateUserModal />
    </>
  );
};
