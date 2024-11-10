'use client';

import React from 'react';
import { cn } from '../lib/utils';
import { ItemClassification } from '../models/menuModels';
import { motion } from 'framer-motion';

interface ItemClassificationItemProps {
  classification: ItemClassification;
  displayText: string;
  isSelected?: boolean;
  onClick?: (classification: ItemClassification) => void;
  className?: string;
  icon?: JSX.Element;
}

export const ItemClassificationItem: React.FC<ItemClassificationItemProps> = ({
  className,
  classification,
  displayText,
  isSelected,
  onClick,
  icon,
}) => {
  return (
    <div
      className={cn(
        'w-fit flex flex-col justify-center items-center cursor-pointer whitespace-nowrap relative pb-1',
        className,
      )}
      onClick={() => onClick?.(classification)}
    >
      {icon}
      {displayText}
      {isSelected && (
        <motion.div
          className='absolute bottom-0 left-0 right-0 h-[6px] bg-secondary-pink-salmon'
          layoutId="underline"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
};