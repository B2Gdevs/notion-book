import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import _ from 'lodash';

interface PriorityGroupSelectProps {
    onChange: (value: number) => void;
    value?: number;
}

export const PriorityGroupSelect: React.FC<PriorityGroupSelectProps> = ({ onChange, value }) => {
    const MAX_PRIORITY_GROUP = 10;
    
    if (!value) {
        value = MAX_PRIORITY_GROUP;
    }

    const handleValueChange = (value: string) => {
        onChange(Number(value));
    };

    return (
        <Select defaultValue={value?.toString()} onValueChange={handleValueChange}>
            <SelectTrigger aria-label="Priority Group">
                <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
                {_.range(MAX_PRIORITY_GROUP).map((group) => (
                    <SelectItem key={group.toString()} value={group.toString()}>
                        {`${group}`}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};