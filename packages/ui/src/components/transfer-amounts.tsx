import React from 'react';
import { CurrencyFormat, DeliveryJobTotal, PaymentStatus, toast, useGetOrgsByIds, useTransferAmountsToRestaurantsForJobs, useUpdateDeliveryJobTotal } from '..';
import { DualColumnLayout } from './dual-column-layout';
import { SummaryItemProps } from './summary-section';
import { PaymentStatusSelect } from './payment-status-select';

interface TransferAmountsProps {
    restaurantTransferAmounts: Record<string, number>;
    jobTotal?: DeliveryJobTotal;
}

export const TransferAmounts: React.FC<TransferAmountsProps> = ({ restaurantTransferAmounts, jobTotal }) => {
    const orgIds = Object.keys(restaurantTransferAmounts);
    const { data: orgs } = useGetOrgsByIds(orgIds);

    const updateJobTotalMutation = useUpdateDeliveryJobTotal({
        onSuccess: () => {
            toast({
                title: 'Job Total Updated',
                description: `Job total ${jobTotal?.id} updated successfully`,
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error updating job total ${jobTotal?.id}: ${error}`,
                duration: 5000,
            });
        },
    
    })

const handleUpdateJobTotalPaymentStatus = (paymentStatus: PaymentStatus) => {
    const updatedJobTotal = { 
        ...jobTotal, 
        subtotal: jobTotal?.subtotal ?? 0,
        num_orders: jobTotal?.num_orders ?? 0,
        currency_format: jobTotal?.currency_format ?? CurrencyFormat.DOLLARS
    };
    updatedJobTotal.payment_status = paymentStatus;
    updateJobTotalMutation.mutate({
        deliveryJobTotalId: jobTotal?.id ?? '',
        deliveryJobTotalData: updatedJobTotal
    });
}

    const handleTransfersToRestaurants = () => {
        transferAmountsMutation.mutate([jobTotal?.job_id ?? '']);
    };
    const transferAmountsMutation = useTransferAmountsToRestaurantsForJobs({
        onSuccess: () => {
            toast({
                title: 'Transfer Successful',
                description: `Amounts transferred to restaurants successfully`,
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error transferring amounts to restaurants: ${error}`,
                duration: 5000,
            })
        },
    });

    const leftColumnItems: SummaryItemProps[] = orgIds.map(orgId => {
        const amount = restaurantTransferAmounts[orgId];
        const orgDetails = orgs?.find(org => org.id === orgId);
        return {
            title: orgDetails?.name || 'Unknown Org',
            value: `$${amount.toFixed(2)}`,
            description: `Transfer amount for ${orgDetails?.name || 'Unknown Org'}`
        };
    });

    const summaryItems: SummaryItemProps[] = [
        {
            title: "Total Transfers",
            value: `${Object.values(restaurantTransferAmounts).reduce((acc, val) => acc + val, 0).toFixed(2)}`,
            description: "Total amount transferred to all organizations.",
            action: handleTransfersToRestaurants,
            actionDisplayText: 'Transfer To Restaurants',
            isActionActive: jobTotal?.payment_status !== PaymentStatus.TRANSFERRED && jobTotal?.payment_status === PaymentStatus.PAID
        },
        {
            title: "Number of Orgs",
            description: "Number of organizations involved in the transfers.",
            valueComponent: <span className='text-2xl font-righteous p-5 bg-primary-almost-black'>{orgIds.length}</span>
        },
        {
            title: "Transfer Status",
            description: jobTotal?.payment_status !== PaymentStatus.TRANSFERRED ? 'Not Transferred' : 'Transferred',
            valueComponent:
            <div className='w-48 col-span-1 text-black'>
                <PaymentStatusSelect
                    initialStatus={jobTotal?.payment_status}
                    onChange={handleUpdateJobTotalPaymentStatus}
                />
                <span className='text-xs text-red-500'>Warning: Only change the status if you are certain there is an error.</span>
            </div>
        }
    ];

    return (
        <DualColumnLayout
            reverseColumns={true}
            className='bg-black'
            leftTitle="Restaurant Transfer Amounts"
            leftColumnSummaryItems={leftColumnItems}
            rightColumnSummaryItems={summaryItems}
            childrenPosition='above'
            useContextMenu={true}
        />
    );
};