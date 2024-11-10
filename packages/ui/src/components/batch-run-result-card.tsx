'use client'
import { motion } from 'framer-motion';
import { BookCopyIcon, FileText, Home, Layers, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AreaSelect, CodeBlock, DeliveryWindow, DeliveryWindowSelect, toast, useGetCurrentUserTimeZonedDate, useGetDeliveryWindowById, useGetOrderById, useRebatchAreaLifecycle } from '..';
import { useCreateBatchRunResult, useDeleteBatchRunResult } from '../hooks/batchRunResultHooks';
import { BatchRunResult } from '../models/processingModels';
import { ConfirmationDialog } from './confirmation-dialog';
import { DatePicker } from './date-picker';
import { MetricsBar } from './metrics-bar';
import { TitleComponent } from './title-component';
import { Button } from './ui/button';

interface BatchRunResultsCardProps {
    batchRunResult?: BatchRunResult;
    onShowJobs?: () => void;
    onRunBatch?: () => void;
    onTransferBatchRunAmount?: () => void;
}

const DELETE_TIMER_SECONDS = 100;
const BATCH_RUN_TIMER_SECONDS = 300;

const Timer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(BATCH_RUN_TIMER_SECONDS); // 5 minutes in seconds

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="text-left mb-4 mt-3">
            <div className="text-2xl  text-white">
                Batch run will complete in: <CodeBlock className='text-red bg-black'>{formatTime(timeLeft)}</CodeBlock> minutes
            </div>
            <motion.p className="text-xs text-slate-500">
                A notification for when batch run is completed shows in <CodeBlock>#eng-notifications</CodeBlock>.
            </motion.p>
            <motion.p className="text-xs text-slate-500">
                If the batch run is not complete after the countdown, escalate the issue.
            </motion.p>
        </div>
    );
};

const DeleteTimer: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(DELETE_TIMER_SECONDS); // 5 minutes in seconds

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="text-left mb-4 mt-3">
            <div className="text-2xl  text-white">
                Batch run will be deleted in: <CodeBlock className='text-red bg-black'>{formatTime(timeLeft)}</CodeBlock> minutes
            </div>
            <motion.p className="text-xs text-slate-500">
                A notification for when batch run is deleted shows in <CodeBlock>#eng-notifications</CodeBlock>.
            </motion.p>
            <motion.p className="text-xs text-slate-500">
                If the batch run is not deleted after the countdown, escalate the issue.
            </motion.p>
        </div>
    );
};

export const BatchRunResultsCard: React.FC<BatchRunResultsCardProps> = ({
    batchRunResult,
    onShowJobs,
    onRunBatch,
    onTransferBatchRunAmount
}) => {
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedWindow, setSelectedWindow] = useState<DeliveryWindow>();
    const [selectedAreaId, setSelectedAreaId] = useState<string>();
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [isRebatchConfirmationOpen, setIsRebatchConfirmationOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [showDeleteTimer, setShowDeleteTimer] = useState(false);
    const firstOrderId = batchRunResult?.order_ids[0] || '';
    const { data: order } = useGetOrderById(firstOrderId);
    const userTimezonedDate = useGetCurrentUserTimeZonedDate()
    const { data: orderDeliveryWindow } = useGetDeliveryWindowById(order?.delivery_window_id ?? '')

    const rebatchMutation = useRebatchAreaLifecycle({});

    const metrics = [
        { icon: FileText, count: batchRunResult?.job_ids.length ?? 0, label: 'Jobs' },
        { icon: FileText, count: batchRunResult?.order_ids.length ?? 0, label: 'Orders' },
        { icon: Home, count: batchRunResult?.org_ids.length ?? 0, label: 'Corporations' },
    ];

    const handleBeginBatchRun = () => {
        if (!selectedDate) {
            toast({
                title: 'Missing Date',
                description: 'Please select a date.',
                duration: 5000,
            });
            return;
        }
        if (!selectedAreaId || !selectedWindow) {
            toast({
                title: 'Missing Selection',
                description: 'Please select both an area and a delivery window.',
                duration: 5000,
            });
            return;
        }
        setIsConfirmationOpen(true);
    };

    const handleAreaChange = (areaId: string) => {
        setSelectedAreaId(areaId);
    };

    const createBatchRunResult = useCreateBatchRunResult({
        onSuccess: () => {
            toast({
                title: 'Batch Run Created',
                description: 'The batch run has been successfully created.',
                duration: 5000,
            });
            setShowTimer(true);
        },
        onError: (error) => {
            console.error('Error creating batch run:', error);
            toast({
                variant: 'destructive',
                title: 'Error Creating Batch Run',
                description: `Error: ${error}`
            });
        },
    });

    const deleteBatchRunResult = useDeleteBatchRunResult({
        onSuccess: () => {
            toast({
                title: 'Batch Run Deleted',
                description: 'The batch run has been successfully deleted.',
                duration: 5000,
            });
            setShowDeleteTimer(true);
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: 'Error Deleting Batch Run',
                description: `Error: ${error}`
            });
        },
    });

    const handleConfirm = async () => {
        if (!selectedDate) {
            console.error('No selected date');
            return;
        }
        setIsLoading(true);
        const newBatchRunData = {
            basic_batching: true,
            date: selectedDate ? `${selectedDate.toISOString().split('T')[0]}T00:00:00.000Z` : `${userTimezonedDate.toISOString().split('T')[0]}T00:00:00.000Z`,
            delivery_window_id: selectedWindow?.id,
        };

        try {
            await createBatchRunResult.mutateAsync(newBatchRunData);
            onRunBatch?.();
        } catch (error) {
            console.error('Error during batch run:', error);
        } finally {
            setIsLoading(false);
        }
        setIsConfirmationOpen(false);
    };

    const handleClose = () => {
        setIsConfirmationOpen(false);
    };

    const handleDeleteBegin = () => {
        setIsDeleteConfirmationOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (batchRunResult?.id) {
            deleteBatchRunResult.mutate(batchRunResult.id);
        }
        setIsDeleteConfirmationOpen(false);
    };

    const handleDeleteClose = () => {
        setIsDeleteConfirmationOpen(false);
    };

    const handleRebatchBegin = () => {
        setIsRebatchConfirmationOpen(true);
    };

    const handleRebatchConfirm = () => {
        if (batchRunResult?.area_id) {
            rebatchMutation.mutate({
                areaId: batchRunResult.area_id,
                basicBatching: true,
                date: selectedDate ? `${selectedDate.toISOString().split('T')[0]}T00:00:00.000Z` : `${userTimezonedDate.toISOString().split('T')[0]}T00:00:00.000Z`,
                useDate: true
            });
        }
        setIsRebatchConfirmationOpen(false);
    };

    const handleRebatchClose = () => {
        setIsRebatchConfirmationOpen(false);
    };

    if (isLoading) {
        return (
            <div className='p-4 border rounded-lg border-black m-2 shadow flex justify-center items-center'>
                <Skeleton height={100} width={200} />
            </div>
        );
    }

    return (
        <div>
            {!batchRunResult ? (
                <TitleComponent leftTitle={`Batch Run`} centerTitle='Create' rightTitle='N/A'>
                    {showTimer && <Timer />}
                    <div className='mt-2'>
                        <span className='flex justify-start items-center gap-1'>
                            <DatePicker onSelect={setSelectedDate} className='bg-primary-lime-green-darker w-fit my-2' />
                            <Button onClick={handleBeginBatchRun} className="my-2 text-white py-2 px-4 rounded">
                                <Plus size={16} className="inline mr-2" /> Begin Batch Run
                            </Button>
                        </span>
                        <AreaSelect
                            selectedAreaId={selectedAreaId}
                            onChange={(areaId) => handleAreaChange(areaId)}
                            selectTriggerTextOverride='Select Area For Delivery Windows'
                        />
                        <DeliveryWindowSelect
                            area_id={selectedAreaId}
                            onWindowSelect={setSelectedWindow}
                            isWithoutAddNewButton={true}
                        />
                    </div>
                </TitleComponent>
            ) : (
                <TitleComponent
                    leftTitle="BatchRunResult"
                    leftTitleIcon={<BookCopyIcon className='text-xxs' />}
                    centerTitle={`Delivery: ${new Date(order?.fulfillment_info?.delivery_time ?? '').toLocaleDateString()}`}
                    rightTitle={` ${batchRunResult.id}`}>
                    <MetricsBar metrics={metrics} />
                    <div className='mt-2'>
                        {orderDeliveryWindow && (
                            <div className='bg-secondary-peach-orange-lighter py-1 px-2 w-fit rounded-md my-2 text-sm'>
                                Delivery Window: {orderDeliveryWindow.delivery_time}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                            <Button onClick={onShowJobs} disabled={!onShowJobs || !batchRunResult} className="bg-gray-500 text-white py-2 px-4 rounded">
                                Show Jobs <FileText size={16} className="inline ml-2" />
                            </Button>
                            <Button onClick={onTransferBatchRunAmount} disabled={!onTransferBatchRunAmount || !batchRunResult} className="opacity-50 bg-gray-500 text-white py-2 px-4 rounded">
                                Transfer BatchRun Amount To Restaurants  <Layers size={16} className="inline ml-2" />
                            </Button>
                            <Button onClick={handleDeleteBegin} className="mt-2 text-white py-2 px-4 rounded bg-secondary-pink-salmon">
                                Delete Batch Run
                            </Button>
                            <Button onClick={handleRebatchBegin} className="mt-2 text-white py-2 px-4 rounded bg-blue-500">
                                Rebatch
                            </Button>
                        </div>
                    </div>
                    {showDeleteTimer && <DeleteTimer />}
                </TitleComponent>
            )}

            <ConfirmationDialog
                isOpen={isConfirmationOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                handleCloseDialog={handleClose}
                message="Are you sure you want to begin a new batch run?"
            />
            <ConfirmationDialog
                isOpen={isDeleteConfirmationOpen}
                onClose={handleDeleteClose}
                onConfirm={handleDeleteConfirm}
                handleCloseDialog={handleDeleteClose}
                message="Are you sure you want to delete this batch run?"
            />
            <ConfirmationDialog
                isOpen={isRebatchConfirmationOpen}
                onClose={handleRebatchClose}
                onConfirm={handleRebatchConfirm}
                handleCloseDialog={handleRebatchClose}
                message="Are you sure you want to rebatch this area?"
            />
        </div>
    );
};