import { ListIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Category, TitleComponent, useUpdateCategory } from 'ui';

interface CategoryCardProps {
  category: Category;
}


const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const router = useRouter();
  const menuItems = [
    { name: 'see_category', label: 'See Category' },
    { name: 'toggleActive', label: category.is_active ? 'Deactivate' : 'Activate' }
  ]
  const updateCategoryMutation = useUpdateCategory();

  const handleToggle = (category: Category, isActive: boolean): Promise<void> => {
    return updateCategoryMutation.mutateAsync({
      categoryId: category?.id ?? '',
      categoryData: {
        ...category,
        is_active: !isActive
      },
    }).then(() => { });
  }

  const handleMenuClick = (buttonName: string) => {
    switch (buttonName) {
      case 'see_category':
        if (category?.id) {
          router.push(`/menus/${category.menu_id}/categories/${category.id}`)
        }
        break;
      case 'toggleActive':
        handleToggle(category, category?.is_active ?? false);
        break;
      default:
        console.error('Unknown action');
    }
  };

  return (
    <TitleComponent
      leftTitle="Category"
      centerTitle={category.name}
      rightTitle={category.id}
      className="m-4 p-6 text-white rounded-xl shadow-md transform transition"
      onMenuItemClick={handleMenuClick}
      menuItems={menuItems}
    >

      <div className="flex items-center space-x-2">
        <ListIcon className="h-5 w-5 text-white" />
        <span className="text-white">{category.item_ids.length} Items</span>
        <div>
          <p className="text-sm text-white">{category?.is_active ?
            <span className="text-green-400">Active</span> :
            <span className="text-red-400">Inactive</span>}
          </p>
        </div>
      </div>

    </TitleComponent>
  );
};

export default CategoryCard;
