import React from 'react'; // Import React
import { StoreStates } from '../models/storeModels';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface StoreStateDropdownProps {
    onChange: (value: string) => void;
    value: string;
}

// Dropdown component
export const StoreStateSelect: React.FC<StoreStateDropdownProps> = ({ onChange, value }) => {
    return (
        <Select defaultValue={value} onValueChange={onChange}>
            <SelectTrigger aria-label="Store State">
                <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
                {Object.values(StoreStates).map((state) => (
                    <SelectItem key={state} value={state}>
                        {state.replace(/_/g, ' ')}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
