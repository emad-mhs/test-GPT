import { useQueryState, parseAsBoolean } from 'nuqs';

/**
 * Manages the visibility state of the "Create Category" modal
 * using a query parameter (?create-category=true).
 */
export const useCreateCategoryModal = () => {
  const [isModalOpen, setModalOpen] = useQueryState(
    'create-category',
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
