import React from 'react';
import { Brand, cn } from 'ui';

interface BrandCardProps {
  brand: Brand;
  className?: string;
}

export const BrandCard: React.FC<BrandCardProps> = ({ brand, className }) => {
  return (
    <div className={cn("brand-card border-4 border-black p-2", className)}>
      <img className="w-full h-32 object-cover mb-2" src={brand.brand_image_url ?? "https://placehold.co/600x400"} alt={brand.name} />
      <h3 className="text-xl ">{brand.name}</h3>
    </div>
  );
};