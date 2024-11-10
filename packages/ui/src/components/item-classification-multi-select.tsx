"use client";

import React from "react";
import { FancyMultiSelect, SelectableItem } from "./fancy-multi-select";
import { useGetItemClassifications, useCreateItemClassification } from "../hooks/itemClassificationHooks";
import { useUpdateItem } from "../hooks/itemHooks";
import { Item, ItemClassification } from "../models/menuModels";
import { DEFAULT_TABLE_PAGE_SIZE, toast } from "..";

interface ItemClassificationSelectorProps {
  item?: Item;
  className?: string;
}

export const ItemClassificationMultiSelect: React.FC<ItemClassificationSelectorProps> = ({ item, className }) => {
  const { data: classifications, isLoading, isError } = useGetItemClassifications({
    page: 1,
    pageSize: DEFAULT_TABLE_PAGE_SIZE
  });

  const { mutate: updateItem } = useUpdateItem({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Item updated successfully',
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        duration: 5000,
        variant: 'destructive'
      });
    }
  });

  const { mutate: createItemClassification } = useCreateItemClassification({
    onSuccess: () => {
      console.log("Item classification created successfully");
    },
    onError: (error) => {
      console.error("Failed to create item classification", error);
    }
  });

  if (!item) {
    return null;
  }

  if (isLoading) {
    return <div>Loading classifications...</div>;
  }

  if (isError || !classifications) {
    return <div>Error loading classifications.</div>;
  }

  const selectableItems: SelectableItem[] = classifications.map((classification: ItemClassification) => ({
    id: classification.id || '',
    displayText: classification.tag,
  }));

  const selectedClassifications = selectableItems.filter((selectableItem) =>
    item.item_classifications_ids?.includes(selectableItem?.id ?? '')
  );

  const handleItemSelect = (selectedItem: SelectableItem) => {
    if (item) {
      const ids = item.item_classifications_ids || [];
      const updatedClassifications = [...ids, selectedItem.id];
      updateItem({ itemId: item?.id ?? '', itemData: { ...item, item_classifications_ids: updatedClassifications } });
    }
  };

  const handleItemRemove = (selectedItem: SelectableItem) => {
    if (item && item.item_classifications_ids) {
      const updatedClassifications = item.item_classifications_ids.filter(id => id !== selectedItem.id);
      updateItem({ itemId: item?.id ?? '', itemData: { ...item, item_classifications_ids: updatedClassifications } });
    }
  };

  const handleCreateClassification = (inputValue: string) => {
    createItemClassification({ tag: inputValue }); // Assuming `tag` is the relevant field for a new classification
  };

  return (
    <FancyMultiSelect
      items={selectableItems}
      selectedItems={selectedClassifications}
      className={className}
      placeholder="Select item classifications..."
      onItemRemove={handleItemRemove}
      onItemSelect={handleItemSelect}
      onCreate={handleCreateClassification}
    />
  );
};