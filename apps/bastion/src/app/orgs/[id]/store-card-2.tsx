import React from 'react';
import { Store, cn } from 'ui';

interface StoreCardProps {
  store: Store;
  className?: string;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, className }) => {
  return (
    <div className={cn("store-card border-2 border-gray-600 p-2 rounded-lg bg-white shadow-inner", className)}>
      <h3 className="text-xl  mb-2">{store?.name}</h3>
      {/* Additional store details can be displayed here */}
    </div>
  );
};