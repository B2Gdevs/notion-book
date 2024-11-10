import { Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { Button, ConfirmationDialog, Menu, TitleComponent, toast, useDeleteMenu, useUpdateMenu } from 'ui';
import HoursDisplay from '../../../../../components/hours-display';
import { StatesSection } from './states-section';

interface MenuProps {
  menu: Menu;
  orgId: string;
}

const MenuComponent: FC<MenuProps> = ({ menu, orgId }) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const params = useParams();
  const storeId = params.storeId as string;
  const updateMenuMutation = useUpdateMenu({
    onSuccess: () => {
      toast({
        title: 'Item Updated',
        description: 'The item has been updated successfully.',
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Error Occurred',
        duration: 5000,
      });
    },
  });
  const deleteMenuMutation = useDeleteMenu({
    onSuccess: () => {
      toast({
        title: 'Item Deleted',
        description: 'The item has been deleted successfully.',
        duration: 5000,
      });
      setTimeout(() => {
        router.push(`/orgs/${orgId}/stores/${storeId}/menus`);
      }, 500);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: `Error deleting menu`,
        duration: 5000,
      });
    },
  });

  const handleDeleteMenu = async () => {
    deleteMenuMutation.mutate(menu?.id ?? '');
    setIsDeleteDialogOpen(false);
  };

  const menuItems = [
    { name: 'edit', label: 'Edit Menu' },
    { name: 'toggleActive', label: menu.is_active ? 'Deactivate' : 'Activate' }
  ];

  const toggleActiveStatus = () => {
    updateMenuMutation.mutate({
      menuId: menu?.id ?? '',
      menu: {
        ...menu,
        is_active: !menu.is_active,
      },
    });
  };

  const handleMenuClick = (buttonName: string) => {
    switch (buttonName) {
      case 'edit':
        if (menu.id) {
          router.push(`/orgs/${orgId}/stores/${storeId}/menus/${menu.id}/categories`);
        }
        break;
      case 'toggleActive':
        toggleActiveStatus();
        break;
      default:
        console.error('Unknown action');
    }
  };

  return (
    <TitleComponent onMenuItemClick={handleMenuClick}
      menuItems={menuItems}
      leftTitle='Menu'
      centerTitle={menu?.name}
      rightTitle={`${menu?.id} / Otter ID: ${menu?.otter_id ?? "Not Connected to Otter"}`}
      leftTitleClassName='text-md'
      className="mt-8 p-4 border rounded-md relative">

      <div className='flex space-x-2 justify-between mt-2'>
        <StatesSection menu={menu} />

        <Button
          className="bg-secondary-pink-salmon inline-flex items-center mt-4"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 size={16} className="mr-2" />
          Delete
        </Button>
      </div>
      <HoursDisplay hoursConfig={menu.hours} />

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteMenu}
        message='Are you sure you want to delete this menu?'
      />

    </TitleComponent>
  );
};

export default MenuComponent;