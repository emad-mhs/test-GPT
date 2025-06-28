export enum ContactTypes {
  EXTERNAL = 'external',
  INTERNAL = 'internal',
}

// Label Mappings
export const Contact_TYPES: { label: string; value: ContactTypes }[] = [
  { label: 'خارجية', value: ContactTypes.EXTERNAL },
  { label: 'داخلية', value: ContactTypes.INTERNAL },
];

export interface Contact {
  id: string;
  jobTitle: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}
