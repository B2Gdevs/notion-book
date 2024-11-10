'use client';

import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useGetItemClassifications } from '../hooks/itemClassificationHooks';
import { ItemClassification } from '../models/menuModels';
import { Select, SelectContent, SelectItem, SelectTrigger, cn } from '..';

interface ItemClassificationSelectProps {
  onChange?: (selectedItemClassification: ItemClassification) => void;
  initialItemClassificationId?: string;
  disabled?: boolean;
  itemClassificationsToFilterOut?: string[];
  className?: string;
}

export const ItemClassificationSelect: React.FC<ItemClassificationSelectProps> = ({
  onChange,
  initialItemClassificationId,
  disabled,
  itemClassificationsToFilterOut = [],
  className
}) => {
  const { data: itemClassifications, isLoading } = useGetItemClassifications({
    page: 1,
    pageSize: 1000,
  });

  const [selectedItemClassificationId, setSelectedItemClassificationId] = useState<string>(initialItemClassificationId || '');

  useEffect(() => {
    setSelectedItemClassificationId(initialItemClassificationId || '');
  }, [initialItemClassificationId]);

  const handleSelectionChange = (value: string) => {
    setSelectedItemClassificationId(value);
    const selectedItemClassification = itemClassifications?.find((itemClassification) => itemClassification.id === value);
    if (selectedItemClassification) {
      onChange?.(selectedItemClassification);
    }
  };

  const filteredItemClassifications = itemClassifications?.filter(itemClassification => {
    return !itemClassificationsToFilterOut.includes(itemClassification?.id ?? '');
  });

  if (isLoading) return <Skeleton count={1} />;

  return (
    <Select
      value={selectedItemClassificationId}
      onValueChange={handleSelectionChange}
      disabled={disabled}>
      <SelectTrigger>
        {filteredItemClassifications?.find((itemClassification) => itemClassification.id === selectedItemClassificationId)?.tag || 'Select an Item Classification...'}
      </SelectTrigger>
      <SelectContent className={cn("max-h-48 overflow-y-auto",
        className
      )}>
        {filteredItemClassifications?.map((itemClassification) => (
          <SelectItem
          className='text-black'
            key={itemClassification.id}
            value={itemClassification?.id ?? ''}>
            {itemClassification.tag}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};