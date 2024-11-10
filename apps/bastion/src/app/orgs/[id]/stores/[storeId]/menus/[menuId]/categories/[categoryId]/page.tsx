'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button, Category, Collapsible, ConfirmationDialog, Item, toast, useCreateCategory, useDeleteCategory, useGetAllItemsByMenu, useGetCategoryById, useUpdateCategory } from 'ui';
import CategoryInput from '../../../../../../../../components/category-input';
import MenuItemSelect from '../../../../../../../../components/menu-item-select';

const CategoryDetail: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const menuId = params.menuId as string;
  const categoryId = params.categoryId as string;

  const [localItems, setLocalItems] = useState<Item[]>([]);
  const [localCategory, setLocalCategory] = useState<Category>({
    menu_id: menuId,
    name: '',
    description: '',
    item_ids: [],
    is_active: true,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: items } = useGetAllItemsByMenu(menuId);
  const { data: category } = useGetCategoryById(categoryId);
  const updateCategoryMutation = useUpdateCategory({
    onSuccess: () => {
      toast({
        title: 'Category updated',
        description: `Category has been updated.`,
        duration: 5000,
      });
    }
  });
  const createCategoryMutation = useCreateCategory({
    onSuccess: () => {
      toast({
        title: 'Category created',
        description: `Category has been created.`,
        duration: 5000,
      });
    }
  });
  const deleteCategoryMutation = useDeleteCategory({
    onSuccess: () => {
      toast({
        title: 'Category deleted',
        description: 'Category has been deleted.',
        duration: 5000,
      });
      router.push(`/orgs/${menuId}/menus/${menuId}/categories`);
    }
  });

  useEffect(() => {
    if (category) {
      setLocalCategory(category);
      const associatedItems = (category.item_ids || []).map(id => items?.find(i => i.id === id)).filter(Boolean) as Item[];
      setLocalItems(associatedItems);
    }
  }, [category, items]);

  const handleSaveCategory = () => {
    if (localCategory.id) {
      updateCategoryMutation.mutate({ categoryId: localCategory.id, categoryData: localCategory });
    } else {
      createCategoryMutation.mutate({ menuId, category: localCategory });
    }
  };

  const handleAddItem = (item: Item) => {
    if (item.id && !localCategory.item_ids?.includes(item.id)) {
      const updatedItemIds = [...(localCategory.item_ids || []), item.id];
      setLocalCategory({ ...localCategory, item_ids: updatedItemIds });
      const updatedLocalItems = updatedItemIds.map(id => items?.find(i => i.id === id)).filter(Boolean) as Item[];
      setLocalItems(updatedLocalItems);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItemIds = localCategory.item_ids?.filter(id => id !== itemId);
    setLocalCategory({ ...localCategory, item_ids: updatedItemIds });
    const updatedLocalItems = (updatedItemIds || []).map(id => items?.find(item => item.id === id)).filter(Boolean) as Item[];
    setLocalItems(updatedLocalItems);
  };

  return (
    <div className="m-8 flex-col justify-center items-center text-center">
      <Collapsible stepHeaderProps={{ text: 'Add Items to Category' }}>
        <div className="mt-5">
          <MenuItemSelect menuId={menuId} onSelect={handleAddItem} />
          {localItems.map(item => (
            <div key={item?.id} className="mt-2 flex justify-between items-center">
              {item?.name}
              <Button className='bg-secondary-pink-salmon' key={item.id} onClick={() => handleDeleteItem(item?.id ?? '')}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Collapsible>

      <Collapsible stepHeaderProps={{ text: 'Category Details' }}>
        <div className="mt-5">
          <CategoryInput onChange={setLocalCategory} menuId={menuId} category={localCategory} />
        </div>
      </Collapsible>

      <Button className="mt-5 w-1/2" onClick={handleSaveCategory}>
        Save
      </Button>

      {categoryId && (
        <Button className="mt-5 w-1/2 bg-secondary-pink-salmon" onClick={() => {
          setIsDialogOpen(true);
        }}>
          Delete Category
        </Button>
      )}

      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={() => {
          deleteCategoryMutation.mutate(categoryId);
        }}
        message='Are you sure you want to delete this category?'
      />
    </div>
  );
};

export default CategoryDetail;