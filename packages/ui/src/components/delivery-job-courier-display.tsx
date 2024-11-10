'use client';

import { Copy, Loader } from "lucide-react";
import { Button, CodeBlock, DeliveryJob, DeliveryJobStatus, JobOrdersCourierComponent, toast, useCompleteJobs, useGetBatchOrdersByIds, useGetOrdersByIds, useGetOrg } from "..";
import { useEffect, useMemo, useState } from "react";
import SlideToComplete from "./slide-to-complete";

interface DeliveryJobCourierDisplayProps {
    job: DeliveryJob;
    isColorfullUser?: boolean;
    isDisabled?: boolean;
}

export const DeliveryJobCourierDisplay: React.FC<DeliveryJobCourierDisplayProps> = ({ job, isColorfullUser, isDisabled }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [statusMessageType, setStatusMessageType] = useState('');
    const [shownOrderIds, setShownOrderIds] = useState<{ [id: string]: boolean }>({});
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const [allPickedOrPrepared, setAllPickedOrPrepared] = useState(false);
    const [showSlider, setShowSlider] = useState(false); // State to toggle slider visibility

    const { data: batches } = useGetBatchOrdersByIds(job?.batch_ids ?? []);
    const orderIds = useMemo(() => batches?.map(batch => batch.order_ids).flat() || [], [batches]);

    // Update shownOrderIds when batches data is available
    useEffect(() => {
        if (batches && batches.length > 0) {
            const newOrderIds = batches.map(batch => batch.order_ids).flat();
            const initialShownIds: { [id: string]: boolean } = {};
            newOrderIds.forEach(id => {
                initialShownIds[id] = true; // Set all to true initially
            });
            setShownOrderIds(initialShownIds);
        }
    }, [batches]);

    const totalPages = Math.ceil((orderIds?.length || 0) / itemsPerPage);

    const { data: orders, isLoading: isLoadingOrders } = useGetOrdersByIds(orderIds);

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

    // Handler to update state based on the callback from JobOrdersComponent
    const handleSubOrdersStatusChange = (allPickedUp: boolean) => {
        setAllPickedOrPrepared(allPickedUp);
    };

    const { data: org } = useGetOrg(job?.org_id ?? '');

    const formattedDate = new Date(job.delivery_date ?? new Date()).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const completeJobMutation = useCompleteJobs({
        onSuccess: () => {
            toast({
                title: 'Job Completed',
                description: `Job completed successfully`,
                duration: 5000,
            });
            setStatusMessage('Job successfully marked as completed.'); // Update status message on success
            setStatusMessageType('success'); // Update status message type on success
            setIsLoading(false); // Stop loading on success
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error completing job: ${error}`,
                duration: 5000,
            });
            setStatusMessage('Failed to mark job as completed. Please contact Colorfull support ASAP through Intercom.'); // Update status message on error
            setStatusMessageType('error'); // Update status message type on error
            setIsLoading(false); // Stop loading on 
        },
    });

    const handleCompleteJob = (chargeDeliveryFee: boolean) => {
        if (isDisabled) return;
        completeJobMutation.mutate({ jobIds: [job.id ?? ''], chargeDeliveryFee });
        setIsLoading(true);
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: 'Copied',
                description: 'Address copied to clipboard',
                duration: 3000,
            });
        } catch (error) {
            toast({
                title: 'Failed to copy',
                description: 'Failed to copy address to clipboard',
                duration: 3000,
            });
        }
    };

    return (
        <div key={job.id} className={`bg-white border-8 rounded-lg ${allPickedOrPrepared ? 'border-green-400' : 'border-red-400'} mx-2 p-2 shadow-lg`} >
            <h2 className={`flex justify-center items-center font-righteous text-2xl ${allPickedOrPrepared ? 'text-green-400' : 'text-red-400'} my-2`}>
                {allPickedOrPrepared ? 'Ready to deliver!' : 'Not yet ready.'}
            </h2>
            <div className="flex flex-col justify-start items-start gap-1">
                <div className="flex flex-col justify-start items-start border-b-[1px] border-gray-200 w-full pb-2">
                    <div className="text-gray-400">
                        Company
                    </div>
                    <div className="text-xl">
                        {org?.name}
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start border-b-[1px] border-gray-200 w-full pb-2">
                    <div className="text-gray-400">
                        Address
                    </div>
                    <div className="text-xl flex justify-end items-center">
                        {org?.locations?.[0]?.address}
                        <span className="flex flex-col justify-center items-center gap-1">
                            <Copy className="ml-2 text-secondary-peach-orange" onClick={() => handleCopy(org?.locations?.[0]?.address ?? '')} />
                        </span>
                    </div>
                    <div className="underline text-secondary-peach-orange">
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(org?.locations?.[0]?.address ?? '')}`} target="_blank" rel="noopener noreferrer">
                            Open in Google Maps
                        </a>
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start border-b-[1px] border-gray-200 w-full pb-2">
                    <div className="text-gray-400">
                        Delivery Instructions
                    </div>
                    <div className="text-xl">
                        {org?.locations?.[0]?.delivery_instructions ? org?.locations?.[0]?.delivery_instructions : 'N/A'}
                    </div>
                </div>
                <div className="flex flex-col justify-start items-start border-b-[1px] border-gray-200 w-full pb-2">
                    <div className="text-gray-400">
                        Delivery Date
                    </div>
                    <div className="text-xl">
                        {formattedDate}
                    </div>
                </div>

                <span className="flex justify-center items-center w-full">
                    {
                        job.status === DeliveryJobStatus.COMPLETED
                            ?
                            <Button className="bg-gray-300 my-2 text-black font-righteous text-xl border border-2 border-black h-fit">
                                Job Completed
                            </Button>
                            :
                            isLoading ?
                                <Button className="bg-secondary-peach-orange my-2 text-black font-righteous text-xl border border-2 border-black h-fit" disabled>
                                    <Loader className="animate-spin mr-2" /> Updating job information...
                                </Button>
                                :
                                showSlider ?
                                    <div className="flex flex-col justify-center items-center w-3/5 py-2 mt-2 gap-2">
                                        <SlideToComplete
                                            onComplete={() => { handleCompleteJob(true); setShowSlider(false); }}
                                            sliderColor='#c9e0b4' // Lime green darker
                                            thumbColor='#FFBB5C' // Peach orange
                                            thumbBorderColor='#000000' // Black
                                        />
                                        <span className="font-righteous">Slide to confirm</span>
                                    </div>

                                    :
                                    <Button className={`bg-primary-lime-green my-2 text-primary-spinach-green-darker font-righteous text-xl h-fit rounded-lg ${isDisabled && 'pointer-events-none bg-gray-400 opacity-70'}`} onClick={() => setShowSlider(true)}>
                                        Mark Job as Delivered
                                    </Button>
                    }
                </span>

                {(statusMessage && statusMessageType === 'error') && <CodeBlock className='text-red-500 text-lg font-bold my-2'>{statusMessage}</CodeBlock>}
            </div>
            <JobOrdersCourierComponent
                currentPage={currentPage}
                totalPages={totalPages}
                handlePrev={handlePrev}
                handleNext={handleNext}
                isLoadingOrders={isLoadingOrders}
                allOrders={orders ?? []}
                shownOrderIds={shownOrderIds}
                setShownOrderIds={setShownOrderIds}
                refundAmounts={{}}
                setRefundAmounts={() => { }}
                onSubOrdersStatusChange={handleSubOrdersStatusChange}
                isColorfullUser={isColorfullUser}
            />

        </div>
    )
};