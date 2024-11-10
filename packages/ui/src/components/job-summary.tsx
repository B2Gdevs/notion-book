'use client'

import { Scroll, SquareAsteriskIcon } from 'lucide-react';
import { useState } from 'react';
import { Button, ConfirmationDialog, DeliveryJob, Org, Textarea, TitleComponent, toast, useListPaymentMethods, useRefundJob, useUpdateDeliveryJob } from '..';
import { DeliveryJobTotal } from '../models/totalModels';
import { JobStatusSummary } from './job-status-summary';
import { JobTotalInvoiceSummary } from './job-total-invoice-summary';
import { RefundComponent } from './refund-component';
import { TransferAmounts } from './transfer-amounts';

interface JobSummaryProps {
    job?: DeliveryJob;
    jobTotal?: DeliveryJobTotal;
    org?: Org;
    onRefund?: () => void;
}

export const JobSummary: React.FC<JobSummaryProps> = ({ job, jobTotal, org, onRefund }) => {
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isConfirmDialogOpenForSubOrders, setIsConfirmDialogOpenForSubOrders] = useState(false);
    const [isNoteEdited, setIsNoteEdited] = useState(false);
    const [note, setNote] = useState(job?.note ?? ''); // [1

    const updateJobMutation = useUpdateDeliveryJob(
        {
            onSuccess: () => {
                toast({
                    title: 'Job Updated',
                    description: `Job ${job?.id} updated successfully`,
                    duration: 5000,
                });
            },
            onError: (error) => {
                console.error(`Error updating job ${job?.id}:`, error);
                toast({
                    title: 'Error',
                    description: `Error updating job ${job?.id}: ${error}`,
                    duration: 5000,
                });
            },
        }
    )

    const handleNoteChange = (note: string) => {
        setIsNoteEdited(true);
        setNote(note);
    }

    const handleUpdateJobNote = () => {
        if (!job) return;

        setIsNoteEdited(false);
        const updatedJob = { ...job };
        updatedJob.note = note;
        updateJobMutation.mutate({
            deliveryJobId: job?.id ?? '',
            deliveryJobData: updatedJob
        });
    }


    const refundJobMutation = useRefundJob({
        onSuccess: () => {
            setIsConfirmDialogOpen(false);
            toast({
                title: 'Job Refunded',
                description: `Job ${job?.id} refunded successfully`,
                duration: 5000,
            });
        },
        onError: (error) => {
            console.error(`Error refunding job ${job?.id}:`, error);
            toast({
                title: 'Error',
                description: `Error refunding job ${job?.id}: ${error}`,
                duration: 5000,
            });
        },
    });

    const handleRefund = () => {
        if (job?.id) {
            refundJobMutation.mutate({ jobId: job.id, amountInCents: 0 });
            onRefund?.();
        }
    };

    const handleRefundCanceledSubOrders = () => {
        if (job?.id) {
            refundJobMutation.mutate({ jobId: job.id, onlyCanceledSubOrders: true });
            onRefund?.();
        }
        closeConfirmDialogForSubOrders();
    };

    const openConfirmDialogForSubOrders = () => setIsConfirmDialogOpenForSubOrders(true);
    const closeConfirmDialogForSubOrders = () => setIsConfirmDialogOpenForSubOrders(false);

    const openConfirmDialog = () => setIsConfirmDialogOpen(true);
    const closeConfirmDialog = () => setIsConfirmDialogOpen(false);



    const { data: paymentMethods } =
        useListPaymentMethods(org?.stripe_account_id ?? '');
    return (
        <div className={`text-sm text-gray-700 space-y-2 rounded-lg ${!paymentMethods?.length ? 'border-2 m-2 p-2 border-red-500' : ''}`}>
            {!paymentMethods?.length &&
                <span className='text-red-500'>No payment methods found for this organization</span>}

            <JobStatusSummary job={job} org={org} jobTotal={jobTotal} />

            <RefundComponent
                openConfirmDialog={openConfirmDialog}
                openConfirmDialogForSubOrders={openConfirmDialogForSubOrders}
                jobPaymentIntentId={jobTotal?.payment_intent_id}
            />

            {(jobTotal && org) ?
                <TransferAmounts
                    restaurantTransferAmounts={jobTotal?.restaurant_transfer_amounts ?? {}}
                    jobTotal={jobTotal}
                /> :
                (
                    <div className='flex items-center justify-center h-screen text-2xl  text-red-500'>
                        No job total available.  No amounts to transfer
                    </div>

                )}

            {(jobTotal && org) ?
                <JobTotalInvoiceSummary
                    jobTotal={jobTotal}
                    job={job}
                    org={org} /> :
                (
                    <div className='flex items-center justify-center h-screen text-2xl  text-red-500'>
                        No job total available.
                    </div>

                )}
            <TitleComponent
                leftTitle='Notes'
                leftTitleIcon={isNoteEdited ? <SquareAsteriskIcon color='blue' className=" text-xxs" /> : <Scroll color='green' className=" text-xxs" />}
            >
                <div className='mt-4 text-gray-500'>
                    <p>Please use this space to note any issues with the delivery, customer feedback, or other relevant information. This will be saved for record and future reference.</p>
                    <p>Examples: Delivery was delayed due to traffic, customer requested contactless delivery, etc.</p>
                </div>
                <div>
                    <Textarea
                        className='mt-2'
                        value={note}
                        onChange={(e) => handleNoteChange(e.target.value)}
                    />
                    <Button onClick={handleUpdateJobNote}>Save Note</Button>
                </div>
            </TitleComponent>

            <ConfirmationDialog
                isOpen={isConfirmDialogOpen}
                onClose={closeConfirmDialog}
                onConfirm={handleRefund}
                message="Are you sure you want to refund this job?"
            />
            <ConfirmationDialog
                isOpen={isConfirmDialogOpenForSubOrders}
                onClose={closeConfirmDialogForSubOrders}
                onConfirm={handleRefundCanceledSubOrders}
                message="Are you sure you want to refund all the canceled sub orders associated with this job?"
            />
        </div>
    );
};