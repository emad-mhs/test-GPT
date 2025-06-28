import Image from 'next/image';

export function Logo() {
  const logo = '/secretary-logos/light.png';
  const darkLogo = '/secretary-logos/dark.png';

  return (
    <div className='logo-container space-y-4 flex justify-center items-center p-4 md:block'>
      <div className='relative w-[200px] h-[50px]'>
        <Image
          src={logo}
          alt='Secretary logo'
          className='dark:hidden object-contain'
          fill
          priority
          sizes='(max-width: 768px) 120px, 150px'
        />
        <Image
          src={darkLogo}
          alt='Secretary logo'
          className='hidden dark:block object-contain'
          fill
          priority
          sizes='(max-width: 768px) 120px, 150px'
        />
      </div>
    </div>
  );
}
