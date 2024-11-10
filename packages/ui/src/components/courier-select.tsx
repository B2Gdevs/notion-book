'use client';

import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { ColorfullCourier, useGetCouriers } from '..';

interface CourierSelectProps {
    onChange?: (selectedCourier: ColorfullCourier) => void;
    initialCourierId?: string;
    disabled?: boolean;
    className?: string;
    selectTriggerTextOverride?: string; // Add selectTriggerTextOverride prop
}

export const CourierSelect: React.FC<CourierSelectProps> = ({
    onChange,
    initialCourierId,
    disabled,
    className,
    selectTriggerTextOverride,
}) => {
    const {
        data: couriers,
        isLoading,
    } = useGetCouriers({ page: 1, pageSize: 100 });

    const [selectedCourierId, setSelectedCourierId] = useState<string>(initialCourierId || '');

    useEffect(() => {
        setSelectedCourierId(initialCourierId || '');
    }, [initialCourierId]);

    const handleSelectionChange = (value: string) => {
        setSelectedCourierId(value);
        const selectedCourier = couriers?.find((courier) => courier.id === value);
        if (selectedCourier) {
            onChange?.(selectedCourier);
        }
    };

    const selectedCourier = couriers?.find(courier => courier.id === selectedCourierId);

    const placeholderText = 'Select a Courier...';

    if (isLoading) return <Skeleton count={1} />;

    return (
        <Select
            value={selectedCourierId}
            onValueChange={handleSelectionChange}
            disabled={disabled}>
            <SelectTrigger className={className}>
                {((selectedCourier?.first_name && selectedCourier?.last_name) && (`${selectedCourier?.first_name} ${selectedCourier?.last_name}`)) || (selectTriggerTextOverride ? selectTriggerTextOverride : placeholderText)}
            </SelectTrigger>
            <SelectContent >
                {couriers?.map((courier) => (
                    <SelectItem key={courier.id} value={courier.id ?? ''} disabled={disabled} > {/* Use disabled prop and className */}
                        {courier.first_name} {courier.last_name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};