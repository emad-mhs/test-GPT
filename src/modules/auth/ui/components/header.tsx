interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className='w-full flex flex-col space-y-6 items-center justify-center'>
      <h1 className='text-3xl font-semibold  '>🔐 المصادقة</h1>
      <p className='text-muted-foreground text-sm'>{label}</p>
    </div>
  );
};
