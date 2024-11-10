import React from 'react';
import { CodeBlock } from '..';
import { ItemClassification } from '../models/menuModels';

interface ItemClassificationsTagDisplayProps {
  itemClassifications: ItemClassification[];
  previewMode?: boolean;
}

export const ItemClassificationsTagDisplay: React.FC<ItemClassificationsTagDisplayProps> = ({
  itemClassifications,
  previewMode = true }) => {
  if (!itemClassifications) return null;

  return (
    <div className={`text-yellow-500 flex-col ${previewMode ? 'opacity-50' : ''}`}>
      <div>Item Classifications</div>
      <div className='flex flex-wrap gap-2'>
        {itemClassifications.map(ic => (
          <CodeBlock key={ic.id}>{ic.tag}</CodeBlock>
        ))}
      </div>
    </div>
  );
};