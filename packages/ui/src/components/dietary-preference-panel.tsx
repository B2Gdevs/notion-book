'use client';
import { useState } from 'react';
import { ItemClassificationsTagDisplay, useGetItemClassificationsList } from '..';
import { getIconForClassification } from '../lib/itemClassificationUtils'; // Import the utility function
import { Diet } from '../models/miscModels';
import { CircleCheckmark } from './circle-checkmark';

interface DietaryPreferencePanelProps {
  diet: Diet;
}

export const DietaryPreferencePanel: React.FC<DietaryPreferencePanelProps> = ({
  diet,
}: DietaryPreferencePanelProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckChange = () => {
    setIsChecked(!isChecked);
    // Here you can also call any function to update the parent component or perform other side effects
  };

  let {data: dietItemClassifications} = useGetItemClassificationsList(diet?.item_classification_ids ?? []);

  const Icon = getIconForClassification(diet?.name ?? ''); // Use the utility function to get the icon

  if (!Icon) return null; // Return null if no icon is found

  return (
    <div
      className="border rounded-lg p-4 relative cursor-pointer"
      onClick={handleCheckChange}
    >
      {/* Circle checkmark in the top-right corner */}
      <div className="absolute top-2 right-2">
        <CircleCheckmark checked={isChecked} />
      </div>

      {/* Title */}
      <div className="mb-2">
        <h2 className="text-xl ">{diet?.name}</h2>
      </div>

      <ItemClassificationsTagDisplay itemClassifications={dietItemClassifications} />

      {/* Description */}
      <div className="mb-4">
        <div className="text-sm text-gray-600">{diet?.description}</div>
      </div>

      {/* Icon */}
      <div className="mb-2">
        <Icon className="text-secondary-peach-orange" />
      </div>
    </div>
  );
};