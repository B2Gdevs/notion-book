import { Menu, toast, useGetItemsByMenu, useUpdateItem } from "ui";
import { StateDialog } from "./state-dialog";

interface MenuItemStateDialogProps {
  menu: Menu;
  isOpen: boolean;
  onClose: () => void;
}

export const MenuItemStateDialog: React.FC<MenuItemStateDialogProps> = ({ menu, isOpen, onClose }) => {
  const { data: items } = useGetItemsByMenu(menu?.id ?? '');
  const updateItemMutation = useUpdateItem({
    onSuccess: () => {
      toast({
        title: 'Item Updated',
        description: 'Item has been updated successfully.',
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Error updating item: ${error instanceof Error ? error.message : 'An error occurred'}`,
        duration: 5000,
        variant: 'destructive',
      });
    },
  });

  return (
    <StateDialog
      title="Items"
      data={items ?? []}
      isOpen={isOpen}
      onClose={onClose}
      onToggle={(item, isActive) =>
        updateItemMutation.mutateAsync({
          itemId: item?.id ?? '',
          itemData: { 
            ...item,
            is_active: !isActive },
        }).then(() => {})
      }
      renderItem={item => <span className="font-righteous">{item.name}</span>}
    />
  );
};