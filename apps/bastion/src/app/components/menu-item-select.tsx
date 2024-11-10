import { useSession } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import {
  Item,
  JWT_TEMPLATE,
  MenuClient,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from 'ui';

interface MenuItemSelectProps {
  menuId: string;
  onSelect?: (selectedItem: Item) => void;
}

const MenuItemSelect: React.FC<MenuItemSelectProps> = ({
  menuId,
  onSelect,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const session = useSession()?.session;

  useEffect(() => {
    async function fetchItems() {
      const token = await session?.getToken({ template: JWT_TEMPLATE });
      const fetchedItems = await MenuClient.getAllItemsByMenu(menuId, token ?? '');
      setItems(fetchedItems);
    }

    fetchItems();
  }, [menuId]);

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    if (onSelect) {
      onSelect(item);
    }
  };

  return (
    <Select
      value={selectedItem?.id || ''}
      onValueChange={(value: any) => {
        const item = items?.find((item) => item.id === value);
        if (item) {
          handleSelectItem(item);
        }
      }}
    >
      <SelectTrigger>{selectedItem?.name || 'Select an item'}</SelectTrigger>
      <SelectContent>
        {items
          ?.sort((a, b) => a.name.localeCompare(b.name)) // Sort items by name
          .map((item) => (
            <SelectItem key={item.id} value={item?.id ?? ''}>
              {item.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default MenuItemSelect;
