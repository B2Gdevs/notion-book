'use client';

import React from 'react';
import { cn } from '../lib/utils';
import { Category } from '../models/menuModels';
import { MenuCategoryItem } from './menu-category-item';

interface CategorySelectorProps {
  categories: Category[];
  onCategorySelect: (categoryId: string) => void;
  className?: string;
  selectedCategory?: string;
}

export const MenuCategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  onCategorySelect,
  className,
  selectedCategory,
}) => {
  return (
    <div
      className={cn(
        'flex overflow-x-auto scrollable-container lg:w-full bg-primary-off-white font-righteous text-[16px] text-primary-spinach-green justify-start gap-8 sm:px-2 px-1 md:pr-[15%]',
        className,
      )}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {categories.map((category) => (
        <MenuCategoryItem
          key={category.id ?? ''}
          categoryId={category.id ?? ''}
          categoryName={category.name ?? ''}
          isSelected={selectedCategory === category.id}
          onClick={onCategorySelect}
        />
      ))}
    </div>
  );
};