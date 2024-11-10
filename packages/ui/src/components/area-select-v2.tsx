'use client';

import { cn } from '..';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { useGetAreas } from '..';
import { Area } from '..';

interface AreaSelectV2Props {
    selectedAreaId?: string; // Make optional
    onChange?: (areaId: string, area: Area) => void; // Make optional
    areas?: Area[];
    disabled?: boolean; // Add disabled prop
    className?: string; // Add className prop
    selectTriggerTextOverride?: string; // Add selectTriggerTextOverride prop
}

export const AreaSelectV2: React.FC<AreaSelectV2Props> = ({
    selectedAreaId,
    onChange,
    areas,
    disabled = false, // Default to false if not provided
    className, // Add className prop
    selectTriggerTextOverride,
}) => {
    const { data: fetchedAreas, isLoading, isError } = useGetAreas();

    const areasToDisplay = areas || fetchedAreas;

    if (!areas && isLoading) {
        return <div>Loading...</div>;
    }

    if (!areas && isError) {
        return <div>Error loading areas</div>;
    }

    return (
        <div className={cn('relative', className)}> 
            <Select
                value={selectedAreaId ?? ''} // Handle undefined selectedAreaId
                onValueChange={(areaId) => {
                    const selectedArea = areasToDisplay?.find((area) => area.id === areaId);
                    if (selectedArea && onChange) { // Check if onChange is defined
                        onChange(areaId, selectedArea);
                    }
                }}
                disabled={disabled} // Pass disabled prop to Select
            >
                <SelectTrigger aria-label='Area' disabled={disabled} > {/* Use disabled prop and className */}
                    {areasToDisplay?.find((area) => area.id === selectedAreaId)?.name ||
                        (selectTriggerTextOverride ? selectTriggerTextOverride :'Assign an Area')}
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
    );
};