'use client';

import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useGetStoresByIds } from '../hooks/storeHooks'; // Adjusted to use the specific hook for fetching stores by IDs
import { Store } from '../models/storeModels';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

interface StoreSelectProps {
  onChange?: (selectedStore: Store) => void;
  initialStoreId?: string;
  disabled?: boolean;
  storesToFilterOut?: string[];
  allowedStoreIds?: string[]; // Specify allowed store IDs
}

export const StoreSelect: React.FC<StoreSelectProps> = ({
  onChange,
  initialStoreId,
  disabled,
  storesToFilterOut = [],
  allowedStoreIds,
}) => {
  // Adjusted to use allowedStoreIds in the query if provided
  const { data: stores, isLoading } = useGetStoresByIds(allowedStoreIds || []);
  const [selectedStoreId, setSelectedStoreId] = useState<string>(initialStoreId || '');
  const selectedStoreIdRef = useRef(selectedStoreId);

  useEffect(() => {
    selectedStoreIdRef.current = selectedStoreId;
  }, [selectedStoreId]);

  // Update selectedStoreId when initialStoreId changes
  useEffect(() => {
    setSelectedStoreId(initialStoreId || '');
  }, [initialStoreId]);

  const handleSelectionChange = (value: string) => {
    if (value !== selectedStoreIdRef.current) {
      setSelectedStoreId(value);
      const selectedStore = stores?.find((store) => store?.id === value);
      if (selectedStore) {
        onChange?.(selectedStore);
      }
    }
  };

  // Filter out stores not in allowedStoreIds if provided, and filter out stores in storesToFilterOut
  const filteredStores = stores?.filter(store => {
    const isAllowed = allowedStoreIds ? allowedStoreIds.includes(store?.id ?? '') : true;
    return isAllowed && !storesToFilterOut.includes(store?.id ?? '');
  });

  if (isLoading) return <Skeleton count={5} />;

  return (
    <Select value={selectedStoreId} onValueChange={handleSelectionChange} disabled={disabled}>
      <SelectTrigger className='text-black'>
        {filteredStores?.find((store) => store?.id === selectedStoreId)?.name || 'Select a Store...'}
      </SelectTrigger>
      <SelectContent className="max-h-48 overflow-y-auto">
        {filteredStores?.map((store) => (
          <SelectItem key={store?.id} value={store?.id ?? ''}>
            {store?.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};