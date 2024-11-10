import React from 'react';
import { Budget, BudgetSchedule, Checkbox, DAYS_OF_WEEK, StepHeader } from '..';
import { Label } from './ui/label';
import { TooltipProvider } from './ui/tooltip';

interface BudgetDisplayProps {
	budget: Budget;
	onExit?: () => void;
	budgetSchedule?: BudgetSchedule;
	isWithStepheader?: boolean;
}

export const BudgetDisplay: React.FC<BudgetDisplayProps> = ({ budget, budgetSchedule, isWithStepheader = true }) => {
	return (
		<TooltipProvider>
			{isWithStepheader && <StepHeader text='Budget Details' step='*' className={'border-b-2'} />}
			<div className='w-full px-4 grid grid-cols-2 gap-4'>
				{/* Budget Name */}
				<div className='space-y-2'>
					<Label className="text-primary-spinach-green font-righteous">
						Budget Name
					</Label>
					<div>{budget.name}</div>
				</div>
				{/* Budget Amount */}
				<div className='space-y-2'>
					<Label className="text-primary-spinach-green font-righteous">
						Budget Amount
					</Label>
					<div>$ {budget.amount}</div>
				</div>
				{/* Budget Frequency */}
				<div className='space-y-2'>
					<Label className="text-primary-spinach-green font-righteous">
						Budget Frequency
					</Label>
					<div>{budget.frequency}</div>
				</div>
				{/* Budget Schedule */}
				<div className='space-y-2'>
                    <Label className="text-primary-spinach-green font-righteous">
						Days Employee Stipend Applied
                    </Label>
                    {budgetSchedule && (
                        <div className='grid grid-cols-2 gap-2'>
                            {DAYS_OF_WEEK.map(day => (
                            <div key={day} className='flex items-center'>
                                <Checkbox
                                    checked={budgetSchedule ? budgetSchedule[day as keyof BudgetSchedule] : false}
                                    text={day}
                                    disabled={true}
                                />
                            </div>
                        ))}
                        </div>
                    )}
                </div>
			</div>
		</TooltipProvider>
	);
};
