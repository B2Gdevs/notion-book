import React from 'react';
import { useChargeCustomer } from '../hooks/integrations/stripeHooks';
import { Button } from './ui/button'; // Assuming Button component exists
import { toast } from './ui/use-toast';

interface AmountOwedComponentProps {
    amountOwed: number;
    paymentMethodId?: string;
    stripeAccountId: string;
}

export const AmountOwedComponent: React.FC<AmountOwedComponentProps> = ({ 
    amountOwed, 
    paymentMethodId, 
    stripeAccountId 
}) => {
    const amountOwedInCents = amountOwed * 100;
    const { mutate: chargeCustomer, isLoading } = useChargeCustomer({
        onSuccess: () => {
            toast({
                title: 'Charge Successful',
                description: 'The payment was successfully processed.',
                duration: 3000,
            });
        },
        onError: () => {
            toast({
                title: 'Charge Failed',
                description: 'Failed to process the payment. Please try again.',
                duration: 3000,
            });
        }
    });

    const handleCharge = () => {
        if (!paymentMethodId) {
            toast({
                title: 'No Payment Method',
                description: 'No payment method available for charging.',
                duration: 3000,
            });
            return;
        }
        chargeCustomer({
            stripeAccountId,
            amountOwedInCents,
            paymentMethodId,
            description: "Charge for owed amount"
        });
    };

    return (
        <div className="flex flex-col items-start bg-red-100 p-2 rounded shadow mb-4">
            <div className=" text-red-600">Amount Owed for Service</div>
            <div className="text-lg text-red-800">${amountOwed.toFixed(2)}</div>
            {paymentMethodId ? (
                <Button onClick={handleCharge} disabled={isLoading}>Pay Amount Owed</Button>
            ) : (
                <div className="text-red-600">Please set a valid default payment method.</div>
            )}
        </div>
    );
};