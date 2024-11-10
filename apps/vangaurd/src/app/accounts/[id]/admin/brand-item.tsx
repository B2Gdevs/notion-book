import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import React from 'react';
import { Brand, Tooltip, TooltipContent, TooltipTrigger, cn } from 'ui';

interface BrandItemProps {
  brand: Brand;
  isSelected?: boolean;
  onClick?: (brand: Brand) => void;
  className?: string;
}

export const BrandItem: React.FC<BrandItemProps> = ({
  className,
  brand,
  isSelected,
  onClick,
}) => {

  return (
    <motion.div
      className={cn(
        'w-fit flex-none cursor-pointer whitespace-nowrap flex-col items-center',
        className,
      )}
      onClick={() => onClick?.(brand)}
    >
      <div className='flex items-center gap-2'>
        <span>{brand?.name}</span>
        {!brand?.otter_id && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div><AlertCircle className="ml-2" /></div>
            </TooltipTrigger>
            <TooltipContent side="top">This brand has no otter ID</TooltipContent>
          </Tooltip>
        )}
      </div>
      {isSelected && (
        <motion.div
          layoutId={'underline'}
          className='bg-secondary-pink-salmon block w-full h-[5px] bottom-0'
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        ></motion.div>
      )}
    </motion.div>
  );
};