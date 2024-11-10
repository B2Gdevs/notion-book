// packages/ui/src/components/courier-list.tsx
'use client';

import { Edit2, Layers, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useCreateCourier, useDeleteCourier } from '../hooks/courierHooks';
import { ColorfullCourier } from '../models/courierModels';
import { ConfirmationDialog } from './confirmation-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';
import { AreaSelect } from './area-select';
import { Org, OrgType, useGetOrgsByQuery } from '..';

interface CourierListProps {
	couriers: ColorfullCourier[];
	onSelect?: (courier: ColorfullCourier) => void;
	onCourierDelete?: (courierId: string) => void;
	onChanges?: (couriers: ColorfullCourier[]) => void;
}

export const CourierList: React.FC<CourierListProps> = ({
	couriers,
	onSelect,
	onCourierDelete,
	onChanges,
}) => {
	const [newCourierFirstName, setNewCourierFirstName] = useState('');
	const [newCourierLastName, setNewCourierLastName] = useState('');
	const [newCourierEmail, setNewCourierEmail] = useState('');
	const [selectedAreaId, setSelectedAreaId] = useState<string>();
	const [localCouriers, setLocalCouriers] = useState(couriers);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [courierToDelete, setCourierToDelete] =
		useState<ColorfullCourier | null>(null);
	// Add a new state to hold the mapping of couriers to their preferred organizations
	const [courierOrgsMap, setCourierOrgsMap] = useState<Map<string, { orgName: string, priority: number }[]>>(new Map());

	// Get all orgs with OrgType of RECIPIENT
	const { data: orgs } = useGetOrgsByQuery({
		page: 1,
		pageSize: 1000,
		orgType: OrgType.RECIPIENT,
	});

	useEffect(() => {
		setLocalCouriers(couriers);
	}, [couriers]);

	// Update the mapping whenever orgs or localCouriers changes
	useEffect(() => {
		let isMounted = true; // Flag to track the mounted state of the component

		const updateCourierOrgsMap = () => {
			const newMap = new Map<string, { orgName: string, priority: number }[]>();
			orgs?.forEach((org: Org) => {
				org.preferred_courier_ids?.forEach((pc) => {
					if (newMap.has(pc.courier_id)) {
						newMap.get(pc.courier_id)?.push({ orgName: org.name, priority: pc.priority });
					} else {
						newMap.set(pc.courier_id, [{ orgName: org.name, priority: pc.priority }]);
					}
				});
			});
			if (isMounted) {
				setCourierOrgsMap(newMap);
			}
		};

		updateCourierOrgsMap();

		return () => {
			isMounted = false; // Set the flag to false when the component unmounts
		};
	}, [orgs, localCouriers]);

	const createCourierMutation = useCreateCourier({
		onSuccess: (courierData: ColorfullCourier) => {
			setLocalCouriers([...localCouriers, courierData]);
			onChanges?.([...localCouriers, courierData]);
			toast({
				title: 'Courier Created',
				description: 'Courier successfully created.',
				duration: 3000,
			});
		},
		onError: (error) => {
			console.error('Error creating courier:', error);
			toast({
				title: 'Courier Creation Error',
				description: 'Failed to create courier.',
				duration: 3000,
			});
		},
	});

	const deleteCourierMutation = useDeleteCourier({
		onSuccess: () => {
			if (courierToDelete) {
				const updatedCouriers = localCouriers.filter(
					(courier) => courier.id !== courierToDelete.id,
				);
				setLocalCouriers(updatedCouriers);
				onCourierDelete?.(courierToDelete?.id ?? '');
				onChanges?.(updatedCouriers);
				toast({
					title: 'Courier Deleted',
					description: 'Courier successfully deleted.',
					duration: 3000,
				});
			}
		},
		onError: (error) => {
			console.error('Error deleting courier:', error);
			toast({
				title: 'Courier Deletion Error',
				description: 'Failed to delete courier.',
				duration: 3000,
			});
		},
	});

	const handleAddCourier = () => {
		if (!newCourierFirstName || !newCourierLastName || !newCourierEmail || !selectedAreaId) {
			toast({
				title: 'Invalid Input',
				description: 'Please fill all fields to add a courier.',
				duration: 3000,
			});
			return;
		}
		createCourierMutation.mutate({
			first_name: newCourierFirstName,
			last_name: newCourierLastName,
			email: newCourierEmail,
			area_id: selectedAreaId,
			name: `${newCourierFirstName} ${newCourierLastName}`, // Optional: Combine first and last name into full name if needed elsewhere
		});
		setNewCourierFirstName('');
		setNewCourierLastName('');
		setNewCourierEmail('');
		setSelectedAreaId('');
	};

	const handleAreaChange = (areaId: string) => {
		setSelectedAreaId(areaId);
	}

	const handleDeleteClick = (courier: ColorfullCourier) => {
		setCourierToDelete(courier);
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = () => {
		if (courierToDelete) {
			deleteCourierMutation.mutate(courierToDelete?.id ?? '');
		}
		setIsDeleteDialogOpen(false);
	};

	return (
		<>
			<div className='mb-4 lg:w-1/2 '>
				<div className='flex justify-start items-start gap-2 mb-2'>
					<Input
						type='text'
						value={newCourierFirstName}
						onChange={(e) => setNewCourierFirstName(e.target.value)}
						placeholder='Enter courier first name'
					/>
					<Input
						type='text'
						value={newCourierLastName}
						onChange={(e) => setNewCourierLastName(e.target.value)}
						placeholder='Enter courier last name'
					/>
				</div>
				<div className='flex justify-start items-start gap-2 mb-2'>
					<Input
						type='text'
						value={newCourierEmail}
						onChange={(e) => setNewCourierEmail(e.target.value)}
						placeholder='Enter courier email'
					/>
				</div>
				<div className='flex justify-start items-start gap-2 mb-2'>
					<AreaSelect
						selectedAreaId={selectedAreaId}
						selectTriggerTextOverride='Courier Area'
						onChange={handleAreaChange}
						disabled={false}
					/>
				</div>
				<Button onClick={handleAddCourier}>Add Courier</Button>
			</div>

			<div className='space-y-4'>
				{localCouriers.length > 0 ? (localCouriers.map((courier) => (
					<div
						key={courier.id}
						className='cursor-pointer p-4 rounded-lg shadow-md flex flex-col justify-start items-start w-full'
						onClick={() => onSelect?.(courier)}
					>
						<div className='flex justify-between items-center w-full'>
							<span className='font-righteous text-lg col-span-2'>
								{courier.first_name} {courier.last_name}
							</span>
							<div className='flex justify-end items-center space-x-4'>
								<span className='flex items-center'>
									<Layers className='mr-2' />{' '}
									{courier.current_batch_ids?.length || 0}
								</span>
								<Edit2
									// Add cursor-wait class to show funtionality not yet implemented
									className='text-gray-500 cursor-pointer opacity-50 cursor-wait'
									onClick={(event) => {
										event.stopPropagation();
										// Add your edit logic here
									}}
								/>
								<Trash2
									className='text-red-500 cursor-pointer'
									onClick={(event) => {
										event.stopPropagation();
										handleDeleteClick(courier);
									}}
								/>
							</div>
						</div>
						<div>
							<span className='text-lg font-medium '>
								Area: {courier.area_id}
							</span>
						</div>
						<div>
							{/* Display preferred organizations and their priorities */}
							<span className='text-lg underline'>
								Preferred Courier For Orgs:
							</span>
							{courier.id && courierOrgsMap.get(courier.id)?.map((org) => (
								<div key={org.orgName} className='ml-4'>
									{org?.orgName} (Priority: {org?.priority})
								</div>
							))}
						</div>
					</div>
				))) : (<div>No couriers found</div>)}
			</div>

			<ConfirmationDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={confirmDelete}
				message='Are you sure you want to delete this courier?'
			/>
		</>
	);
};
