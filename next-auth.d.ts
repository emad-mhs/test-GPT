import { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  role?: string;
  isTwoFactorEnabled?: boolean;
  isOAuth?: boolean;
  departmentId?: string;
  imageUrl?: string;
  isActive?: boolean;
  canAdd?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  lastLoginAt?: Date;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
// import { type DefaultSession } from 'next-auth';

// export type ExtendedUser = DefaultSession['user'] & {
//   role?: string;
//   isTwoFactorEnabled?: boolean;
//   isOAuth?: boolean;
//   departmentId?: number;
//   imageUrl?: string;
//   canAdd?: boolean;
//   canUpdate?: boolean;
//   canDelete?: boolean;
// };

// declare module 'next-auth' {
//   interface Session {
//     user: ExtendedUser;
//   }
// }

// import { UserRole } from '@/features/auth/types';
// import { type DefaultSession } from 'next-auth';

// import { JWT } from 'next-auth/jwt';

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string;
//     role?: UserRole;
//   }
// }

// declare module 'next-auth' {
//   /**
//    * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       id: string;
//       role?: UserRole;
//       /**
//        * By default, TypeScript merges new interface properties and overwrites existing ones.
//        * In this case, the default session user properties will be overwritten,
//        * with the new ones defined above. To keep the default session user properties,
//        * you need to add them back into the newly declared interface.
//        */
//     } & DefaultSession['user'];
//   }
// }
