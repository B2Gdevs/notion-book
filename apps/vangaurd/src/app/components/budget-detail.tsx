import { useState } from 'react';
import {
  Budget,
  BudgetDisplay,
  BudgetModal,
  Dialog,
  DialogContent,
  Org,
  PaymentButton,
  toast,
  useUpdateOrg
} from 'ui';

interface BudgetDetailProps {
  org: Org;
  setOrg: (org: Org) => void;
}

export function BudgetDetail({ org, setOrg }: BudgetDetailProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const updateOrgMutation = useUpdateOrg({
    onSuccess: (orgResponse) => {
      toast({
        title: 'Budget Updated',
        description: 'The budget was updated successfully',
      });
      setDialogOpen(false);
      setOrg(orgResponse?.org as Org);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'There was an error updating the budget',
      });
    },
  });

  const handleSaveBudget = async (budget: Budget) => {
    if (!org?.id) {
      console.error('No org found');
      return;
    }

    try {
      await updateOrgMutation.mutateAsync({ ...org, budget });
    } catch (error) {
      console.error('Failed to update budget', error);
    }
  };

  // Handler to close the Dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <BudgetDisplay budget={org?.budget ?? ({} as Budget)} />
      <PaymentButton
        className={'mt-16'}
        label={'Edit Budget'}
        onClick={() => setDialogOpen(!isDialogOpen)}
      />
      {/* Control the Dialog's visibility with isOpen and onClose */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-secondary-creamer-beige overflow-y-auto max-h-[80vh] w-full">
          <BudgetModal
            budget={org?.budget}
            onSave={handleSaveBudget}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}