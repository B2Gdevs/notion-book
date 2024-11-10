import React from 'react';
import { usePauseStore, useUnpauseStore } from '../hooks/storeHooks';
import { StoreStates } from '../models/storeModels';
import { ContextMenuContent, ContextMenuItem, ContextMenuShortcut } from './ui/context-menu';
import { toast } from './ui/use-toast';

interface StoreContextActionsProps {
  storeId: string;
  onStateChange?: (arg: StoreStates) => void;
}

export const StoreContextActions: React.FC<StoreContextActionsProps> = ({ storeId, onStateChange }) => {
  const { mutate: pauseStore } = usePauseStore({
    onSuccess: () => {
      toast({
        title: 'Store Paused',
        description: 'The store has been paused successfully.',
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to pause store: ${error.message}`,
        duration: 5000,
      });
    },
  });

  const { mutate: unpauseStore } = useUnpauseStore({
    onSuccess: () => {
      toast({
        title: 'Store Unpaused',
        description: 'Store unpaused successfully',
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('Failed to unpause store', error);
      toast({
        title: 'Error Unpausing Store',
        description: `Error: ${error.message}`,
        duration: 3000,
      });
    },
  });

  const handlePause = () => {
    onStateChange?.(StoreStates.OPERATOR_PAUSED);
    pauseStore(storeId);
  };

  const handleUnpause = () => {
    onStateChange?.(StoreStates.OPEN);
    unpauseStore(storeId);
  };

  return (
    <ContextMenuContent className="w-64">
      <ContextMenuItem onClick={handleUnpause}>
        <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
          1
        </span>
        Unpause Store
        <ContextMenuShortcut>Ctrl+U</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem onClick={handlePause}>
        <span className='bg-secondary-pink-salmon text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
          2
        </span>
        Pause Store
        <ContextMenuShortcut>Ctrl+P</ContextMenuShortcut>
      </ContextMenuItem>
    </ContextMenuContent>
  );
};