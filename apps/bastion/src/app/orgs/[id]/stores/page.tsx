'use client'

import { HexagonIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Brand, Button, ImageHolder, TitleComponent, toast, useDeleteStore, useGetBrandsByIds, useGetOrg, useGetStoresByIds, useUpdateBrand } from 'ui';
import { StoreCard } from '../../../components/store-card';

const StorePage: React.FC = () => {
    const params = useParams();
    const router = useRouter();

    const orgId = (params.orgId || params.id) as string;

    const { data: org } = useGetOrg(orgId);
    const { data: brands, isLoading: brandsLoading } = useGetBrandsByIds(org?.brand_ids ?? []);
    const { data: stores } = useGetStoresByIds(brands?.flatMap(brand => brand.store_ids) ?? []);
    // Add a state to manage new store names for each brand
    const mutationOptions = {
        onSuccess: () => {
            toast({
                title: 'Operation Successful',
                description: 'The operation has been completed successfully.',
                duration: 5000,
            });
        },
        onError: (error: { message: any; }) => {
            toast({
                title: 'Error',
                description: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
                duration: 5000,
            });
        },
    };

    const updateBrandMutation = useUpdateBrand(mutationOptions);
    const deleteStoreMutation = useDeleteStore(mutationOptions);


    const handleDeleteStore = (storeId: string) => {
        deleteStoreMutation.mutate(storeId);
    };


    const removeStoreFromBrand = (storeId: string) => {
        const currentBrand = brands?.find(brand => brand.store_ids?.includes(storeId));
        if (currentBrand) {
            updateBrandMutation.mutate({
                brandId: currentBrand?.id ?? '',
                brandData: {
                    ...currentBrand, // Spread the existing brand data
                    store_ids: currentBrand.store_ids?.filter(id => id !== storeId) ?? [] // Update only the store_ids field
                }
            });
        }
    }

    const handleMenuClick = (brand: Brand, buttonName: string) => {
        switch (buttonName) {
            case 'edit':
                if (brand.id) {
                    router.push(`/brands/${brand.id}`);
                }
                break;
            default:
                console.error('Unknown action');
        }
    };

    const menuItems = [
        { name: 'edit', label: 'Edit Brand' },
    ];

    return (
        <TitleComponent className='mt-4' leftTitle='Organization' centerTitle={org?.name} rightTitle={org?.id ?? ''} >
            <div className="grid grid-cols-3 gap-4 mt-6">
                {brandsLoading ? (
                    Array(3).fill(0).map((_, index) => <Skeleton key={index} height={150} />)
                ) : brands?.length ? (
                    brands.map((brand) => (

                        <TitleComponent
                            className='text-white'
                            leftTitle='Brand'
                            leftTitleIcon={<HexagonIcon />}
                            centerTitle={brand.name}
                            rightTitle={brand.id}
                            onMenuItemClick={(buttonName) => handleMenuClick(brand, buttonName)}
                            menuItems={menuItems}
                            menuPosition='bottom-right'
                        >

                            {/* Store Cards Display */}
                            <div className="mt-8">
                                {brand.store_ids?.map((storeId) => {
                                    const store = stores?.find(store => store?.id === storeId);
                                    return store ? (
                                        <StoreCard
                                            key={store?.id}
                                            store={store}
                                            onDelete={handleDeleteStore}
                                            brand={brand}
                                        />
                                    ) : (
                                        <div className="border border-black rounded-lg p-4 flex flex-col items-center justify-center" key={`skeleton-${storeId}`}>
                                            <p className="text-sm text-gray-500 mb-2">Waiting for store information...</p>
                                            <Skeleton height={100} width={200} />
                                            <p className="text-sm text-gray-500 mb-2">{"Store is not undefined, if it doesn't load, delete it"}</p>
                                            <p className="text-sm text-red-500 mt-2">{"If the store doesn't load, you can remove this placeholder."}</p>
                                            <Button className="mt-2 bg-red-500 hover:bg-red-700 text-white  py-2 px-4 rounded" onClick={() => removeStoreFromBrand(storeId)}>
                                                Remove Placeholder
                                            </Button>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Brand Image */}
                            <ImageHolder
                                imageUrl={brand.brand_image_url ?? ''}
                                onImageUrlChange={(newImageUrl) => {
                                    updateBrandMutation.mutate({
                                        brandId: brand?.id ?? '',
                                        brandData: { ...brand, brand_image_url: newImageUrl }
                                    });
                                }}
                            />
                        </TitleComponent>
                    ))
                ) : (
                    <p>No brands found.</p>
                )}
            </div>
        </TitleComponent>
    );
};

export default StorePage; 
