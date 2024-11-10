'use client';
// UI components
import {
	BagLoader,
	Budget,
	BudgetDisplay,
	BudgetModal,
	Dialog,
	DialogContent,
	Org,
	PaymentButton,
	SectionList,
	useGetOrgsByQuery,
	useToast,
	useUpdateOrg
} from 'ui';

// React
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { PageWrapper } from 'ui';

export default function Page() {
    const params = useParams();
    const orgClerkId = params.id as string;
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();
    const { data: orgs, isLoading } = useGetOrgsByQuery({ externalId: orgClerkId });
    const updateOrgMutation = useUpdateOrg({
        onSuccess: () => {
            toast({
                title: 'Budget Updated',
                description: 'The budget was updated successfully',
            });
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'There was an error updating the budget',
            });
        },
    });
    const org = orgs?.[0] as Org;

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    if (isLoading) {
        return <BagLoader />;
    }

	return (
		<>
			<PageWrapper className='bg-white items-left min-h-screen overflow-y-auto'>
				<div className='w-full justify-between items-center p-5 border-b-2'>
					<span className="text-2xl text-primary-spinach-green font-righteous">
						Create a Budget
					</span>
				</div>
				<SectionList>
					<BudgetDisplay 
					budget={org?.budget ?? ({} as Budget)} 
					budgetSchedule={org?.budget_schedule}
					/>
					<PaymentButton
						className={'mt-16'}
						label={'Edit Budget'}
						onClick={() => {
							setDialogOpen(!isDialogOpen);
						}}
					/>

					{/* Control the Dialog's visibility with isOpen and onClose */}
					<Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
						<DialogContent className='bg-secondary-creamer-beige overflow-y-auto max-h-[80vh] w-full'>
							<BudgetModal
								budget={org?.budget}
								budgetSchedule={org?.budget_schedule}
								onSave={(budget, budgetSchedule) => {
									if (!org?.id) {
										console.error('No org found');
										return;
									}
									org.budget = budget;
									org.budget_schedule = budgetSchedule;
									updateOrgMutation.mutate({
										...org,
										budget: budget,
										budget_schedule: budgetSchedule
									});
									setDialogOpen(false);
									toast({
										title: 'Budget Updated',
										description: `We updated budget ${org.budget.name}`,
									});
								}}
							/>
						</DialogContent>
					</Dialog>
				</SectionList>
			</PageWrapper>
		</>
	);
}
