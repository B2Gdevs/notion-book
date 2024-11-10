'use client'

import { HexagonIcon, TrashIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Brand, CodeBlock, ImageHolder, ItemClassification, ItemClassificationSelect, TitleComponent, toast, useGetBrandById, useGetItemClassifications, useUpdateBrand } from 'ui';

export default function BrandDetailPage() {
    const params = useParams();
    const brandId = params.id as string;

    const { data: brand, isLoading: brandLoading } = useGetBrandById(brandId);
    const updateBrandMutation = useUpdateBrand({
        onSuccess: () => {
            toast({
                title: 'Area Updated',
                description: 'The area has been successfully updated.',
                duration: 3000,
            });
        },
        onError: (error) => {
            console.error('Error updating area:', error);
            toast({
                title: 'Error',
                description: 'Failed to update the area.',
                duration: 3000,
                variant: 'destructive',
            });
        },
    });
    const { data: itemClassifications } = useGetItemClassifications({
        ids: brand?.item_classification_ids.join(',')
    }, !!brand?.item_classification_ids.length);

    const handleItemClassificationChange = async (selectedItemClassification: ItemClassification) => {
        if (brand) {
            const updatedItemClassificationIds = brand.item_classification_ids.includes(selectedItemClassification?.id ?? '')
                ? brand.item_classification_ids.filter(id => id !== selectedItemClassification.id)
                : [...brand.item_classification_ids, selectedItemClassification.id];

            const updatedBrand: Brand = {
                ...brand,
                item_classification_ids: updatedItemClassificationIds as string[] ?? [],
            };

            await updateBrandMutation.mutateAsync({ brandId: brand.id as string, brandData: updatedBrand });
        }
    };

    const handleRemoveItemClassification = async (itemClassificationId: string) => {
        if (brand) {
            const updatedItemClassificationIds = brand.item_classification_ids.filter(id => id !== itemClassificationId);

            const updatedBrand: Brand = {
                ...brand,
                item_classification_ids: updatedItemClassificationIds,
            };

            await updateBrandMutation.mutateAsync({ brandId: brand.id as string, brandData: updatedBrand });
        }
    };

    if (brandLoading) return <div>Loading...</div>;

    return (
        <TitleComponent
            className='mt-4'
            leftTitle={`Brand`}
            leftTitleIcon={<HexagonIcon />}
            rightTitle={`${brand?.id}`}
            centerTitle={`Brand Name: ${brand?.name}`}
        >
            <TitleComponent leftTitle='Image' className='flex mt-4 space-x-4'>
                <div className='flex'>
                    {/* Brand Image */}
                    <ImageHolder
                        imageUrl={brand?.brand_image_url ?? ''}
                        onImageUrlChange={(newImageUrl) => {
                            if (!brand) return;

                            updateBrandMutation.mutate({
                                brandId: brand?.id ?? '',
                                brandData: { ...brand, brand_image_url: newImageUrl }
                            });
                        }}
                        className="mt-4"
                    />
                    {/* a description stating this is the image of th ebrand that will be shown to end users */}
                    <div className="mt-4 text-sm text-gray-500">This is the image of the brand that will be shown to end users.</div>
                </div>

            </TitleComponent>
            <div className="flex md:flex-row justify-between items-start md:items-center mt-4 space-x-4">
                <div>
                    <div>This adds a new classification or removes the same one if already applied.</div>
                <ItemClassificationSelect
                    className="w-1/4"
                    onChange={handleItemClassificationChange}
                />
                </div>
                <div className='w-full'>
                    <div className='text-2xl font-righteous underline'>
                        Current Item Classifications
                    </div>

                    <div className="flex items-center justify-between mt-4 p-2 bg-blue-500 text-white rounded-md">
                        <div>Tag</div>
                        <div>ID</div>
                        <div>Action</div>
                    </div>
                    {itemClassifications?.map((itemClassification, index) => (
                        <div
                            key={itemClassification.id}
                            className={`flex items-center justify-between mt-4 p-2 ${index % 2 === 0 ? 'bg-blue-400' : 'bg-blue-300'}`}
                        >
                            <div>{itemClassification.tag}</div>
                            <CodeBlock>{itemClassification.id}</CodeBlock>
                            <button onClick={() => handleRemoveItemClassification(itemClassification?.id ?? '')}>
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                </div>
            </div>


        </TitleComponent>
    );
}