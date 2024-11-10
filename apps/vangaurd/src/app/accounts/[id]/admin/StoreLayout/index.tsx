import { useParams } from 'next/navigation';
import React from 'react';
import { Brand, Store, isStoreOpen, toast, useGetOrgsByQuery, useIsAuthorized, usePauseStore, useUnpauseStore } from "ui"; // Corrected import path
import { StoreCard } from "../StoreCard"; // Corrected relative import

interface StoreLayoutProps {
  brand?: Brand;
  stores: Store[];
  onClick?: (store: Store) => void;
}

export const StoreLayout: React.FC<StoreLayoutProps> = ({ stores, onClick, brand }) => {
  const params = useParams();
  const orgClerkId = (params.id || params.orgId) as string;

  const { data: orgs } = useGetOrgsByQuery({
    externalId: orgClerkId,
  });

  const org = orgs?.[0];
  const auth = useIsAuthorized(org?.id ?? '');
  const { data: authorizationStatus } = auth;
  const isAuthorized = authorizationStatus?.message === 'Authorized.';


  const { mutate: pauseStore } = usePauseStore({
    onSuccess: () => {
      toast({
        title: 'Store Paused',
        description: 'The store has been successfully paused.  ',
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to pause the store: ${error.message} It is likely that it paused in Colorfull and not in Otter.`,
        duration: 3000,
      });
    },
  });

  const { mutate: unpauseStore } = useUnpauseStore({
    onSuccess: () => {
      toast({
        title: 'Store Unpaused',
        description: 'The store has been successfully unpaused.',
        duration: 3000,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to unpause the store: ${error.message} It is likely that it paused in Colorfull and not in Otter.`,
        duration: 3000,
      });
    },

  });

  const handleStoreToggle = (store: Store) => {
    onClick?.(store);
    if (isStoreOpen(store)) {
      pauseStore(store?.id ?? ''); // Assuming store?.id is always defined; adjust nullish coalescing as necessary
    } else {
      unpauseStore(store?.id ?? '');
    }
  };
  let nonNullStores = stores?.filter(Boolean)

  return (
    <div className="bg-primary-light-cyan-blue flex justify-start items-stretch flex-col box-border p-6 rounded-2xl">
      <div className="text-lg  font-righteous">Store and Menus</div>
      <div>Show or Hide your stores in the Colorfull app.  When disabled your store will not appear in the app!</div>
      <div className="my-4 grid grid-cols-3 gap-4 basis-auto box-border">
        {nonNullStores.map((store) => (
          <StoreCard isAuthorized={isAuthorized} key={store?.id} store={store} onClick={() => handleStoreToggle(store)} brand={brand} />
        ))}
        {nonNullStores.length === 0 && (
          <div className="flex justify-center items-center gap-2">
            No Stores Found
          </div>
        )}
      </div>
    </div>
  );
};
