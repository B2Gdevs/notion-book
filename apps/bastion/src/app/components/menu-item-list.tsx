'use client'

import React from 'react';
import { Category, Item, ModifierGroup, Photo, useGetStore, useMenuDataFromStoreId } from 'ui';
import ItemCard from './item-card';

interface ItemListProps {
  onSelect?: (item: Item) => void;
  storeId: string;
}

const ItemList: React.FC<ItemListProps> = ({ onSelect, storeId }) => {

  const { data: store } = useGetStore(storeId);

  const {
    items,
    photos,
    menus,
    modifierGroups,
    categories,
  } = useMenuDataFromStoreId(storeId);

  return (
    <div className="p-8 space-y-4">
      <h3 className="text-2xl ">Items</h3>
      {Object.values(items ?? {}).length === 0 ? (
        <div className="text-gray-500">No items available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
          {Object.values(items ?? {}).map((item, idx) => (
            <div key={item.id} onClick={() => onSelect?.(item)}>
              <ItemCard
                previewMode={true}
                item={item}
                idx={idx}
                photos={photos as Record<string, Photo>}
                menus={menus}
                modifierGroups={modifierGroups as Record<string, ModifierGroup>}
                categories={categories as Record<string, Category>}
                store={store}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;