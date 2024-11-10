import React from 'react';
import { IntegrationSystem, Select, SelectContent, SelectItem, SelectTrigger } from 'ui'; // Adjust the import path as necessary

interface IntegrationSystemSelectProps {
  onChange: (value: IntegrationSystem) => void;
  value: IntegrationSystem;
}

export const IntegrationSystemSelect: React.FC<IntegrationSystemSelectProps> = ({ onChange, value }) => {
  // Dynamically generate placeholder text
  const placeholderText = 'Select an Integration System...';

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>{value || placeholderText}</SelectTrigger>
      <SelectContent className="max-h-48 overflow-y-auto">
        {Object.values(IntegrationSystem).map((system) => (
          <SelectItem key={system} value={system}>
            {system}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};