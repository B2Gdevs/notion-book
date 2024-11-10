import React from 'react';
import {StoreCard} from './store-card-2';
import { Store } from 'ui';

interface StoresSectionProps {
  stores: Store[];
}

export const StoresSection: React.FC<StoresSectionProps> = ({ stores }) => {
  return (
    <div className="stores-section bg-gray-100 p-4 rounded-lg shadow-lg grid grid-cols-3 gap-4">
      <h2 className="col-span-3 text-gray-800 text-3xl  mb-4">Our Featured Stores</h2>
      {stores?.map(store => (
        <StoreCard key={store?.id} store={store} className="bg-white p-2 shadow-lg" />
      ))}
    </div>
  );
};