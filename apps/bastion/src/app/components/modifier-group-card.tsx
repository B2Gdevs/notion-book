// ModifierGroupCard.tsx
import { motion } from 'framer-motion';
import { CheckCircle, Edit3, Info, XCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Button, ModifierGroup } from 'ui';

interface ModifierGroupCardProps {
  modifierGroup: ModifierGroup;
}

const ModifierGroupCard: React.FC<ModifierGroupCardProps> = ({ modifierGroup }) => {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  const storeId = params.storeId as string;

  const handleEdit = () => {
    router.push(`/orgs/${orgId}/stores/${storeId}/menus/${modifierGroup.menu_id}/modifier-groups/${modifierGroup.id}`);
  };

  return (
    <motion.li
      className="p-4 m-2 bg-white rounded-md shadow-md transform transition block border-2 border-gray-200 hover:border-gray-400"
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex justify-between items-center">
        <h4 className="text-xl ">{modifierGroup.name}</h4>
        <div>
          <h5 className="text-gray-600 text-sm uppercase tracking-wide">Selections</h5>
          <span className="ml-2">Min: {modifierGroup.minimum_selections}</span>
          <span className="ml-2">Max: {modifierGroup.maximum_selections}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <Info className="h-5 w-5 text-gray-700" />
        <span>{modifierGroup?.item_ids?.length ?? 0} items</span>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        {modifierGroup.minimum_selections > 0  ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <span>Required: {modifierGroup.minimum_selections > 0 ? 'Yes' : 'No'}</span>
      </div>
      <Button
        onClick={handleEdit}
        className="mt-4 inline-flex items-center space-x-2"
      >
        <Edit3 className="h-5 w-5" />
        <span>Edit</span>
      </Button>
    </motion.li>
  );
};

export default ModifierGroupCard;
