import { useQueryState, parseAsBoolean } from 'nuqs';

/**
 * Hook to control the visibility of the Create Contact modal
 * using the URL query parameter (?create-contact=true).
 */
export const useCreateUserModal = () => {
  const [isModalOpen, setModalOpen] = useQueryState(
    'create-user',
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return {
    isOpen: isModalOpen,
    open: openModal,
    close: closeModal,
    setIsOpen: setModalOpen,
  };
};
