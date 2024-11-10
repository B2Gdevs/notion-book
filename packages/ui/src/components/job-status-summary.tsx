import React from 'react';
import { CurrencyFormat, DeliveryJob, DeliveryJobStatus, DeliveryJobTotal, Org, PaymentStatus, toast, useUpdateDeliveryJob, useUpdateDeliveryJobTotal } from '..';
import { DeliveryJobStatusSelect } from './deliveryjob-status-select';
import { DualColumnLayout } from './dual-column-layout';
import { PaymentStatusSelect } from './payment-status-select';
import { SummaryItemProps } from './summary-section';

interface JobStatusSummaryProps {
    job?: DeliveryJob;
    jobTotal?: DeliveryJobTotal;
    org?: Org;
    onStatusChange?: () => void; // Callback for when status changes
}

export const JobStatusSummary: React.FC<JobStatusSummaryProps> = ({ job, jobTotal, org, onStatusChange }) => {


    const updateJobMutation = useUpdateDeliveryJob({
        onSuccess: () => {
            toast({
                title: 'Job Updated',
                description: `Job ${job?.id} status updated successfully`,
                duration: 5000,
            });
            onStatusChange?.();
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error updating job ${job?.id}: ${error}`,
                duration: 5000,
            });
        },
    });

    const updateJobTotalMutation = useUpdateDeliveryJobTotal({
        onSuccess: () => {
            toast({
                title: 'Job Total Updated',
                description: `Job total ${jobTotal?.id} status updated successfully`,
                duration: 5000,
            });
            onStatusChange?.();
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error updating job total ${jobTotal?.id}: ${error}`,
                duration: 5000,
            });
        },
    });

    const handleStatusChange = (newStatus: DeliveryJobStatus) => {
        if (job?.id && newStatus) {
            updateJobMutation.mutate({
                deliveryJobId: job.id,
                deliveryJobData: { ...job, status: newStatus },
            });
        }
    };

    const handlePaymentStatusChange = (newStatus: string) => {
        if (job?.id) {
            if (newStatus) {
                const jobData = {
                    ...job,
                    payment_status: newStatus as PaymentStatus
                };

                const jobTotalData = {
                    ...(jobTotal ?? {}),
                    payment_status: newStatus as PaymentStatus,
                    subtotal: jobTotal?.subtotal ?? 0,
                    num_orders: jobTotal?.num_orders ?? 0,
                    currency_format: jobTotal?.currency_format ?? CurrencyFormat.DOLLARS,
                };

                updateJobMutation.mutate({
                    deliveryJobId: job.id,
                    deliveryJobData: jobData,
                });

                updateJobTotalMutation.mutate({
                    deliveryJobTotalId: jobTotal?.id || '',
                    deliveryJobTotalData: jobTotalData,
                });
            }
        }
    };

    const jobStatusItem: SummaryItemProps = {
        title: "Job Status",
        description: "Current status of the job",
        actionDisplayText: "Change Status",
        valueComponent: <DeliveryJobStatusSelect
            initialStatus={job?.status}
            onChange={handleStatusChange} />
    };

    const paymentStatusItem: SummaryItemProps = {
        title: "Payment Status",
        description: "Current payment status of the job",
        valueComponent: (
            <div className='w-48 col-span-1'>
                <PaymentStatusSelect
                    initialStatus={jobTotal?.payment_status}
                    onChange={handlePaymentStatusChange}
                />
                <span className='text-xs text-red-500'>Warning: Only change the status if you are certain there is an error.</span>
            </div>),
        actionDisplayText: "Mark as Paid"
    };

    const orgItem: SummaryItemProps = {
        title: "Organization",
        description: "Organization responsible for the job",
        valueComponent: (
            <div className='flex items-center gap-2'>
                <span>{org?.name}</span>
            </div>
        )
    };

    const deliveryDateItem: SummaryItemProps = {
        title: "Delivery Date",
        description: "Scheduled delivery date for the job",
        valueComponent: (
            <div className='flex items-center gap-2'>
                <span>{new Date(job?.delivery_date || '').toLocaleDateString()}</span>
            </div>
        )
    };

    const leftColumnItems = [jobStatusItem, paymentStatusItem];
    const rightColumnItems = [orgItem, deliveryDateItem];

    return (
        <DualColumnLayout
            leftTitle="Job Status Details"
            leftColumnSummaryItems={leftColumnItems}
            rightColumnSummaryItems={rightColumnItems}
            leftColumnVariant="compact"
            rightColumnVariant="detailed"
        />
    );
};