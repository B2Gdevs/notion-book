'use client';

import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from 'ui';
import ItemList from '../../../../../../../components/menu-item-list';

const StoreComponent: React.FC = () => {
	const params = useParams();
	const orgId = params.id as string;
	const menuId = params.menuId as string;
	const storeId = params.storeId as string;
	const router = useRouter();

	return (
		<div>
			<Button
				className='mt-2'
				onClick={() => {
					router.push(
						`/orgs/${orgId}/stores/${storeId}/menus/${menuId}/items/new`,
					);
				}}
			>
				Add an Item
			</Button>
			<ItemList
				storeId={storeId}
			/>
		</div>
	);
};

export default StoreComponent;
