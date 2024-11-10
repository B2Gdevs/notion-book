// packages/ui/src/components/courier-detail.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useGetAreas } from '../hooks/areaHooks';
import { useUpdateCourier } from '../hooks/courierHooks';
import { ColorfullCourier } from '../models/courierModels';
import { AreaSelect } from './area-select';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { OrgType, useGetOrgsByQuery } from '..';

interface CourierDetailProps {
	courier: ColorfullCourier;
}

export const CourierDetail: React.FC<CourierDetailProps> = ({ courier }) => {
	const [editableCourier, setEditableCourier] =
		useState<ColorfullCourier>(courier);
	const { data: areas } = useGetAreas();

	// Get all orgs with OrgType of RECIPIENT
	const { data: orgs } = useGetOrgsByQuery({
		page: 1,
		pageSize: 1000,
		orgType: OrgType.RECIPIENT,
	});
	
	const updateCourierMutation = useUpdateCourier();
	const { toast } = useToast();

	useEffect(() => {
		setEditableCourier(courier);
	}, [courier]);
	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setEditableCourier((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		updateCourierMutation.mutate(
			{
				courierId: editableCourier.id ?? '',
				courierData: editableCourier,
			},
			{
				onSuccess: () => {
					toast({
						title: 'Courier Updated',
						description: 'Courier has been updated successfully',
						duration: 3000,
					});
				},
				onError: (error) => {
					toast({
						title: 'Error',
						description: `Failed to update courier: ${error.message}`,
						duration: 3000,
					});
				},
			},
		);
	};

	const handleAreaChange = (areaId: string) => {
		const area_id = areaId;
		setEditableCourier((prev) => ({ ...prev, area_id }));
	};

	// Filter organizations where this courier is preferred
    const preferredOrgs = orgs?.filter(org => org.preferred_courier_ids?.some(pc => pc.courier_id === courier.id));

	return (
		<div className='p-4 rounded-lg shadow-md bg-white'>
			<h2 className='text-2xl font-medium text-gray-700 font-righteous mb-4'>
				Courier Details
			</h2>
			<div className='grid grid-cols-2 gap-4'>
				{/* Name */}
				<div>
					<Label
						htmlFor='first_name'
						className='block text-sm font-medium text-gray-700'
					>
						First Name
					</Label>
					<Input
						id='first_name'
						name='first_name'
						type='text'
						value={editableCourier.first_name || ''}
						onChange={handleInputChange}
						className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
					/>
				</div>
				<div>
					<Label
						htmlFor='last_name'
						className='block text-sm font-medium text-gray-700'
					>
						Last Name
					</Label>
					<Input
						id='last_name'
						name='last_name'
						type='text'
						value={editableCourier.last_name || ''}
						onChange={handleInputChange}
						className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
					/>
				</div>

				{/* Phone */}
				<div>
					<Label
						htmlFor='phone'
						className='block text-sm font-medium text-gray-700'
					>
						Phone
					</Label>
					<Input
						id='phone'
						name='phone'
						type='tel'
						value={editableCourier.phone || ''}
						onChange={handleInputChange}
						className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
					/>
				</div>

				{/* Email */}
				<div>
					<Label
						htmlFor='email'
						className='block text-sm font-medium text-gray-700'
					>
						Email
					</Label>
					<Input
						id='email'
						name='email'
						type='email'
						value={editableCourier.email || ''}
						onChange={handleInputChange}
						className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
					/>
				</div>

				{/* Area Select */}
				<div>
					<Label
						htmlFor='area'
						className='block text-sm font-medium text-gray-700'
					>
						Area
					</Label>
					<AreaSelect
						areas={areas ?? []}
						selectedAreaId={editableCourier.area_id ?? ''}
						onChange={handleAreaChange}
					/>
				</div>

				{/* Additional fields for ColorfullCourier properties */}
				{/* Add other input fields as needed based on the ColorfullCourier model */}
				{/* Example for 'order_capacity' */}
				<div>
					<Label
						htmlFor='order_capacity'
						className='block text-sm font-medium text-gray-700'
					>
						Order Capacity
					</Label>
					<Input
						id='order_capacity'
						name='order_capacity'
						type='number'
						value={editableCourier.order_capacity || ''}
						onChange={handleInputChange}
						className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
					/>
				</div>

				{/* Clerk ID */}
				<div>
					<Label
						htmlFor='clerk_id'
						className='block text-sm font-medium text-gray-700'
					>
						Clerk  ID
					</Label>
					<Input
						id='clerk_id'
						name='clerk_id'
						type='text'
						value={editableCourier.clerk_id || ''}
						onChange={handleInputChange}
						className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
					/>
				</div>

				{/* Stripe ID */}
				<div>
					<Label
						htmlFor='stripe_account_id'
						className='block text-sm font-medium text-gray-700'
					>
						Stripe Account ID
					</Label>
					<Input
						id='stripe_account_id'
						name='stripe_account_id'
						type='text'
						value={editableCourier.stripe_account_id || ''}
						onChange={handleInputChange}
						className='mt-1 block w-full border-gray-300 rounded-md shadow-sm'
					/>
				</div>

				<div>
					<Label>
						Preferred Courier For Orgs:
					</Label>
					<ul>
                        {preferredOrgs?.map(org => (
                            <li key={org.id}>
                                {org.name} (Priority: {org.preferred_courier_ids?.find(pc => pc.courier_id === courier.id)?.priority})
                            </li>
                        ))}
                    </ul>
				</div>

				{/* Example for 'status' */}
				{/* You can create a select dropdown for status similar to the area select */}

				{/* Save Button */}
				<div className='col-span-2'>
					<Button onClick={handleSave} className='mt-4'>
						Save
					</Button>
				</div>
			</div>
		</div>
	);
};
