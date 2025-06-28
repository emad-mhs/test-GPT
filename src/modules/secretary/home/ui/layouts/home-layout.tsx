// import { PropsWithChildren } from 'react';
// import { Metadata } from 'next';
// import { Sidebar } from '../components/sidebar';
// import { Header } from '../components/header';
// import { ModalProvider } from '../providers/secretary-modal-provider';

// export const metadata: Metadata = {
//   title: {
//     template: '%s | NextAdmin - Next.js Dashboard Kit',
//     default: 'NextAdmin - Next.js Dashboard Kit',
//   },
//   description:
//     'Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.',
// };

// export const HomeLayout = ({ children }: PropsWithChildren) => {
//   return (
//     <div className='flex min-h-screen'>
//       <Sidebar />

//       <div className='w-full'>
//         <Header />

//         <main className='isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10'>
//           <ModalProvider />
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

import { PropsWithChildren } from 'react';
import { Metadata } from 'next';
import { Sidebar } from '../components/sidebar';
import { Header } from '../components/header';
import { ModalProvider } from '../providers/secretary-modal-provider';

export const metadata: Metadata = {
  title: {
    template: '%s | NextAdmin - Next.js Dashboard Kit',
    default: 'NextAdmin - Next.js Dashboard Kit',
  },
  description:
    'Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.',
};

export const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />

      <div className='flex flex-col w-full'>
        <Header />

        {/* Put ModalProvider outside of main for broader context access */}
        <ModalProvider />

        <main className='isolate mx-auto w-full max-w-screen-2xl overflow-hidden px-4 md:px-6 2xl:px-10'>
          {/* <main className='isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10'> */}
          {children}
        </main>
      </div>
    </div>
  );
};
