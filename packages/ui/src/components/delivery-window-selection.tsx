'use client'

import { Calendar, Clock8, MapPin } from 'lucide-react';
import React, { useState } from 'react';
import { Area, CodeBlock, DeliveryWindow, DeliveryWindowSelect, Label, Select, SelectContent, SelectItem, SelectTrigger, TitleComponent, useGetAreas } from '..';

interface DeliveryWindowSelectionProps {
    selectedDate: Date | undefined;
    selectedArea: Area | undefined;
    selectedWindow: DeliveryWindow | undefined;
    onWindowSelect: (window: DeliveryWindow) => void;
    disabled?: boolean;
    areas?: Area[];
    onAreaSelect?: (areaId: string, area: Area) => void;
}

export const DeliveryWindowSelection: React.FC<DeliveryWindowSelectionProps> = ({
    selectedDate,
    selectedArea,
    selectedWindow,
    onWindowSelect,
    disabled,
    areas,
    onAreaSelect
}) => {

    const { data: fetchedAreas, isLoading, isError } = useGetAreas();
    // Initialize selectedAreaId state
    const [selectedAreaId, setSelectedAreaId] = useState<string>(selectedArea?.id ?? '');

    const areasToDisplay = areas || fetchedAreas;

    if (!areas && isLoading) {
        return <div>Loading...</div>;
    }

    if (!areas && isError) {
        return <div>Error loading areas</div>;
    }

    const selectTriggerTextOverride = 'Select Area For Delivery Windows'

    return (
        <TitleComponent leftTitle='Delivery Window Selection' className='mt-8'>
            <div className='flex justify-start items-start mt-6 space-x-8 pb-4 text-gray-200'>
                <div className='flex flex-col'>
                    <Label className='flex items-center space-x-2'>
                        <MapPin className='w-5 h-5' />
                        <span className='text-black'>Area</span>
                    </Label>
                    <Select
                        value={selectedAreaId} // Use state for value
                        onValueChange={(areaId) => {
                            setSelectedAreaId(areaId); // Update state on change
                            const selectedArea = areasToDisplay?.find((area) => area.id === areaId);
                            if (selectedArea && onAreaSelect) {
                                onAreaSelect(areaId, selectedArea);
                            }
                        }}
                        disabled={disabled}
                    >
                        <SelectTrigger aria-label='Area' disabled={disabled} > {/* Use disabled prop and className */}
                            {areasToDisplay?.find((area) => area.id === selectedAreaId)?.name ||
                                (selectTriggerTextOverride ? selectTriggerTextOverride : 'Assign an Area')}
                        </SelectTrigger>
                        <SelectContent >
                            {areasToDisplay?.map((area) => (
                                <SelectItem key={area.id} value={area.id ?? ''} disabled={disabled} > {/* Use disabled prop and className */}
                                    {area.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className='flex flex-col'>
                <Label className='flex items-center space-x-2'>
                    <Calendar className='w-5 h-5' />
                    <span className='text-black'>Selected Date</span>
                </Label>
                <div className='flex items-center mt-2'>
                    <CodeBlock className="bg-gray-100 rounded p-2 text-gray-600">
                        {selectedDate?.toDateString() ?? 'No Date Selected'}
                    </CodeBlock>
                </div>
            </div>
            <div className='flex flex-col'>
                <Label className='flex items-center space-x-2'>
                    <Clock8 className='w-5 h-5' />
                    <span className='text-black'>Delivery Window</span>
                </Label>
                <DeliveryWindowSelect
                    area_id={selectedAreaId ?? selectedArea?.id}
                    onWindowSelect={onWindowSelect}
                    className='text-gray-600'
                    selectedWindow={selectedWindow}
                />
            </div>
        </TitleComponent>
    );
};