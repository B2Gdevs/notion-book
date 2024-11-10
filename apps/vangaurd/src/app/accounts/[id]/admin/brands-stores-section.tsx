'use client'

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react'; // Ensure useEffect is imported
import { Brand, Button, PageTitleDisplay, PageWrapper, Store, useGetBrandsByIds, useGetOrgsByQuery, useGetStoresByIds } from 'ui';
import { StoreLayout } from './StoreLayout';
import { BrandSelector } from './brand-selector';

export const BrandsAndStoresSection = () => {
    const params = useParams();
    const orgClerkId = (params.id || params.orgId) as string;

    const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(undefined);

    const { data: org } = useGetOrgsByQuery({
        externalId: orgClerkId,
    });
    const { data: brands, isLoading: brandsLoading } = useGetBrandsByIds(org?.[0]?.brand_ids ?? []);
// filter out brands that do not have store_ids
    const filteredBrands = brands?.filter((brand) => brand.store_ids.length > 0);

    const { data: stores } = useGetStoresByIds(selectedBrand?.store_ids ?? []);

    useEffect(() => {
        setInitialSelectedBrand();
    }, [brands, brandsLoading]);

    const setInitialSelectedBrand = () => {
        if (!brandsLoading && (brands?.length ?? 0) > 0) {
            setSelectedBrand(filteredBrands?.[0]);
        }
    };
  const validStores = (stores || []).filter((store): store is Store => Boolean(store));

    return (
        <PageWrapper className='bg-white w-full border-2 border-black rounded-lg'>
            <PageTitleDisplay additionalText={org?.[0]?.name} overrideTitle='Brands' />
            <div className="space-y-6 py-6">
                <>
                    <BrandSelector
                        selectedBrand={selectedBrand}
                        className='w-full text-lg bg-white border-b-2 '
                        brands={filteredBrands ?? []}
                        onBrandSelect={(brand: Brand): void => {
                            setSelectedBrand(brand);
                        }}
                    />
                    <StoreLayout brand={selectedBrand} stores={validStores ?? []} />

                    <div className="bg-secondary-creamer-beige p-6 rounded-2xl flex flex-col justify-start items-start">
                        <div className="text-lg  font-righteous">Connect each Store to Otter</div>
                        <div>When your store is connected, publishing menus in Otter will send them to that store.</div>
                    </div>
                </>
            </div>

            <div className='bg-secondary-creamer-beige p-6 flex flex-col justify-start items-start gap-2 rounded-2xl'>
                <h2 className='font-righteous text-lg'>Publish Menu</h2>
                
                <div className='font-sans'>{"Navigate to TryOtter Menu Manager and click “Publish”. Publishing may take some time. If it doesn't update immediately or fails, don't worry; we can usually still access your menu."}</div>
                <Button>
                <a href="https://manager.tryotter.com/menus/brand" target="_blank" rel="noopener noreferrer">TryOtter Menu Manager</a>
                </Button>
                <img
                    className="rounded-lg"
                    src="https://res.cloudinary.com/dzmqies6h/image/upload/v1708121471/vangaurd_assets/Frame_ogqabj.png"
                />
            </div>
        </PageWrapper>
    );
};