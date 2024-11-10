'use client';

import React from 'react';
import { ColorfullLocation } from '../models/orgModels';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

interface LocationSelectProps {
    locations: ColorfullLocation[];
    initialLocationAddress: string;
    onChange: (selectedLocation: ColorfullLocation) => void;
    disabled?: boolean;
    className?: string;
}

export function LocationSelect({
    locations,
    initialLocationAddress,
    onChange,
    disabled,
    className,
}: LocationSelectProps) {
    const [selectedLocationAddress, setSelectedLocationAddress] = React.useState<string>(initialLocationAddress);

    const handleSelectionChange = (value: string) => {
        setSelectedLocationAddress(value);
        const location = locations.find((loc) => loc.address === value);
        if (location) {
            onChange?.(location);
        }
    };

    return (
        <Select
            value={selectedLocationAddress}
            onValueChange={handleSelectionChange}
            disabled={disabled}
        >
            <SelectTrigger
                className={className}
            >
                {locations.find((loc) => loc.address === selectedLocationAddress)
                    ?.address || 'Select a Location'}
            </SelectTrigger>
            <SelectContent>
                {locations.map((location) => (
                    <SelectItem key={location.address} value={location.address}>
                        {location.address}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}