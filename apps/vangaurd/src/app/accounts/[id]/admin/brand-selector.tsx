'use client';

import React from 'react';
import { Brand, cn } from 'ui';
import { BrandItem } from './brand-item';

interface BrandSelectorProps {
  brands: Brand[];
  onBrandSelect: (brand: Brand) => void;
  className?: string;
  selectedBrand?: Brand;
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({
  brands,
  onBrandSelect,
  className,
  selectedBrand,
}) => {

  return (
    <div
      className={cn(
        'flex flex-wrap overflow-visible lg:w-full bg-primary-off-white font-righteous text-[16px] text-primary-spinach-green justify-start gap-8 container sm:px-2 px-1 md:pr-[15%]',
        className,
      )}
    >
      {brands.map((brand) => (
        <BrandItem
          className='bottom-0'
          key={brand.id}
          brand={brand}
          isSelected={selectedBrand?.id === brand.id}
          onClick={() => onBrandSelect(brand)}
        />
      ))}
    </div>
  );
};