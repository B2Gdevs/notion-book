'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import { OrderCard, Separator, useGetOrderById, useGetOrdersByIds } from 'ui';

const OrderDetailPage: React.FC = () => {
    const params = useParams();
    const orderId = params.id as string;
    const { data: order, isLoading: isOrderLoading } = useGetOrderById(orderId);
    const { data: subOrders, isLoading: isSubOrdersLoading } = useGetOrdersByIds(order?.sub_order_ids ?? []);

    if (isOrderLoading || isSubOrdersLoading) return <div>Loading...</div>;
    if (!order) return <div>Order not found.</div>;

    return (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 h-full mt-2">
            <div className="flex-1">
                <OrderCard order={order} allowDelete={true} isSubOrder={order.is_sub_order}/>
            </div>
            <Separator orientation='vertical' className='bg-black border-2 border-black h-full' />
            <div className="flex-1">
                {(subOrders?.length ?? 0) > 0 ? (
                    subOrders?.map((subOrder) => (
                        <OrderCard key={subOrder?.id} order={subOrder} isSubOrder={true}/>
                    ))
                ) : (
                    <div>No sub orders.</div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailPage;