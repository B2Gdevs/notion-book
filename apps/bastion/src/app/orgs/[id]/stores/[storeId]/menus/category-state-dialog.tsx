import { Category, Menu, useGetCategoriesByIds, useUpdateCategory } from "ui";
import { StateDialog } from "./state-dialog";

interface CategoryStateDialogProps {
  menu: Menu;
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryStateDialog: React.FC<CategoryStateDialogProps> = ({ menu, isOpen, onClose }) => {
  const { data: categories } = useGetCategoriesByIds(menu?.category_ids ?? []);
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

  const renderItem = (category: Category) => <span className="font-righteous">{category.name}</span>

  return (
    <StateDialog
      title="Categories"
      data={categories as Category[] ?? []}
      isOpen={isOpen}
      onClose={onClose}
      onToggle={handleToggle}
      renderItem={renderItem}
    />
  );
};