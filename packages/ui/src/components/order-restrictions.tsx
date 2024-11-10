'use client';

// packages/ui/src/components/budget-modal-editor.tsx
import React, { useState, ChangeEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface Budget {
	name: string;
	amount: number;
	description: string;
}

interface OrderRestrictionsModalEditorProps {
	budget: Budget;
	onSave: (budget: Budget) => void;
}

export const OrderRestrictions: React.FC<OrderRestrictionsModalEditorProps> = ({
	budget,
	onSave,
}) => {
	const [editedBudget, setEditedBudget] = useState<Budget>(budget);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setEditedBudget({
			...editedBudget,
			[name]: name === 'amount' ? parseFloat(value) : value,
		});
	};

	const handleSubmit = () => {
		onSave(editedBudget);
	};

	return (
		<div className='bg-white p-4 shadow rounded'>
			<h2 className='text-lg  mb-4'>Edit Budget</h2>
			<div className='mb-4'>
				<Label htmlFor='budget-name'>Budget Name</Label>
				<Input
					id='budget-name'
					name='name'
					value={editedBudget.name}
					onChange={handleInputChange}
					className='border p-2 w-full'
				/>
			</div>
			<div className='mb-4'>
				<Label htmlFor='budget-amount'>Budget Amount</Label>
				<Input
					id='budget-amount'
					name='amount'
					type='number'
					value={editedBudget.amount.toString()}
					onChange={handleInputChange}
					className='border p-2 w-full'
				/>
			</div>
			<div className='mb-4'>
				<Label htmlFor='budget-description'>Description</Label>
				<Input
					id='budget-description'
					name='description'
					value={editedBudget.description}
					onChange={handleInputChange}
					className='border p-2 w-full'
				/>
			</div>
			<Button
				onClick={handleSubmit}
				className='bg-blue-500 text-white p-2 rounded'
			>
				Save Changes
			</Button>
		</div>
	);
};
