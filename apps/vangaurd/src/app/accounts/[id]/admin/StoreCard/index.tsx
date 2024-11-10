import { useSession } from '@clerk/nextjs';
import { MoreHorizontal } from "lucide-react";
import React, { useState } from 'react';
import { Brand, Button, MenusMetricBar, Store, Switch, isStoreOpen, useMenuDataFromStoreId } from 'ui'; // Ensure this is the correct import path
import { StoreConnectionDialog } from '../../../../components/store-connection-dialog';

// Extend the interface to include the store object
interface StoreCardProps {
  isAuthorized: boolean;
  store: Store;
  onClick: () => void;
  brand?: Brand;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick, brand, isAuthorized }) => {


  const isStoreBeingShown = isStoreOpen(store);
  const session = useSession();
  const sessionId = session.session?.id ?? '';
  const [isStoreConnectionDialogOpen, setIsStoreConnectionDialogOpen] = useState(false);

  const {
    menus,
    items,
    categories,
    modifierGroups,
    photos
  } = useMenuDataFromStoreId(store?.id ?? '');


  const renderAuthOrConnectionButton = () => {
    if (!isAuthorized) {
      return (
        <Button
          size='sm'
          className='font-righteous rounded-xl'
          disabled
          
        >
          Please Reauthorize
        </Button>
      );
    } else if (!store.is_otter_connected) {
      return (
        <Button
          size='sm'
          className='font-righteous rounded-xl'
          onClick={() => {
            setIsStoreConnectionDialogOpen(true);
          }}
        >
          Connect
        </Button>
      );
    }

    return (
      <Button
        size='sm'
        className='font-righteous rounded-xl'
        onClick={() => {
          setIsStoreConnectionDialogOpen(true);
        }}
      >
        connected
      </Button>
    );
  }

  // A message describing no brand has been selected
  if (!brand) {
    return (
      <div className='flex items-center gap-x-4 text-secondary-pink-salmon'>
        <MoreHorizontal size={20} />
        <div>No brand selected.</div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="h-[100px] bg-white/80 rounded-lg p-4 flex flex-col items-center justify-center text-center">
        <div className="text-lg  text-gray-800">Store Information Unavailable</div>
        <div className="text-sm text-gray-600 mt-2">This card cannot be displayed correctly as something is wrong with the store.</div>
      </div>
    );
  }


  return (
    <div className={`bg-white/80 flex flex-col justify-between items-start grow shrink basis-[0.00] p-6 rounded-2xl gap-4`}>
      <MenusMetricBar
        menus={menus}
        categories={categories}
        modifierGroups={modifierGroups}
        items={items}
        photos={photos}
      />
      <div className="font-righteous text-base flex justify-between items-center w-full text-[rgba(28,28,28,1)] whitespace-pre-wrap grow-0 shrink-0 basis-auto">
        <div className='text-lg'>
          {store?.name ?? ''}
        </div>
        {renderAuthOrConnectionButton()}
      </div>
      <div className="relative flex justify-between items-center flex-row h-5 w-full basis-auto box-border">
        {store?.otter_id && (
          <div className='flex justify-start items-center'>
            <Switch
              onClick={onClick}
              checked={isStoreBeingShown}
              className='bg-black'
              checkedRootColor="bg-primary-lime-green"
              checkedThumbColor="bg-primary-spinach-green"
            />
            <div className="[font-family:Open_Sans] text-base  text-[rgba(43,43,43,1)] whitespace-pre-wrap grow-0 shrink-0 basis-auto ml-[8px]">{isStoreBeingShown ? "Shown" : "Hidden"}</div>
          </div>)
        }

        <div className="flex justify-between items-center flex-row gap-2 grow-0 shrink-0 basis-auto -mr-1 mt-[19px]">
          <StoreConnectionDialog
            isDialogOpen={isStoreConnectionDialogOpen}
            handleCloseDialog={() => setIsStoreConnectionDialogOpen(false)}
            store={store}
            sessionId={sessionId}
            brand={brand}
            orgId={store?.org_id ?? ''} />
        </div>
      </div>

    </div>
  );
}

export { StoreCard };
