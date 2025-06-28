import { paths } from '@/lib/paths';
import { CategorySection } from '../sections/category-section';
import { BreadCrumb } from '@/components/breadcrumb';

const breadcrumbItems = [{ title: 'المجلدات', link: paths.categoriesPage() }];

interface PageProps {
  categoryId: string;
  search: string | undefined;
}

export const CategoryView = ({ categoryId, search }: PageProps) => {
  return (
    <div className='flex-1 space-y-4 p-4 pt-6'>
      <div className='flex flex-row items-center justify-between'>
        <BreadCrumb items={breadcrumbItems} />
        {/* <Button size='sm' variant='muted' onClick={() => router.back()}>
            <ArrowRightIcon className='size-4 ml-2' />
            العودة للخلف
          </Button> */}
      </div>

      <CategorySection categoryId={categoryId} search={search} />
    </div>
  );
};
