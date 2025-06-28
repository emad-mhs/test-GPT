// import { useQueryState, parseAsBoolean } from 'nuqs';

// export const useCreateDepartmentModal = () => {
//   const [isOpen, setIsOpen] = useQueryState(
//     'create-department',
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
 * Hook to manage the Create Department modal visibility
 * using the URL query parameter (?create-department=true)
 */
export const useCreateDepartmentModal = () => {
  const [isModalOpen, setModalOpen] = useQueryState(
    'create-department',
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
