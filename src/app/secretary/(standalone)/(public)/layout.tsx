'use client';

import { Logo } from '@/components/logo';

interface Props {
  children: React.ReactNode;
}

const PublicLayout = ({ children }: Props) => {
  return (
    <>
      <header className='bg-linear-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36'>
        <div className='max-w-(--breakpoint-2xl) mx-auto'>
          <div className='w-full flex items-center justify-between mb-4'>
            <div className='flex items-center lg:gap-x-16'>
              <div className='items-center flex flex-row space-x-4'>
                {/* <Image src={logo} alt='Logo' height={56} width={152} /> */}
                <div className='w-2/3'>
                  <Logo />
                </div>
                {/* <p className='font-semibold text-white text-base md:text-xl lg:text-2xl ml-2.5'>
                  إدارة السكرتارية والتوثيق
                </p> */}
              </div>
            </div>
          </div>
          <div className='space-y-2 mb-2'>
            <h2 className='text-lg md:text-xl lg:text-3xl text-white font-medium'>
              مرحبًا بك عزيزي المواطن عزيزتي المواطنة
            </h2>
            <p className='text-xs md:text-sm lg:text-base text-[#89b6fd]'>
              منصة وزارة الصناعة والتجارة للتحقق من مصداقية المذكرات الرسمية
            </p>
          </div>
        </div>
      </header>
      <main className='px-3 lg:px-14'>{children}</main>
    </>
  );
};

export default PublicLayout;
