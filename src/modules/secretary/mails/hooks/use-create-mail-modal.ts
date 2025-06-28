import { useQueryState, parseAsBoolean } from 'nuqs';

/**
 * Hook to control the visibility of the Create Mail modal
 * using the URL query parameter (?create-mail=true).
 */
export const useCreateMailModal = () => {
  const [isModalOpen, setModalOpen] = useQueryState(
    'create-mail',
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
