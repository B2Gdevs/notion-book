'use client';

import React, { useState } from 'react';
import { Budget, BudgetFrequency, BudgetSchedule, BudgetType, DAYS_OF_WEEK } from '../models/orgModels';
import { Collapsible } from './collapsible';
import ExitHeader from './exit-header';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './checkbox';

interface BudgetModalProps {
	text?: string;
	backText?: string;
	budget?: Budget;
	onExit?: () => void;
	onBack?: () => void;
	onSave?: (budget: Budget, budgetSchedule: BudgetSchedule) => void;
	budgetSchedule?: BudgetSchedule;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
	budget,
	onExit,
	onBack,
	onSave,
	budgetSchedule,
}) => {
	const { name = '', amount = '' } = budget || {};

	const [budgetName, setBudgetName] = useState<string>(name || '');
	const [budgetAmount, setBudgetAmount] = useState<string>(amount.toString());
	const [localBudgetSchedule, setLocalBudgetSchedule] = useState<BudgetSchedule>(budgetSchedule || {
		Monday: false,
		Tuesday: false,
		Wednesday: false,
		Thursday: false,
		Friday: false,
		Saturday: false,
		Sunday: false,
	});

	const handleCheckboxChange = (day: keyof BudgetSchedule) => {
		setLocalBudgetSchedule(prev => ({
			...prev,
			[day]: !prev[day],
		}));
	};

	return (
		<div className='px-5'>
			<ExitHeader
				className='flex flex-1 flex-row justify-between items-center pb-2'
				onExit={onExit}
				onBack={onBack}
			/>

			{/* Budget Details */}
			<Collapsible
				className='w-full mt-2'
				stepHeaderProps={{ text: 'Budget Details', step: '' }}
				expanded={true}
			>
				<div className='w-full px-4 space-y-4'>
					{/* Budget Name */}
					<div className='pt-4 space-y-2'>
						<Label className="text-primary-spinach-green font-righteous ">
							Budget Name
						</Label>
						<Input
							type='text'
							className="w-full h-12 rounded-xl bg-primary-off-white font-sans focus-visible:ring-primary-spinach-green bg-white"
							placeholder='Budget Name'
							value={budgetName}
							onChange={(e) => setBudgetName(e.target.value)}
						/>
					</div>
					{/* Budget Amount */}
					<div className='space-y-2'>
						<Label className="text-primary-spinach-green font-righteous">
							Budget Amount{' '}
							<span className='text-xs'>
								(set the limit per day for this budget)
							</span>
						</Label>
						<div className='relative'>
							<span className='absolute left-2 top-1/2 transform -translate-y-1/2'>
								$
							</span>
							<Input
								type='number'
								className="w-full h-12 rounded-xl bg-primary-off-white font-sans focus-visible:ring-primary-spinach-green bg-white pl-6"
								placeholder='Budget Amount'
								value={budgetAmount}
								onChange={(e) => setBudgetAmount(e.target.value)}
							/>
						</div>
					</div>
					{/* Budget Schedule */}
					<div className='space-y-2'>
						<Label className="text-primary-spinach-green font-righteous">
							Days Employee Stipend Applied
						</Label>
						{budgetSchedule && (
							<div className='grid grid-cols-2 gap-2'>
								{DAYS_OF_WEEK.map(day => (
									<Checkbox
										key={day}
										text={day}
										checked={localBudgetSchedule[day as keyof BudgetSchedule]}
										onClick={() => handleCheckboxChange(day as keyof BudgetSchedule)}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</Collapsible>

			<div className='w-full flex justify-center my-4'>
				{/* Save Button */}
				<Button
					variant='default'
					className='text-white bg-primary-spinach-green'
					onClick={() => {
						if (onSave) {
							// Save Budget Details Info
							const updatedBudget: Budget = {
								id: budget?.id || '', // Assuming you want to keep the same ID if editing
								name: budgetName,
								description: '', // Assuming you might fill this in later or elsewhere
								amount: parseFloat(budgetAmount), // Convert the string to a number
								userIds: budget?.userIds || [], // Assuming you want to keep the same user IDs if editing
								type: BudgetType.RECURRING, // Assuming you might fill this in later or elsewhere
								frequency: BudgetFrequency.DAILY,
							};

							onSave(updatedBudget, localBudgetSchedule);
						}
					}}
				>
					Save
				</Button>
			</div>
		</div>
	);
};
