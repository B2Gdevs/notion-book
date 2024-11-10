'use client'

import React, { useEffect, useMemo, useState } from 'react';
import { BatchOrder, CodeBlock, Collapsible, CourierSelect, Label, toast, useGetArea, useGetDeliveryJobById, useGetOrg } from '..';
import { useGetBatchOrdersByIds, useUpdateBatchOrder } from '../hooks/batchOrderHooks';
import { useGetOrdersByIds } from '../hooks/orderHooks';
import { useGetDeliveryJobTotalById } from '../hooks/totalHooks';
import { cn } from '../lib/utils';
import { DeliveryJobStatus } from '../models/deliveryJobModels';
import { JobContextActions } from './job-actions';
import { JobOrdersComponent } from './job-orders-component';
import { JobSummary } from './job-summary';
import { TitleComponent } from './title-component';
import { Switch } from './ui/switch';
import { TruckIcon } from 'lucide-react';

interface JobCardProps {
    jobId: string;
    className?: string;
    step?: number;
}

export const JobCard: React.FC<JobCardProps> = ({ jobId, className, step }) => {
    const [showOrders, setShowOrders] = useState(false);
    const [shownOrderIds, setShownOrderIds] = useState<{ [id: string]: boolean }>({});
    const [refundAmounts, setRefundAmounts] = useState<{ [orderId: string]: number }>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedCourierIds, setSelectedCourierIds] = useState<{ [batchId: string]: string }>({});
    const { mutate: updateBatchOrder } = useUpdateBatchOrder({
        onSuccess: () => {
            toast({
                title: 'Batch Order Updated',
                description: 'Batch order updated successfully',
                duration: 5000,
            });
        },
        onError: (error) => {
            console.error('Error updating batch order:', error);
            toast({
                title: 'Error',
                description: 'Error updating batch order',
                duration: 5000,
            });
        }
    });

    const handleCourierChange = (courierId: string, batch: BatchOrder) => {
        if (!batch.id) return;
        setSelectedCourierIds(prev => ({
            ...prev,
            [batch.id as string]: courierId  // Update the courier ID for the specific batch
        }));
        updateBatchOrder({
            batchOrderId: batch.id,
            batchOrderData: {
                ...batch,
                courier_id: courierId
            }
        });
    };

    const itemsPerPage = 10;
    const { data: job } = useGetDeliveryJobById(jobId);

    const { data: batches } = useGetBatchOrdersByIds(job?.batch_ids ?? []);

    const orderIds = useMemo(() => batches?.map(batch => batch.order_ids).flat() || [], [batches]);
    const totalPages = Math.ceil((orderIds?.length || 0) / itemsPerPage);

    const { data: orders, isLoading: isLoadingOrders } = useGetOrdersByIds(orderIds);
    const { data: jobTotal, refetch: refetchJobTotal } = useGetDeliveryJobTotalById(job?.job_total_id ?? '');
    const { data: org } = useGetOrg(job?.org_id ?? '');

    const areOrdersSent = job?.status === DeliveryJobStatus.SENT_TO_KITCHEN || job?.status === DeliveryJobStatus.IN_PROGRESS;

    const isJobInProgress = job?.status === DeliveryJobStatus.IN_PROGRESS;
    const isJobCompleted = job?.status === DeliveryJobStatus.COMPLETED;
    const { data: area } = useGetArea(job?.area_id ?? '');

    const paginatedOrders = orders?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handleToggle = () => {
        setShowOrders(!showOrders);
    };
    const handleNext = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    useEffect(() => {
        if (batches) {
            const newCourierIds = batches.reduce((acc, batch) => {
                // Ensure both batch.id and batch.courier_id are defined before using them
                if (batch.id && batch.courier_id) {
                    acc[batch.id] = batch.courier_id;
                }
                return acc;
            }, {} as { [key: string]: string }); // Explicitly type the accumulator to avoid type issues
            setSelectedCourierIds(newCourierIds);
        }
    }, [batches]); // This useEffect will run whenever 'batches' changes.


    return (
        <Collapsible stepHeaderProps={{
            text: `Corporation: ${org?.name}`,
            step: step?.toString() ?? '',
        }} >
            <TitleComponent

                className='mt-4'
                leftTitle='DeliveryJob'
                leftTitleIcon={<TruckIcon className='text-xxs' />}
                centerTitle={`${org?.name}/ ${org?.id}`}
                rightTitle={`${job?.id ?? ''}`}>
                {job && (
                    <JobContextActions
                        areOrdersSent={areOrdersSent}
                        isJobInProgress={isJobInProgress}
                        isJobCompleted={isJobCompleted}
                        job={job}
                        refetchJobTotal={refetchJobTotal}
                        orders={orders}
                        org={org}
                        area={area}
                    />
                )}

                <div className={cn("relative p-2", className)}>
                    <div className='flex justify-between items-center'>
                        <span className='flex justify-center items-center gap-2 my-4'>
                            {!showOrders ? 'Show Orders' : 'Show Summary'}

                            <Switch checked={showOrders} onClick={handleToggle} aria-label="Toggle Orders">
                            </Switch>
                        </span>

                        <span className='my-4'>
                            {/* Courier: */}
                            {batches && batches.map(batch => (
                                <span key={batch.id} className='flex justify-center items-center gap-2'>
                                    <span className='flex justify-center items-center gap-1'>
                                        <Label>Batch ID:</Label>
                                        <CodeBlock>{batch.id}</CodeBlock>
                                    </span>
                                    <span className='flex justify-center items-center gap-1'>
                                        <Label>Courier:</Label>
                                        <CourierSelect
                                            initialCourierId={batch.id ? (selectedCourierIds[batch.id] || batch.courier_id) : batch.courier_id} // Ensuring batch.id is not undefined
                                            onChange={(courier) => {
                                                if (!courier.id) {
                                                    toast({
                                                        title: 'Error',
                                                        description: 'Courier ID needed to assign to batch order.',
                                                        duration: 5000,
                                                    })
                                                    return;
                                                }
                                                handleCourierChange(courier.id, batch)
                                            }}
                                        />
                                    </span>
                                </span>
                            ))}
                        </span>

                    </div>
                    {showOrders ? (
                        <JobOrdersComponent
                            showOrders={showOrders}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            handlePrev={handlePrev}
                            handleNext={handleNext}
                            isLoadingOrders={isLoadingOrders}
                            paginatedOrders={paginatedOrders ?? []}
                            allOrders={orders ?? []}
                            shownOrderIds={shownOrderIds}
                            setShownOrderIds={setShownOrderIds}
                            refundAmounts={refundAmounts}
                            setRefundAmounts={setRefundAmounts}
                        />
                    ) : (
                        <JobSummary
                            job={job}
                            jobTotal={jobTotal}
                            org={org}
                            onRefund={() => {
                                refetchJobTotal();
                            }} />
                    )}

                </div>
            </TitleComponent>
        </Collapsible>
    );
};