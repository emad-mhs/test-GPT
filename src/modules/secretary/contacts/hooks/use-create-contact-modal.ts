// import { useQueryState, parseAsBoolean } from 'nuqs';

// export const useCreateContactModal = () => {
//   const [isOpen, setIsOpen] = useQueryState(
//     'create-contact',
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
 * using the URL query parameter (?create-contact=true).
 */
export const useCreateContactModal = () => {
  const [isModalOpen, setModalOpen] = useQueryState(
    'create-contact',
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
