// apps/bastion/src/app/couriers/courier-list-page.tsx
'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ColorfullCourier, CourierList } from 'ui';
import { useGetCouriers } from 'ui';

const CourierListPage: React.FC = () => {
	const {
		data: couriers,
	} = useGetCouriers({ page: 1, pageSize: 100 });
	const router = useRouter();

	const handleSelectCourier = (courier: ColorfullCourier) => {
		// Define what happens when a courier is selected, e.g., navigate to the detail page
		router.push(`/couriers/${courier.id}`);
	};

	return (
		<div className='m-8 relative'>
			<h1 className='text-4xl mb-6'>Courier List</h1>
			<CourierList couriers={couriers ?? []} onSelect={handleSelectCourier} />
		</div>
	);
};

export default CourierListPage;
