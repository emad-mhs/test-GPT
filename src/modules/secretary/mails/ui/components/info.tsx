interface InfoProps {
  icon: React.ReactNode;
  title: string;
  description: string | null | undefined;
}

export const Info: React.FC<InfoProps> = ({ icon, title, description }) => {
  return (
    <div className='flex flex-col gap-1 md:flex-row md:items-center lg:gap-3'>
      <div className='flex gap-2 items-center lg:gap-3 '>
        {icon}
        <h2 className='md:min-w-[60px] lg:min-w-[100px] font-bold tracking-tight text-sm lg:text-lg'>
          {title}:
        </h2>
      </div>
      <p className='mr-5 md:mr-0 text-sm lg:text-lg text-muted-foreground'>
        {description}
      </p>
    </div>
  );
};
