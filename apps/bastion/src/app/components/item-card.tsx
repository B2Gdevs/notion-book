'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import TimezoneSelect, { ITimezone } from 'react-timezone-select';
import { Category, DatePicker, Item, ItemClassification, ItemClassificationSelect, Menu, MenuItemCard, ModifierGroup, Photo, Store, TitleComponent, toast, useUpdateItem } from 'ui';
import HoursDisplay from './hours-display';

interface ItemCardProps {
  item: Item;
  idx: number;
  photos: Record<string, Photo>;
  menus: Record<string, Menu>;
  modifierGroups: Record<string, ModifierGroup>;
  categories: Record<string, Category>;
  store?: Store,
  previewMode?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  photos,
  menus,
  store,
  previewMode = false,
}) => {
  const router = useRouter();
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>({
    value: 'America/Chicago',
    label: 'America/Chicago',
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const [menuAvailable, setMenuAvailable] = useState<boolean>(false);

  const { mutate: updateItem } = useUpdateItem({
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

  const menu = menus[item.menu_id ?? ''];

  useEffect(() => {
    // const timezoneValue = isITimezoneOption(selectedTimezone) ? selectedTimezone.value : '';
    // const available = isMenuAvailableAtThisTime(selectedDate, menu, undefined, timezoneValue);
    // setMenuAvailable(available);
  }, [selectedDate, selectedTimezone, menus, item]);

  const handleItemClassificationChange = (selectedClassification: ItemClassification) => {
    const currentIds = new Set(item.item_classifications_ids);
    const selectedId = selectedClassification?.id ?? '';
  
    if (currentIds.has(selectedId)) {
      currentIds.delete(selectedId);
    } else {
      currentIds.add(selectedId);
    }
  
    const updatedItem = {
      ...item,
      item_classifications_ids: Array.from(currentIds)
    };
  
    updateItem({ itemId: item?.id ?? '', itemData: updatedItem });
  };

  // const isITimezoneOption = (timezone: ITimezone): timezone is { value: string; label: string } => {
  //   return typeof timezone === 'object' && 'value' in timezone;
  // };

  const menuItems = [
    { name: 'edit_item', label: 'Edit Item' },
  ];

  const orgId = store?.org_id ?? '';
  const storeId = store?.id ?? '';

  const handleMenuClick = (buttonName: string) => {
    switch (buttonName) {
      case 'edit_item':
        router.push(`/orgs/${orgId}/stores/${storeId}/menus/${item.menu_id}/items/${item.id}`);
        break;
      case 'delete_item':
        console.log(`Delete item ${item.id}`);
        break;
      default:
        console.error('Unknown action');
    }
  };

  const photo = photos[item?.photo_ids[0] ?? ''];

  return (
    <TitleComponent
      leftTitle={item?.sale_status}
      rightTitle={item?.id ?? ''}
      className="flex-col m-4 p-6 bg-white rounded-xl shadow-lg grid grid-cols-1 gap-4"
      onMenuItemClick={handleMenuClick}
      menuItems={menuItems}
    >
      <div className='flex flex-col'>
        <div className='flex justify-between'>
          <div className='flex-grow'>
            <MenuItemCard
              item={item}
              previewMode={previewMode}
              selected={false}
              className='transition-shadow duration-300 ease-in-out hover:shadow-2xl'
              key={item.id}
              imageSrc={(photo && photo.is_active && photo.url) ? photo.url : 'https://res.cloudinary.com/dzmqies6h/image/upload/v1710964654/Burger_Menu_Item_Card_Holder_vgzofu.png'}
              variant={'creamer'}
              price={item?.price?.amount}
              name={item?.name ?? ''}
              description={item?.description ?? ''}
              isAvailable={item.sale_status === 'FOR_SALE' && item.is_active}
            />
          </div>
          <TitleComponent
            leftTitle='Check availability (WIP)'
            leftTitleClassName='text-xs'
            className='flex-col ml-4 border space-y-2'>
            <div className='mt-4'>
              <DatePicker
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                className='bg-black text-white border-white border-2 rounded-lg' />
              <TimezoneSelect
                value={selectedTimezone}
                onChange={setSelectedTimezone}
              />
            </div>
          </TitleComponent>
        </div>
        <ItemClassificationSelect
          onChange={handleItemClassificationChange}
          className='text-white' />

        <div className='flex flex-col'>
          <HoursDisplay hoursConfig={menu.hours} />
        </div>
      </div>
    </TitleComponent>
  );
};

export default ItemCard;