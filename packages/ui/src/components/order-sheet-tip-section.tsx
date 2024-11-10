'use client'

import React from 'react';
import { TipSelection } from './tip-selection';

interface OrderSheetTipSectionProps {
  hasUserOrderedToday: boolean;
  onTipChange?: (tip: number) => void;
  tip: number;
  isStipendApplied: boolean;
  disabled?: boolean;
}

export const OrderSheetTipSection: React.FC<OrderSheetTipSectionProps> = ({
  hasUserOrderedToday,
  onTipChange,
  tip,
  isStipendApplied,
  disabled,
}) => {
  const handleTipChange = (newTip: number) => {
    onTipChange?.(newTip);
  };

  return (
    <div className={`flex flex-row items-center justify-between font-righteous w-full px-2 lg:px-6 ${hasUserOrderedToday && 'opacity-70'} ${disabled ? 'text-gray-400' : ''}`}>
      <div className='flex flex-col gap-2'>
        <div>Add a tip for the driver?</div>
        <div className='text-xs text-secondary-peach-orange'>
          (100% of it will go to the driver)
        </div>
      </div>

      <TipSelection
        disabled={disabled}
        onTipSelect={handleTipChange}
        selectedTip={tip}
        tips={isStipendApplied ? [0] : [1, 2, 3]}
      />
    </div>
  );
};
