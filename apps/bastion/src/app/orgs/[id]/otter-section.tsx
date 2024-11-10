import React from 'react';
import {BrandsSection} from './brands-section';
import {StoresSection} from './stores-section';
import { useGetOrgBrands, useGetOrgStores, Org, Store } from 'ui'; // Adjust the import path as necessary
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface OtterSectionProps {
  org: Org;
}

export const OtterSection: React.FC<OtterSectionProps> = ({ org }) => {
  const { data: brands, isLoading: isLoadingBrands } = useGetOrgBrands(org);
  const { data: stores, isLoading: isLoadingStores } = useGetOrgStores(org);

  const validStores = (stores || []).filter((store): store is Store => Boolean(store));

  if (isLoadingBrands || isLoadingStores) {
    return (
      <div className="otter-section p-4">
        <div className="brands-section mb-4">
          <Skeleton count={5} height={100} width={200} style={{ margin: '10px' }} />
        </div>
        <div className="stores-section">
          <Skeleton count={5} height={100} width={200} style={{ margin: '10px' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="otter-section p-4 bg-gray-200">
      <div className="brands-section mb-8">
        <h3 className='text-2xl border-b-2 border-black font-righteous my-2'>Otter Section</h3>
        <BrandsSection brands={brands || []} />
      </div>
      <div className="stores-section">
        <StoresSection stores={validStores || []} />
      </div>
    </div>
  );
};
