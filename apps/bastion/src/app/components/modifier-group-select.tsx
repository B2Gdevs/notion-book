'use client'
import React, { useState } from 'react';
import {
  ModifierGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  useGetModifierGroupsByMenu
} from 'ui'; // Adjust the imports as needed based on your actual setup

interface ModifierGroupSelectProps {
  menuId: string;
  onSelect?: (selectedModifierGroup: ModifierGroup) => void;
}

const ModifierGroupSelect: React.FC<ModifierGroupSelectProps> = ({
  menuId,
  onSelect,
}) => {
  const [selectedModifierGroup, setSelectedModifierGroup] = useState<ModifierGroup | null>(
    null,
  );

  const {data:fetchedModifierGroups} = useGetModifierGroupsByMenu(menuId ?? '');


  const handleSelectModifierGroup = (modifierGroup: ModifierGroup) => {
    setSelectedModifierGroup(modifierGroup);
    if (onSelect) {
      onSelect(modifierGroup);
    }
  };

  return (
    <Select
      value={selectedModifierGroup?.id || ''} // Assuming the ModifierGroup has an 'id' property
      onValueChange={(value: any) => {
        const modifierGroup = fetchedModifierGroups?.find(
          (group) => group.id === value, // Adjust if ModifierGroup uses a different property than 'id'
        );
        if (modifierGroup) {
          handleSelectModifierGroup(modifierGroup);
        }
      }}
    >
      <SelectTrigger>
        {selectedModifierGroup?.name || 'Select a modifier group'}
      </SelectTrigger>
      <SelectContent>
        {fetchedModifierGroups?.map((group) => (
          <SelectItem key={group.id} value={group?.id ?? ''}> 
            {group.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModifierGroupSelect;
