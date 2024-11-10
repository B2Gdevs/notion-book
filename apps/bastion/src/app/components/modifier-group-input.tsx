'use client'
import React, { useEffect, useState } from 'react';
import { ModifierGroup, useGetModifierGroupById } from 'ui';

interface ModifierGroupInputProps {
  onChange: (modifierGroup: ModifierGroup) => void;
  menuId: string;
  modifierGroupId?: string; // fixed typo in the prop name
  modifierGroup?: ModifierGroup;
}

const ModifierGroupInput: React.FC<ModifierGroupInputProps> = ({
  onChange,
  menuId,
  modifierGroupId,
  modifierGroup
}) => {
  const defaultModifierGroup: ModifierGroup = {
    menu_id: menuId,
    name: '',
    minimum_selections: 0,
    maximum_selections: 0,
    required: false,
    is_active: true,
    ...modifierGroup
  };
  const [localModifierGroup, setModifierGroup] = useState<ModifierGroup>(modifierGroup ?? defaultModifierGroup);

  const {data: fetchedModifierGroup, isLoading, isError} = useGetModifierGroupById(modifierGroupId ?? '');

  useEffect(() => {
    if (fetchedModifierGroup) {
      setModifierGroup(prev => ({
        ...fetchedModifierGroup,
        item_ids: prev?.item_ids?.length ? prev.item_ids : fetchedModifierGroup.item_ids
      }));
    }
  }, [fetchedModifierGroup]);


  const handleInputChange = (field: keyof ModifierGroup, value: any) => {
    const updatedModifierGroup = { ...localModifierGroup, [field]: value };
    setModifierGroup(updatedModifierGroup);
    onChange(updatedModifierGroup);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching modifier group</div>;
  }
  return (
    <div
    >

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          type="text"
          value={localModifierGroup.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full border rounded-md p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Minimum Selections
        </label>
        <input
          type="number"
          value={localModifierGroup.minimum_selections}
          onChange={(e) =>
            handleInputChange('minimum_selections', parseInt(e.target.value))
          }
          className="w-full border rounded-md p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Maximum Selections
        </label>
        <input
          type="number"
          value={localModifierGroup.maximum_selections}
          onChange={(e) =>
            handleInputChange('maximum_selections', parseInt(e.target.value))
          }
          className="w-full border rounded-md p-2"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Required</label>
        <input
          type="checkbox"
          checked={localModifierGroup.minimum_selections > 0 }
          onChange={(e) => handleInputChange('required', e.target.checked)}
          className="ml-4"
        />
      </div>

    </div>
  );
};

export default ModifierGroupInput;
