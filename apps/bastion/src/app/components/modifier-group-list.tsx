// ModifierGroupList.tsx
import React from 'react';
import { ModifierGroup, useMenuDataFromStoreId } from 'ui';
import ModifierGroupCard from './modifier-group-card';

interface ModifierGroupListProps {
  onSelect: (modifierGroup: ModifierGroup) => void;
  storeId: string;
}

const ModifierGroupList: React.FC<ModifierGroupListProps> = ({ storeId}) => {

  const {
    modifierGroups,
  } = useMenuDataFromStoreId(storeId);


  return (
    <div>
      <h3>Modifier Groups</h3>
      {Object.values(modifierGroups ?? {}).length === 0 ? (
        <div>No modifier groups available.</div>
      ) : (
        <ul className="space-y-4">
          {Object.values(modifierGroups ?? {}).map((group) => (
            <ModifierGroupCard key={group.id} modifierGroup={group} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ModifierGroupList;
