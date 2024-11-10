'use client';

import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useGetBrands } from '../hooks/brandHooks';
import { Brand } from '../models/brandModels';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

interface BrandSelectProps {
  onChange?: (selectedBrand: Brand) => void;
  initialBrandId?: string;
  disabled?: boolean;
  brandsToFilterOut?: string[];
  allowedBrandIds?: string[]; // Specify allowed brand IDs
}

export const BrandSelect: React.FC<BrandSelectProps> = ({
  onChange,
  initialBrandId,
  disabled,
  brandsToFilterOut = [],
  allowedBrandIds,
}) => {
  const { data: brands, isLoading } = useGetBrands({ ids: allowedBrandIds?.join(',') });
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');

  useEffect(() => {
    // Set the initial brand ID after brands are loaded and if initialBrandId is provided
    if (brands && initialBrandId) {
      const initialBrand = brands.find(brand => brand.id === initialBrandId);
      if (initialBrand) {
        setSelectedBrandId(initialBrandId);
      }
    }
  }, [brands, initialBrandId]);

  const handleSelectionChange = (value: string) => {
    setSelectedBrandId(value);
    const selectedBrand = brands?.find((brand) => brand.id === value);
    if (selectedBrand) {
      onChange?.(selectedBrand);
    }
  };

  const filteredBrands = brands?.filter(brand => {
    const isAllowed = allowedBrandIds ? allowedBrandIds.includes(brand?.id ?? '') : true;
    return isAllowed && !brandsToFilterOut.includes(brand?.id ?? '');
  });

  if (isLoading) return <Skeleton count={5} />;

  return (
    <Select value={selectedBrandId} onValueChange={handleSelectionChange} disabled={disabled}>
      <SelectTrigger className='text-black'>
        {filteredBrands?.find((brand) => brand.id === selectedBrandId)?.name || 'Select a Brand...'}
      </SelectTrigger>
      <SelectContent className="max-h-48 overflow-y-auto">
        {filteredBrands?.map((brand) => (
          <SelectItem key={brand.id} value={brand?.id ?? ''}>
            {brand.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};