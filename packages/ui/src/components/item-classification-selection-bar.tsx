'use client';

import React from 'react';
import { cn } from '../lib/utils';
import { ItemClassificationItem } from './item-classification-item';
import { ItemClassification } from '../models/menuModels';
import { getIconForClassification } from '../lib/itemClassificationUtils';
import { ItemClassificationTags } from '../constants/constants';

interface ItemClassificationSelectionBarProps {
  itemClassifications: ItemClassification[];
  onClassificationSelect: (classification: ItemClassification) => void;
  className?: string;
  selectedClassification?: ItemClassification;
}

export const ItemClassificationSelectionBar: React.FC<ItemClassificationSelectionBarProps> = ({
  itemClassifications,
  onClassificationSelect,
  className,
  selectedClassification,
}) => {
  // Ensure "All" classification is always present
  const allClassification: ItemClassification = {
    id: 'all',
    tag: ItemClassificationTags.All
  };

  // Add "All" classification to the list if it's not already included
  const classificationsWithoutAll = [...itemClassifications.filter(c => c.tag !== ItemClassificationTags.All)];
  const AllIcon = getIconForClassification(ItemClassificationTags.All);

  if (!AllIcon) {
    return null;
  }

  if (!selectedClassification){
    selectedClassification = allClassification;
  }

  return (
    <div
      className={cn(
        'flex space-x-2 border-b border-primary-almost-black overflow-x-auto scrollable-container lg:w-full bg-primary-off-white font-righteous text-[16px] text-primary-spinach-green justify-start gap-4 sm:px-2 px-1 md:pr-[15%]',
        className,
      )}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <ItemClassificationItem
        className='text-center hover:text-secondary-peach-orange'
        key={allClassification.id ?? ''}
        classification={allClassification ?? ''}
        displayText={allClassification.tag ?? ''}
        isSelected={selectedClassification?.id === allClassification.id}
        onClick={onClassificationSelect}
        icon={<AllIcon color="green" className="text-green-500 w-[50px] h-[50px] border-2 rounded-lg p-2" />}
      />
      {classificationsWithoutAll.map((classification) => {
        const Icon = getIconForClassification(classification.tag);
        if (Icon) {
          return (
            <ItemClassificationItem
              className='hover:text-secondary-peach-orange text-center'
              key={classification.id ?? ''}
              classification={classification ?? ''}
              displayText={classification.tag ?? ''}
              isSelected={selectedClassification?.id === classification.id}
              onClick={onClassificationSelect}
              icon={<Icon color="green" className='w-[50px] h-[50px] justify-center items-center text-center' />}
            />
          );
        }
        return null;
      })}
    </div>
  );
};