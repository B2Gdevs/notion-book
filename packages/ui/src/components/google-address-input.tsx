'use client';

import { LoadScript } from '@react-google-maps/api';
import React from 'react';
import GooglePlacesAutocomplete, {
	geocodeByPlaceId,
} from 'react-google-places-autocomplete';
import { Label } from './ui/label';

const MAPS_API_KEY = process.env.NEXT_PUBLIC_MAPS_API_KEY;
const libraries = ['places'];

export interface AddressDetails {
	address: string;
	latitude: number;
	longitude: number;
}

interface GoogleAddressInputProps {
	className?: string;
	address?: string;
	onChange?: (value: AddressDetails) => void;
}

export const GoogleAddressInput: React.FC<GoogleAddressInputProps> = ({
	className,
	onChange,
	address,
}) => {
	const handlePlaceSelect = async (selectedOption: any) => {
		if (selectedOption && selectedOption.value) {
			try {
				const results = await geocodeByPlaceId(selectedOption.value.place_id);
				const { lat, lng } = results[0].geometry.location;
				const addressDetails = {
					address: selectedOption.label,
					latitude: lat(),
					longitude: lng(),
				};
				onChange && onChange(addressDetails);
			} catch (error) {
				console.error('Error fetching place details:', error);
			}
		}
	};

	return (
		<div className={className}>
			<Label>Address</Label>
			<LoadScript
				googleMapsApiKey={MAPS_API_KEY ?? ''}
				libraries={libraries as any}
			>
				<GooglePlacesAutocomplete
					apiKey={MAPS_API_KEY}
					selectProps={{
						value: { label: address ?? '', value: address ?? '' },
						onChange: handlePlaceSelect,
					}}
				/>
			</LoadScript>
		</div>
	);
};
