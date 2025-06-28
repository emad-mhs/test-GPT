// import { useQueryState, parseAsBoolean } from 'nuqs';

// export const useCreateDocumentModal = () => {
//   const [isOpen, setIsOpen] = useQueryState(
//     'create-document',
//     parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
//   );

//   const open = () => setIsOpen(true);
//   const close = () => setIsOpen(false);

//   return {
//     isOpen,
//     open,
//     close,
//     setIsOpen,
//   };
// };

import { useQueryState, parseAsBoolean } from 'nuqs';

/**
 * Hook to control the visibility of the Create Contact modal
 * using the URL query parameter (?create-document=true).
 */
export const useCreateDocumentModal = () => {
  const [isModalOpen, setModalOpen] = useQueryState(
    'create-document',
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
