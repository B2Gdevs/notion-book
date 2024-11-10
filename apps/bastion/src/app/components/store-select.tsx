'use client'
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton from react-loading-skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Ensure to import the CSS for react-loading-skeleton
import { Select, SelectContent, SelectItem, SelectTrigger, Store, useGetStoresByIds } from 'ui'; // Adjust the imports as needed based on your actual setup

interface StoreSelectProps {
    storeIds: string[];
    onSelect?: (selectedStore: Store) => void;
}

const StoreSelect: React.FC<StoreSelectProps> = ({
    storeIds,
    onSelect,
}) => {
    const { data: stores, isLoading } = useGetStoresByIds(storeIds);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);

    const handleSelectStore = (store: Store) => {
        setSelectedStore(store);
        if (onSelect) {
            onSelect(store);
        }
    };

    if (isLoading) {
        return (
            <div>
                {/* Display a skeleton for the select trigger */}
                <Skeleton height={38} className="mb-2" />
                {/* Display skeletons for each select item */}
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} height={36} className="mb-2" />
                ))}
            </div>
        );
    }

    return (
        <Select
            value={selectedStore?.id || ''}
            onValueChange={(value: any) => {
                const store = stores?.find((s) => s?.id === value);
                if (store) {
                    handleSelectStore(store);
                }
            }}
        >
            <SelectTrigger>
                {selectedStore ? selectedStore?.name : 'Select a store'}
            </SelectTrigger>
            <SelectContent>
                {stores && stores.length > 0 ? (
                    stores
                    .filter((store) => store)
                        .sort((a, b) => (a?.name ?? '').localeCompare(b?.name ?? ''))
                        .map((store) => (
                            <SelectItem key={store?.id ?? ''} value={store?.id ?? ''}>
                                {store?.name}; ID: {store?.id}
                            </SelectItem>
                        ))
                ) : (
                    <div>No stores available</div>
                )}
            </SelectContent>
        </Select>
    );
};

export default StoreSelect;