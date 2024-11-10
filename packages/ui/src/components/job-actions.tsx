'use client'

import React from 'react';
import { Area, DeliveryJob, Order, OrderStatus, Org, useChargeOrgForJobs, useCompleteJobs, useDownloadSubOrderTotalsAsCSV, useGetOrdersByIds, useRecalculateDeliveryJobTotal, useRefundJob, useSendOrdersDeliveredEmails, useSendOrdersToKitchens, useStartJobs, useStoresAndBrands, useTransferAmountsToRestaurantsForJobs } from '..';
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger } from './ui/context-menu';
import { toast } from './ui/use-toast';

interface JobActionsProps {
    job: DeliveryJob;
    areOrdersSent: boolean;
    isJobInProgress: boolean;
    isJobCompleted: boolean;
    refetchJobTotal: () => void;
    orders?: Order[];
    org?: Org;
    area?: Area;
}

export const JobContextActions: React.FC<JobActionsProps> = ({
    job,
    areOrdersSent,
    isJobInProgress,
    isJobCompleted,
    refetchJobTotal,
    orders,
    org,
    area
}) => {
    const useRecalculateMutation = useRecalculateDeliveryJobTotal({
        onSuccess: () => {
            toast({
                title: 'Recalculation Successful',
                description: 'Job total recalculated successfully',
                duration: 5000,
            });
            refetchJobTotal();
        },
        onError: (error) => {
            console.error(`Error recalculating job total:`, error);
            toast({
                title: 'Error',
                description: `Error recalculating job total: ${error.message}`,
                duration: 5000,
                variant: 'destructive'
            });
        }
    })

    const sendOrdersMutation = useSendOrdersToKitchens({
        onSuccess: () => {
            toast({
                title: 'Orders Sent',
                description: 'Orders sent to kitchens successfully',
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error sending orders to kitchens: ${error}`,
                duration: 5000,
            });
        },
    });

    const startJobsMutation = useStartJobs({
        onSuccess: () => {
            toast({
                title: 'Job Started',
                description: `Job ${job.id ?? ''} started successfully`,
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error starting job ${job.id ?? ''}: ${error}`,
                duration: 5000,
            });
        },
    });

    const completeJobMutation = useCompleteJobs({
        onSuccess: () => {
            toast({
                title: 'Job Completed',
                description: `Job ${job.id ?? ''} completed successfully`,
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error completing job ${job.id ?? ''}: ${error}`,
                duration: 5000,
            });
        },
    });

    const transferAmountsMutation = useTransferAmountsToRestaurantsForJobs({
        onSuccess: () => {
            toast({
                title: 'Transfer Successful',
                description: 'Amounts transferred to restaurants successfully',
                duration: 5000,
            });
            refetchJobTotal();
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error transferring amounts to restaurants: ${error}`,
                duration: 5000,
            });
        },
    });

    const refundJobMutation = useRefundJob({
        onSuccess: () => {
            toast({
                title: 'Refund Successful',
                description: `Refund processed successfully for job ${job.id}`,
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error processing refund for job ${job.id}: ${error}`,
                duration: 5000,
            });
        },
    });

    const chargeOrgMutation = useChargeOrgForJobs({
        onSuccess: () => {
            toast({
                title: 'Charge Successful',
                description: `Org ${org?.name} charged successfully`,
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error charging org ${org?.name}: ${error}`,
                duration: 5000,
            });
        },
    });

    const sendOrdersDeliveredEmailsMutation = useSendOrdersDeliveredEmails({
        onSuccess: () => {
            toast({
                title: 'Emails Sent',
                description: 'Order delivered emails sent successfully',
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Failed to send emails: ${error.message}`,
                duration: 5000,
                variant: 'destructive'
            });
        }
    });

    const handleSendOrdersFixedTime = () => {
        sendOrdersMutation.mutate({ jobIds: [job.id ?? ''], sendASAP: false });
    };

    const handleSendOrdersASAP = () => {
        sendOrdersMutation.mutate({ jobIds: [job.id ?? ''], sendASAP: true });
    };

    const handleStartJobs = () => {
        startJobsMutation.mutate([job.id ?? '']);
    };

    const handleSendOrderDeliveredEmails = () => {
        sendOrdersDeliveredEmailsMutation.mutate(job.id ?? '');
    };

    const handleCompleteJob = (chargeDeliveryFee: boolean) => {
        completeJobMutation.mutate({ jobIds: [job.id ?? ''], chargeDeliveryFee });
    };

    const handleChargeOrgForJob = (chargeDeliveryFee: boolean) => {
        chargeOrgMutation.mutate({ jobIds: [job.id ?? ''], chargeDeliveryFee });
    };

    const handleTransfersToRestaurants = () => {
        if (confirm("Are you sure you want to transfer funds to all restaurants?")) {
            transferAmountsMutation.mutate([job.id ?? '']);
        }
    };

    const handleRefundJob = () => {
        if (confirm("Are you sure you want to refund the entire job?")) {
            refundJobMutation.mutate({ jobId: job?.id ?? '' });
        }
    };

    const handleRefundCanceledSubOrders = () => {
        if (confirm("Are you sure you want to refund all canceled sub orders?")) {
            refundJobMutation.mutate({ jobId: job?.id ?? '', onlyCanceledSubOrders: true });
        }
    };

    const { storeMap, brandMap } = useStoresAndBrands(orders ?? []);
    const subOrderIds = (orders?.flatMap(order => order.sub_order_ids) ?? []).filter((id): id is string => id !== undefined);
    const { data: subOrders } = useGetOrdersByIds(subOrderIds);

    const handleDownloadSubOrderTotals = useDownloadSubOrderTotalsAsCSV(subOrders ?? []);

    const downloadSubOrderTotals = () => {
        handleDownloadSubOrderTotals();
        toast({
            title: 'Downloading Sub Order Totals',
            description: 'Sub Order Totals are being downloaded',
            duration: 5000,
        });
    }


    function formatDate(dateString: string): { date: string, time: string } {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString()
        };
    }

    const downloadOrdersAsCSV = () => {
        if (!subOrders || subOrders.length === 0) return;
        // Table: "Company Name", "Restaurant Name", "Delivery Date", "Delivery Time", "Customer Name", "Order Items", "Customer Notes", "Delivery Address"
        const csvHeader = "Company Name,Restaurant Name,Delivery Date,Delivery Time,Customer Name,Order Items,Customer Notes,Delivery Address,Pickup Address\n";
        const csvBody = subOrders.filter(subOrder => subOrder.status !== OrderStatus.CANCELED && subOrder.status !== OrderStatus.FAILED_TO_SEND_TO_KITCHEN).map(subOrder => {
            const itemNames = subOrder.items?.map(item => `"${item?.name?.replace(/"/g, '""') || ''} x${item?.quantity || 1}"`).join('; ');
            const store = storeMap[subOrder.store_id ?? ''];
            const brand = brandMap[store?.brand_id ?? ''];
            const { date, time } = formatDate(subOrder.fulfillment_info?.delivery_time || '');
            return `"${org?.name}","${brand?.name ?? "N/A"}","${date}","${time}","${subOrder.customer?.first_name} ${subOrder.customer?.last_name}","${itemNames}","${subOrder.customer_note?.replace(/"/g, '""') || ''}","${subOrder.delivery_info?.destination?.full_address?.replace(/"/g, '""') || ''}","${area?.kitchen_address?.replace(/"/g, '""') || ''}"`;
        }).join("\n");
        const csvContent = csvHeader + csvBody;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Format the org name and delivery time to be used in a filename
        const orgName = org?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'unknown_org';
        let deliveryTime = 'unknown_time';
        if (subOrders[0]?.fulfillment_info?.delivery_time) {
            const dt = new Date(subOrders[0]?.fulfillment_info?.delivery_time);
            const month = ("0" + (dt.getMonth() + 1)).slice(-2); // Months are 0 based, so add 1 and format to 2 digits
            const day = ("0" + dt.getDate()).slice(-2); // Format to 2 digits
            const year = dt.getFullYear().toString().slice(-2); // Get last 2 digits of year
            deliveryTime = `${month}.${day}.${year}`;
        }

        link.setAttribute('download', `${orgName}_delivery_orders_${deliveryTime}.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleRecalculate = () => {
        useRecalculateMutation.mutate(job?.job_total_id ?? '');
    }

    return (
        <ContextMenuContent className="w-64">
            <ContextMenuItem onClick={handleRecalculate} >
                <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                    1
                </span>
                Recalculate Job Total
                <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={downloadOrdersAsCSV} >
                <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                    2
                </span>
                Download Orders
                <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handleSendOrdersFixedTime} disabled={areOrdersSent || isJobCompleted || isJobInProgress}>
                <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                    3A
                </span>
                Send Orders to Kitchens (Fixed Time)
                <ContextMenuShortcut>Ctrl+Shift+S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleSendOrdersASAP} disabled={areOrdersSent || isJobCompleted || isJobInProgress}>
                <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                    3B
                </span>
                Send Orders to Kitchens (ASAP)
                <ContextMenuShortcut>Ctrl+S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleStartJobs} disabled={isJobCompleted}>
                <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                    4A
                </span>
                Start Job
                <ContextMenuShortcut>Ctrl+Start</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleSendOrderDeliveredEmails}>
                <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                    4B
                </span>
                Send Order Delivered Email To Customers
            </ContextMenuItem>
            <ContextMenuSub>
                <ContextMenuSubTrigger>
                    <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                        5
                    </span>
                    Complete Job
                    <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                    <ContextMenuItem onClick={() => handleCompleteJob(true)}>
                        With Delivery Fee
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleCompleteJob(false)}>
                        Without Delivery Fee
                    </ContextMenuItem>
                </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuSub>
                <ContextMenuSubTrigger>
                    <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                        6
                    </span>
                    Charge Org For Job
                    <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                    <ContextMenuItem onClick={() => handleChargeOrgForJob(true)}>
                        With Delivery Fee
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleChargeOrgForJob(false)}>
                        Without Delivery Fee
                    </ContextMenuItem>
                </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuItem onClick={handleTransfersToRestaurants} disabled={!isJobCompleted}>
                <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                    7
                </span>
                Transfer Funds To Restaurants
                <ContextMenuShortcut>Ctrl+T</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handleRefundJob} disabled={!isJobCompleted}>
                <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                    8
                </span>
                Refund Job
                <ContextMenuShortcut>Ctrl+R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleRefundCanceledSubOrders} disabled={!isJobCompleted}>
                <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                    9
                </span>
                Refund Canceled Sub Orders
                <ContextMenuShortcut>Ctrl+Shift+R</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={downloadSubOrderTotals}>
                <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                    10
                </span>
                Download Sub Order Totals
                <ContextMenuShortcut>Ctrl+Shift+D</ContextMenuShortcut>
            </ContextMenuItem>
        </ContextMenuContent>
    );
};