'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Category } from 'ui';
import CategoryList from '../../../../../../../components/category-list';

const StoreComponent: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const orgId = params.id as string;
    const menuId = params.menuId as string;
    const storeId = params.storeId as string;

    return (
        <>
            <h3 className='border-b-2 border-black font-righteous text-2xl'>Categories</h3>

            <CategoryList storeId={storeId} onSelect={(category: Category) => {
                router.push(`/orgs/${orgId}/stores/${storeId}/menus/${menuId}/categories/${category.id}`)
            }} />
        </>
    );
};

export default StoreComponent;
