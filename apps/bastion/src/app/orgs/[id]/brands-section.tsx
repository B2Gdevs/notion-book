import React from 'react';
import {BrandCard} from './brand-card';
import { Brand } from 'ui';

interface BrandsSectionProps {
  brands: Brand[];
}

export const BrandsSection: React.FC<BrandsSectionProps> = ({ brands }) => {
  return (
    <div className="brands-section bg-gray-800 p-4 rounded-lg grid grid-cols-3 gap-4">
      <h2 className="col-span-3 text-white text-3xl  mb-4">Brands</h2>
      {brands.map(brand => (
        <BrandCard key={brand.id} brand={brand} className="bg-white p-2 shadow-lg" />
      ))}
    </div>
  );
};