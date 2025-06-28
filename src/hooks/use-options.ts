import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

// ——— Preload all your queries & derive option arrays ———
export function useContactsOptions() {
  const trpc = useTRPC();
  const { data: contacts } = useSuspenseQuery(
    trpc.contacts.getAll.queryOptions()
  );
  return contacts.map(c => ({ value: c.id, label: c.jobTitle }));
}

export function useCategoriesOptions() {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getAll.queryOptions()
  );
  return categories.map(c => ({ value: c.id, label: c.name }));
}

export function useDepartmentsOptions() {
  const trpc = useTRPC();

  const { data: departments } = useSuspenseQuery(
    trpc.departments.getAll.queryOptions()
  );
  return departments.map(d => ({ value: d.id, label: d.name }));
}

export function useUsersOptions() {
  const trpc = useTRPC();

  const { data: users } = useSuspenseQuery(trpc.users.getAll.queryOptions());
  return users.map(u => ({ value: u.id, label: u.name }));
}

// export const useOptions = () => {
//   const trpc = useTRPC();

//   // const [{ session }] = trpc.users.getSession.useSuspenseQuery();
//   const {
//     data: { session },
//   } = useSuspenseQuery(trpc.users.getSession.queryOptions());

//   // const [{ data: contacts }] = trpc.contacts.getAll.useSuspenseQuery();
//   const {
//     data: { data: contacts },
//   } = useSuspenseQuery(trpc.contacts.getAll.queryOptions());

//   // const [{ data: categories }] = trpc.categories.getAll.useSuspenseQuery();
//   const {
//     data: { data: categories },
//   } = useSuspenseQuery(trpc.categories.getAll.queryOptions());

//   // const [{ data: departments }] = trpc.departments.getAll.useSuspenseQuery();
//   const {
//     data: { data: departments },
//   } = useSuspenseQuery(trpc.departments.getAll.queryOptions());

//   const contactOpts = contacts.map(c => ({ value: c.id, label: c.jobTitle }));
//   const categoryOpts = categories.map(c => ({ value: c.id, label: c.name }));
//   const departmentOpts = departments.map(d => ({ value: d.id, label: d.name }));

//   return {
//     user: session.user,
//     contactOpts,
//     categoryOpts,
//     departmentOpts,
//   };
// };
