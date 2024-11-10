'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '..';
import { useUpdateOrg } from '../hooks/orgHooks';
import { Org } from '../models/orgModels';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Tax {
	name: string;
	rate: number;
	description: string;
}

interface TaxEditorProps {
	org: Org;
	className?: string;
}

// Define your areas and their corresponding tax rates
const areaTaxes = [
	{ area: 'Austin', rate: 0.0825 },
	// Add more areas and rates as needed
];

export const TaxEditor: React.FC<TaxEditorProps> = ({ org, className }) => {
	const [editedTax, setEditedTax] = useState<Tax>(() => {
		// Initialize editedTax with the first tax from the org or a default value if none exists
		return org.financial_details?.taxes?.[0] ?? {
			name: '',
			rate: 0, // Default rate if no tax is set
			description: '',
		};
	});

	useEffect(() => {
		// If org has at least one tax, set the first one as the editedTax
		if (org?.financial_details?.taxes?.length ?? 0 > 0) {
			setEditedTax(org?.financial_details?.taxes[0] ?? { name: '', rate: 0.0825, description: '' });
		}
	}, [org?.financial_details?.taxes]);

	const updateOrgMutation = useUpdateOrg();

	const handleSelectChange = (value: string) => {
		const selectedAreaTax = areaTaxes.find(areaTax => areaTax.area === value);
		if (selectedAreaTax) {
			const updatedTax = {
				...editedTax,
				name: selectedAreaTax.area,
				rate: selectedAreaTax.rate,
			};
			setEditedTax(updatedTax);

			// Immediately update the org with the new tax information
			const updatedFinancialDetails = {
				...org.financial_details,
				taxes: [updatedTax, ...(org.financial_details?.taxes.slice(1) ?? [])],
				serviceCharge: org.financial_details?.serviceCharge ?? 0,
				bank_name: org.financial_details?.bank_name ?? "",
				account_number: org.financial_details?.account_number ?? "",
				routing_number: org.financial_details?.routing_number ?? "",
			};

			updateOrgMutation.mutate({
				...org,
				financial_details: updatedFinancialDetails,
			});
		}
	};

	return (
		<div className={cn('bg-white p-4 shadow border-b-2 rounded-lg border-black', className)}>
			<div className='flex space-x-2'>

				<div className='mb-4'>
					<Label>Select Area</Label>
					<Select onValueChange={handleSelectChange}>
						<SelectTrigger aria-label='Area'>
							<SelectValue placeholder="Select an area" />
						</SelectTrigger>
						<SelectContent>
							{areaTaxes.map((areaTax) => (
								<SelectItem key={areaTax.area} value={areaTax.area}>{areaTax.area}</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className='mb-4'>
					<Label htmlFor='tax-rate'>Tax Rate</Label>
					<Input
						id='tax-rate'
						name='rate'
						type='number'
						value={editedTax.rate.toString()}
						onChange={(e) => setEditedTax({ ...editedTax, rate: parseFloat(e.target.value) })}
						className='border p-2 w-full'
					/>
				</div>
			</div>
		</div>
	);
};