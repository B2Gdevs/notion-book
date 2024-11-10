'use client';

import React, { useCallback, useState } from 'react';
import AddIcon from '../icons/AddIcon';
import TrashIcon from '../icons/TrashIcon';
import MinusIcon from '../icons/MinusIcon';
import { toast } from './ui/use-toast';

interface QuantityCompProps {
  initialQuantity?: number;
  onAdd?: () => void;
  onRemove?: () => void;
  onLastRemove?: () => void;
  useTrashIcon?: boolean;
  hideQuantity?: boolean;
  hideAddIcon?: boolean; // New prop to hide add icon
  disabled?: boolean;
  maxQuantity?: number;
}

export const QuantityComp: React.FC<QuantityCompProps> = ({
  initialQuantity = 1,
  onAdd,
  onRemove,
  onLastRemove,
  useTrashIcon = false,
  hideQuantity = false,
  hideAddIcon = false, // Default to false
  disabled,
  maxQuantity,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleAdd = useCallback(() => {
    if (maxQuantity !== undefined && quantity >= maxQuantity) {
      toast({
        title: 'Cannot increase quantity beyond the maximum limit.',
        variant: 'destructive'
      })
    } else {
      setQuantity((prev) => prev + 1);
      if (onAdd) onAdd();
    }
  }, [onAdd, quantity, maxQuantity]);

  const handleRemove = useCallback(() => {
    if (quantity === 1 && onLastRemove) {
      onLastRemove();
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      if (onRemove) onRemove();
    }
  }, [quantity, onRemove, onLastRemove]);

  return (
    <div className="flex items-center gap-1">
      {useTrashIcon ? (
        <TrashIcon
          className={`w-6 h-6 ${disabled ? 'text-gray-400' : 'text-secondary-pink-salmon'}`}
          onClick={disabled ? undefined : handleRemove}
        />
      ) : (
        <MinusIcon
          className={`w-6 h-6 ${disabled ? 'text-gray-400' : 'text-primary-spinach-green'}`}
          onClick={disabled ? undefined : handleRemove}
        />
      )}

      {!hideQuantity && (
        <div className="relative w-14 h-8 bg-zinc-800 bg-opacity-10 rounded flex items-center justify-center">
          <div className={`text-primary-almost-black font-righteous ${disabled ? 'text-gray-400' : ''}`}>
            {quantity}
          </div>
        </div>
      )}

      {!hideAddIcon && (
        <AddIcon
          className={`w-6 h-6 ${disabled ? 'text-gray-400' : 'text-primary-spinach-green'}`}
          onClick={disabled ? undefined : handleAdd}
        />
      )}
    </div>
  );
};