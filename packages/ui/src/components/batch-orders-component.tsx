'use client'

import React, { useState } from 'react';
import { BatchOrder, BatchOrderStatus } from '../models/batchOrderModels';
import { Button } from './ui/button';
import { useGetBatchOrdersByIds } from '../hooks/batchOrderHooks';
import { Package, Clock, User } from 'lucide-react';
import { ColorfullCourier } from '../models/courierModels';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { useGetCouriersByIds } from '../hooks/courierHooks';

interface BatchOrdersComponentProps {
    batchOrders?: BatchOrder[];
    batch_ids?: string[];
    isBasicBatched?: boolean;
    isDisabled?: boolean;
}

const BatchOrdersComponent: React.FC<BatchOrdersComponentProps> = ({
    batchOrders = [],
    batch_ids = [],
    isBasicBatched = false,
    isDisabled = false,
}) => {
    const [selectedBatchOrderId, setSelectedBatchOrderId] = useState<string | null>(null);
    const [batchOrderStatus, setBatchOrderStatus] = useState<BatchOrderStatus | ''>('');
    const { data: fetchedBatchOrders, isLoading, isError } = useGetBatchOrdersByIds(batch_ids);

    const courier_ids = fetchedBatchOrders?.map(batchOrder => batchOrder.courier_id).filter(id => id) as string[];
    const { data: fetchedCouriers, isLoading: isLoadingCouriers, isError: isErrorCouriers } = useGetCouriersByIds(courier_ids);

    const displayBatchOrders = batchOrders.length > 0 ? batchOrders : fetchedBatchOrders || [];
    const couriersMap = fetchedCouriers?.reduce((acc: any, courier: ColorfullCourier) => {
        acc[courier.id!] = courier;
        return acc;
    }, {} as { [key: string]: ColorfullCourier });

    if (isLoading || isLoadingCouriers) return <div>Loading batch orders...</div>;
    if (isError || isErrorCouriers) return <div>Error fetching batch orders.</div>;
    if (displayBatchOrders.length === 0) return <div>No batch orders found.</div>;

    return (
        <div className="space-y-4">
            {displayBatchOrders.map((batchOrder: BatchOrder) => (
                <div key={batchOrder.id} className="relative bg-darkgreen-500 text-beige-200 p-4 rounded-lg shadow-lg overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzmqies6h/image/upload/v1703100641/DALL_E_2023-12-20_13.30.29_-_Create_a_movie_poster-style_image_titled_Iterative_with_the_subtitle_AI_Framework_._The_background_should_be_a_vibrant_colorful_ink_scape_depicti_baar7u.png')] bg-cover filter blur-lg scale-105"></div>
                    <div className="relative z-10">
                        <div className="flex items-center text-lime-green mb-2">
                            <Package className="mr-2" /><span className="">Batch Type:</span> <span className="font-code bg-gray-900 text-purple-500 p-1 rounded ml-1">{isBasicBatched ? "Advanced": "Basic" }</span>
                        </div>
                        <div className="flex items-center text-lime-green mb-2">
                            <Package className="mr-2" /><span className="">Batch Order ID:</span> <span className="font-code bg-gray-900 text-purple-500 p-1 rounded ml-1">{batchOrder.id}</span>
                        </div>
                        <div className="flex items-center mb-2">
                            <Package className="mr-2 " /><span className="">NumOrders:</span> <span className="font-code bg-gray-900 text-purple-500 p-1 rounded ml-1">{batchOrder.order_ids?.length ?? 0}</span>
                        </div>
                        <div className="flex items-center mb-2">
                            <Clock className="mr-2 text-orange-400" /><span className="">Status:</span> <span className="font-code bg-gray-900 text-purple-500 p-1 rounded ml-1">{batchOrder.status}</span>
                        </div>                        

                        {isBasicBatched ? (
                            <div className="font-code bg-gray-800 text-beige-200 p-1 rounded">Assignment handled by third party via un-automated channels.</div>
                        ) : (
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <User className="mr-2 text-pink-500" />
                                    <span className="">Assigned to Courier:</span> <span className="font-code bg-gray-900 text-purple-500 p-1 rounded ml-1">{batchOrder.courier_id && couriersMap ? couriersMap[batchOrder.courier_id]?.name ?? 'Not assigned' : 'Not assigned'}</span>
                                </div>
                                {batchOrder.courier_id && couriersMap && couriersMap[batchOrder.courier_id] && (
                                    <div className="mt-2 ml-4">
                                        <div><span className="">Phone:</span> <span className="font-code bg-gray-900 text-purple-500 p-1 rounded ml-1">{couriersMap[batchOrder.courier_id]?.phone ?? 'N/A'}</span></div>
                                        <div><span className="">Email:</span> <span className="font-code bg-gray-900 text-purple-500 p-1 rounded ml-1">{couriersMap[batchOrder.courier_id]?.email ?? 'N/A'}</span></div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center mt-2">
                            <Select
                                disabled={isDisabled}
                                value={selectedBatchOrderId === batchOrder.id ? batchOrderStatus : ''}
                                onValueChange={(value) => {
                                    setSelectedBatchOrderId(batchOrder.id ?? null);
                                    setBatchOrderStatus(value as BatchOrderStatus);
                                }}
                            >
                                <SelectTrigger>
                                    {BatchOrderStatus[batchOrderStatus as keyof typeof BatchOrderStatus] || 'Select Status'}
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(BatchOrderStatus).map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button className="ml-2 bg-lime-green text-darkgreen-500 hover:bg-lime-green-darker" disabled={isDisabled}>Update</Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export { BatchOrdersComponent };