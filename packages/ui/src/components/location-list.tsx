'use client';

import { Label } from '@radix-ui/react-label';
import { Home, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ColorfullLocation } from '../models/orgModels';
import { AreaSelect } from './area-select';
import { Checkbox } from './checkbox';
import { GoogleAddressInput } from './google-address-input';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface LocationListProps {
	locations: ColorfullLocation[];
	onLocationsChange?: (locations: ColorfullLocation[]) => void;
	onIsServedToggle?: (index: number, isServed: boolean) => void; // Function prop for is_served toggle
}

export const LocationList: React.FC<LocationListProps> = ({
	locations,
	onLocationsChange,
	onIsServedToggle, // Destructure the new prop
}) => {
	const [localLocations, setLocalLocations] = useState<ColorfullLocation[]>(locations);
	const [newAddress, setNewAddress] = useState('');
	// set new coordinates
	const [newLatitude, setNewLatitude] = useState<number>();
	const [newLongitude, setNewLongitude] = useState<number>();

	useEffect(() => {
		setLocalLocations(locations);
	}, [locations]);

	useEffect(() => {
		onLocationsChange?.(localLocations);
	}, [localLocations, onLocationsChange]);

	const handleDelete = (index: number) => {
		const updatedLocations = localLocations.filter((_, i) => i !== index);
		setLocalLocations(updatedLocations);
	};

	const handleAddLocation = () => {
		if (newAddress) {
			const newLocation = {
				address: newAddress,
				is_served: true,
				latitude: newLatitude ?? 0,
				longitude: newLongitude ?? 0,
				area_id: undefined,
			};
			setLocalLocations([...localLocations, newLocation]);
			setNewAddress('');
		}
	};
	const handleAreaChange = (index: number, areaId: string) => {
		const updatedLocations = localLocations.map((location, i) =>
			i === index ? { ...location, area_id: areaId } : location,
		);
		setLocalLocations(updatedLocations);
	};

	const handleIsServedChange = (index: number, isServed: boolean) => {
		const updatedLocations = localLocations.map((location, i) =>
			i === index ? { ...location, is_served: isServed } : location,
		);
		setLocalLocations(updatedLocations);
		onIsServedToggle?.(index, isServed); // Call the function prop with the new is_served value
	};

	return (
		<>
			<div className='mb-4'>
				<GoogleAddressInput
					address={newAddress}
					className='mb-2'
					onChange={(details) => {
						setNewAddress(details.address);
						setNewLatitude(details.latitude);
						setNewLongitude(details.longitude);
					}}
				/>
				<Button onClick={handleAddLocation}>Add Location</Button>
			</div>

			<div className='font-righteous text-xl underline border-b-2 border-black mb-4'>
				Org Locations
			</div>

			<div className='flex flex-col my-2 lg:grid lg:grid-cols-2 gap-4 overflow-x-auto'>
				{localLocations.map((location, index) => (
					<div
						key={index} // Assuming `location` has a unique `id` field
						className='flex flex-col items-start p-4 border rounded space-y-2'
					>
						<div className='flex items-center justify-between w-full'>
							<div className='flex items-center space-x-2'>
								<Home className='text-xl' />
								<Label className='font-righteous'>Location {index + 1}</Label>
							</div>
							<button
								onClick={() => handleDelete(index)}
								className='p-1 rounded hover:bg-gray-200'
							>
								<Trash2 className='text-xl text-red-500' />
							</button>
						</div>
						<div className="flex items-center space-x-2"> {/* Flex container for horizontal alignment */}
							<Checkbox
								checked={location.is_served}
								onClick={() => handleIsServedChange?.(index, !location.is_served)}
							/>
							<Label className='text-sm font-medium'>
								Served
							</Label>
						</div>
						<Input
							type='text'
							value={location.address}
							disabled
							className='w-full bg-gray-200 cursor-not-allowed'
						/>
						<AreaSelect
							selectedAreaId={location.area_id ?? ''}
							onChange={(areaId) => handleAreaChange(index, areaId)}
						/>
						<div className='w-full'>
							<Label className='font-righteous'>Delivery Instructions</Label>
							<div className='text-gray-400 italic text-sm my-2'>If necessary, please add specific instructions for our delivery drivers to ensure timely deliveries of your meals.</div>
							<Textarea
								value={location.delivery_instructions ?? ''}
								onChange={(e) => {
									const updatedLocations = localLocations.map((loc, i) =>
										i === index ? { ...loc, delivery_instructions: e.target.value } : loc,
									);
									setLocalLocations(updatedLocations);
								}}
								className='w-full'
							/>
						</div>
					</div>
				))}
			</div>

		</>
	);
};
