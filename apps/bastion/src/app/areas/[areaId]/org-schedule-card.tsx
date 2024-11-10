'use client';
import { useEffect, useState } from 'react';
import {
	Area,
	Button,
	Checkbox,
	CodeBlock,
	ConfirmationDialog,
	Label,
	LoweredDayOfWeek,
	ScheduledOrg,
	Store,
	StoreStateSelect,
	StoreStates,
	toast,
	useGetOrg,
	useUpdateArea,
	useUpdateStore
} from 'ui';
import StoreSelect from '../../components/store-select';


interface OrgScheduleCardProps {
	orgSchedule: ScheduledOrg;
	area: Area;
}

export function OrgScheduleCard({
	orgSchedule,
	area
}: OrgScheduleCardProps) {

	// State to manage the store schedules
	const [storeSchedules, setStoreSchedules] = useState<Record<string, LoweredDayOfWeek[]>>(orgSchedule.store_schedule?.schedules ?? {});
	const [brandSchedules, setBrandSchedules] = useState<Record<string, LoweredDayOfWeek[]>>(orgSchedule.store_schedule?.brand_schedules ?? {});
	const [selectedStore, setSelectedStore] = useState<Store | null>(null);
	const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false); // State for confirmation dialog visibility
	const [editStore, setEditStore] = useState<Store | null>(selectedStore ?? null); // Initialize with null

	// Fetching org and stores data
	const { data: org } = useGetOrg(orgSchedule.orgId);

	// Hook to update the area
	const { mutate: updateArea } = useUpdateArea({
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
			});
		},
	});
	// update store
	const { mutate: updateStore } = useUpdateStore({
		onSuccess: () => {
			toast({
				title: 'Store Updated',
				description: 'The store has been successfully updated.',
				duration: 3000,
			});
		},
		onError: (error) => {
			console.error('Error updating store:', error);
			toast({
				title: 'Error',
				description: 'Failed to update the store.',
				duration: 3000,
			});
		},
	});

	// Function to toggle day selection for a store
	const toggleDayForStore = (store: Store, day: LoweredDayOfWeek) => {
		const storeId = store?.id;
		const brandId = store.brand_id;
		if (!storeId) return;

		// Update store schedules
		const updatedStoreSchedules = { ...storeSchedules };
		updatedStoreSchedules[storeId] = updatedStoreSchedules[storeId] || [];
		if (updatedStoreSchedules[storeId].includes(day)) {
			updatedStoreSchedules[storeId] = updatedStoreSchedules[storeId].filter(d => d !== day);
		} else {
			updatedStoreSchedules[storeId].push(day);
		}
		setStoreSchedules(updatedStoreSchedules);

		// Check if brandId exists and update brand schedules similarly
		if (brandId) {
			const updatedBrandSchedules = { ...brandSchedules };
			updatedBrandSchedules[brandId] = updatedBrandSchedules[brandId] || [];
			if (updatedBrandSchedules[brandId].includes(day)) {
				updatedBrandSchedules[brandId] = updatedBrandSchedules[brandId].filter(d => d !== day);
			} else {
				updatedBrandSchedules[brandId].push(day);
			}
			setBrandSchedules(updatedBrandSchedules);
		}
	};

	// Function to handle saving the updated schedules
	const handleSave = () => {
		const updatedOrgSchedule = {
			...orgSchedule, store_schedule: {
				schedules: storeSchedules,
				brand_schedules: brandSchedules
			},
		};
		const updatedArea = { ...area };
		const orgIndex = updatedArea.schedule?.organizations.findIndex(o => o.orgId === orgSchedule.orgId);
		if (orgIndex !== undefined && orgIndex > -1 && updatedArea.schedule) {
			updatedArea.schedule.organizations[orgIndex] = updatedOrgSchedule;
			updateArea({ areaId: area?.id ?? '', area: updatedArea });
		}
	};

	const handleRemoveOrgFromSchedule = () => {
		// Close the dialog first
		setIsConfirmationDialogOpen(false);
		// Implement the logic to remove the organization from the schedule
		const updatedArea = { ...area, schedule: { ...area.schedule, organizations: area.schedule?.organizations.filter(o => o.orgId !== orgSchedule.orgId) ?? [] } };
		updateArea({ areaId: area?.id ?? '', area: updatedArea });
	};

	// New state for managing org loading text
	const [orgLoadingText, setOrgLoadingText] = useState('Loading...');

	useEffect(() => {
		const timer = setTimeout(() => {
			setOrgLoadingText('No longer exists');
		}, 3000);

		return () => clearTimeout(timer); // Cleanup the timer on component unmount
	}, []); // Empty dependency array means this effect runs once on mount

	useEffect(() => {
		setEditStore(selectedStore);
	}, [selectedStore]);

	return (
		<div className='border p-4 rounded-lg shadow-md space-y-4'>
			<div className='flex justify-between'>
				<h3 className='text-xl font-righteous'>
					Org: {org?.name ?? orgLoadingText}
				</h3>
				<div>
					<Label className='font-righteous mr-2'>Org ID:</Label>
					<CodeBlock className='ml-auto'>
						{orgSchedule.orgId}
					</CodeBlock>
				</div>
			</div>
			<Button className='bg-secondary-pink-salmon' onClick={() => setIsConfirmationDialogOpen(true)}>Remove from Schedule</Button>
			<ConfirmationDialog
				isOpen={isConfirmationDialogOpen}
				onClose={() => setIsConfirmationDialogOpen(false)}
				onConfirm={handleRemoveOrgFromSchedule}
				message="Are you sure you want to remove this organization from the schedule?"
			/>
			<div className='flex justify-between'>
				<h4 className='text-lg font-righteous'>Store</h4>
				<div>
					<Label className='font-righteous mr-2'>Selected Store:</Label>
					<CodeBlock className='ml-auto'>
						{selectedStore?.name}
					</CodeBlock>
				</div>
			</div>
			<StoreSelect
				storeIds={org?.store_ids ?? []}
				onSelect={(selectedStore) => {
					setSelectedStore(selectedStore);
				}}
			/>
			<div className='flex justify-between'>
				<h4 className='text-lg font-righteous'>Store State</h4>
				<div>
					<Label className='font-righteous mr-2'>Current State:</Label>
					<CodeBlock className='ml-auto'>
						{editStore?.store_state}
					</CodeBlock>
				</div>
			</div>
			<StoreStateSelect
				onChange={(value: string) => {
					if (!editStore) return;
					// Convert string to StoreState enum
					let storeState: StoreStates;
					const storeStateEnum = StoreStates[value as keyof typeof StoreStates];
					storeState = storeStateEnum ?? StoreStates.STORE_UNAVAILABLE;

					let updatedStore = { ...editStore, store_state: storeState };
					setEditStore(updatedStore);
					updateStore(updatedStore);
				}}
				value={editStore?.store_state ?? ''}
			/>
			{selectedStore && (
				<div key={selectedStore?.id} className='flex flex-col bg-slate-100 rounded-xl border-2 p-2'>
					<h4 className='underline mt-2 mb-2'>Days of week to be shown</h4>
					<div className='flex items-center space-x-5'>
						{(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as LoweredDayOfWeek[]).map(day => (
							<div key={day} className='flex items-center space-x-1'>
								<Checkbox
									value={day}
									checked={storeSchedules[selectedStore?.id ?? '']?.includes(day) ?? false}
									onClick={() => toggleDayForStore(selectedStore, day)}
								/>
								<Label className='text-sm font-medium'>
									{day.charAt(0).toUpperCase() + day.slice(1)}
								</Label>
							</div>
						))}
					</div>
				</div>
			)}
			<div className='flex justify-end space-x-4 mt-4'>
				<Button onClick={handleSave}>Save</Button>
			</div>
		</div>
	);
}