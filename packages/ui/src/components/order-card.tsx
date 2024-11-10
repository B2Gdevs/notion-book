'use client'

import { Clock, HomeIcon, Package, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { AreaSelect, Collapsible, PaymentStatus, ReceiptDialogContent, TitleComponent, useDeleteOrder, useGetBrandsByIds, useGetOrderItemsbyIds, useGetOrderTotalById, useGetStoresByIds, useGetUser, useUpdateOrder, useUpdateOrderTotal } from '..';
import { Order, OrderStatus } from '../models/orderModels';
import { CodeBlock } from './code-block';
import { OrderStatusSelect } from './order-status-select';
import { PaymentStatusSelect } from './payment-status-select';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from './ui/use-toast';

interface OrderCardProps {
    order: Order;
    allowDelete?: boolean;
    isSubOrder?: boolean;
    excludeFields?: string[];
    disableFields?: string[];
}

export const extractGuestName = (guestId: string) => {
    const parts = guestId.split('_');
    return {
        firstName: parts[0],
        lastName: parts[1]
    };
};

export const OrderCard: React.FC<OrderCardProps> = ({ order, allowDelete, isSubOrder }) => {
    const router = useRouter()
    const orderItemIds = (order.items?.map(item => item.id).filter(Boolean) || []) as string[];
    const { data: orderItems } = useGetOrderItemsbyIds(orderItemIds);
    const storeIds = orderItems?.map(orderItem => orderItem.store_id).filter(Boolean) as string[];
    const { data: stores } = useGetStoresByIds(storeIds);
    const { data: user } = useGetUser(order?.user_id ?? '');
    const storeCount = new Set(storeIds).size;
    const brandIds = stores?.map(store => store?.brand_id).filter(Boolean) as string[];
    const { data: brands } = useGetBrandsByIds(brandIds ?? [''])
    const isOrderGuestOrder = order?.share_guest_email !== null;

    const updateOrderTotalMutation = useUpdateOrderTotal({
        onSuccess: () => {
            toast({
                title: 'Order total updated',
            })
        }
    });

    const guestId = order?.share_guest_id ?? '';
    const { firstName, lastName } = extractGuestName(guestId);

    const { data: orderTotal } = useGetOrderTotalById(order?.order_total_id ?? '')

    const deleteOrderMutation = useDeleteOrder({
        onSuccess: () => toast({ title: 'Order deleted' }),
    });

    const updateOrderMutation = useUpdateOrder({
        onSuccess: () => toast({ title: 'Order updated' }),
    });
    const [showReceipt, setShowReceipt] = useState(false);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            deleteOrderMutation.mutate(order?.id ?? '');
        }
    }
    const handleUpdateOrderStatus = (newStatus: string) => {
        updateOrderMutation.mutate({
            orderId: order?.id ?? '',
            orderData: {
                ...order,
                status: newStatus as OrderStatus
            },
        });
    };

    const handleUpdatePaymentStatus = (newStatus: string, payment_status_type: "org" | "user") => {
        if (payment_status_type === "org") {
            updateOrderTotalMutation.mutate({
                orderTotalId: order?.id ?? '',
                orderTotalData: {
                    ...orderTotal,
                    org_payment_status: newStatus as PaymentStatus
                },
            });
        }
        else {
            updateOrderTotalMutation.mutate({
                orderTotalId: order?.id ?? '',
                orderTotalData: {
                    ...orderTotal,
                    user_payment_status: newStatus as PaymentStatus
                },
            });
        }
    }
    const titleMenuItems = [
        { name: 'goToOrder', label: 'Go to Order' },
        { name: 'goToUser', label: 'Go to User' }
    ];

    const handleMenuClick = (buttonName: string) => {
        switch (buttonName) {
            case 'goToOrder':
                router.push(`/orders/${order?.id}`);
                break;
            case 'goToUser':
                router.push(`/users/${order?.user_id}`);
                break;
            default:
                console.error('Unknown action');
        }
    };

    return (
        <TitleComponent
            leftTitle={isSubOrder ? 'Sub Order' : 'Main Order'}
            centerTitle={user ? `${user.first_name} ${user.last_name}` : (isOrderGuestOrder ? `${firstName} ${lastName}` : 'Loading...')}
            rightTitle={`${order?.id ?? 'Loading...'}`}
            menuItems={titleMenuItems}
            menuPosition='bottom-right'
            onMenuItemClick={handleMenuClick}
        >
            <div className="bg-slate-200 p-5 rounded">
                <div className="grid grid-cols-2 gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Clock className="text-black" />
                        <Label className="text-md font-righteous underline">Delivery Time</Label>
                    </div>
                    <CodeBlock className='bg-gray-600 text-primary-off-white text-right'>{order.fulfillment_info?.delivery_time ? new Date(order.fulfillment_info.delivery_time).toLocaleString() : 'Not specified'}</CodeBlock>

                    <div className="flex items-center gap-2">
                        <Clock className="text-black" />
                        <Label className="text-md font-righteous underline">Order Status</Label>
                    </div>
                    <OrderStatusSelect onChange={handleUpdateOrderStatus} initialStatus={order.status} />
                    <div className="flex items-center gap-2">
                        <Clock className="text-black" />
                        <Label className="text-md font-righteous underline">Area Id</Label>
                    </div>

                    <AreaSelect
                        selectedAreaId={order?.delivery_info?.destination?.location?.area_id ?? 'Not Specified'}
                        onChange={(areaId) => {
                            if (!areaId) {
                                return;
                            }

                            if (order.delivery_info && order.delivery_info.destination && order.delivery_info.destination.location) {
                                order.delivery_info.destination.location.area_id = areaId;
                                updateOrderMutation.mutate({
                                    orderId: order.id ?? '',
                                    orderData: order,
                                });
                            }
                        }} />
                    {!order.is_sub_order ? (
                        <>
                            <div className="flex items-center gap-2">
                                <Package className="text-black" />
                                <Label className="text-md font-righteous underline">Sub Orders</Label>
                            </div>
                            <CodeBlock className='bg-gray-600 text-primary-off-white text-right'>{order.sub_order_ids?.length ?? 0}</CodeBlock>
                            <div className="flex items-center gap-2">
                                <HomeIcon className="text-black" />
                                <Label className="text-md font-righteous underline">Stores Involved</Label>
                            </div>
                            <Collapsible stepHeaderProps={{
                                text: `Stores Involved (${storeCount})`,
                            }} >
                                {stores?.map(store => {
                                    const brand = brands?.find(brand => brand?.id === store?.brand_id)

                                    return (
                                        <div key={store?.id ?? ''} className="flex items-center gap-2">
                                            <HomeIcon className="text-black" />
                                            <Label className="text-md font-righteous underline">Store</Label>
                                            <CodeBlock className='bg-gray-600 text-primary-off-white text-right'>{brand?.name ?? ''}</CodeBlock>
                                        </div>
                                    )
                                })}
                            </Collapsible>

                        </>) : (<>
                            <div className="flex items-center gap-2">
                                <HomeIcon className="text-black" />
                                <Label className="text-md font-righteous underline">Brand</Label>
                            </div>
                            <CodeBlock className='bg-gray-600 text-primary-off-white text-right'>{brands?.find(brand => brand?.id == stores?.[0]?.brand_id)?.name}</CodeBlock>
                            <div className="flex items-center gap-2">
                                <HomeIcon className="text-black" />
                                <Label className="text-md font-righteous underline">Org Payment Status</Label>
                            </div>
                            <div>
                                <Label>Org Payment Status</Label>
                                <PaymentStatusSelect onChange={(newStatus) => handleUpdatePaymentStatus(newStatus, "org")} initialStatus={orderTotal?.org_payment_status} />
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="text-black" />
                                <Label className="text-md font-righteous underline">User Payment Status</Label>
                            </div>
                            <div>
                                <Label>User Payment Status</Label>
                                <PaymentStatusSelect onChange={(newStatus) => handleUpdatePaymentStatus(newStatus, "user")} initialStatus={orderTotal?.user_payment_status} />
                            </div>
                        </>)}
                    <Collapsible
                        stepHeaderProps={{
                            text: `Order Items (${orderItemIds?.length ?? 0})`,
                            className: "text-lg  mb-2"
                        }}
                    >
                        {orderItems?.map(orderItem => (
                            <div key={orderItem?.id ?? ''} className="flex flex-col items-start gap-2 border-2 border-gray-300 rounded-lg mx-2 p-2 bg-gray-100 shadow-lg">
                                <div className="text-sm ">Order Item ID: {orderItem?.id}</div>
                                <div className="ml-4">
                                    <div className="text-sm ">Menu Item:</div>
                                    <div className="ml-4">
                                        <div className="text-sm">Name: {orderItem?.name ?? 'Menu Item No Longer Found'}</div>
                                        <div className="text-sm">ID: {orderItem?.menu_item_id}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Collapsible>
                </div>
            </div>
            {showReceipt && (
                <ReceiptDialogContent
                    order={order}
                    customerNote={order.customer_note}
                />
            )}

            <div className="flex justify-between items-center mt-4">
                {allowDelete && (
                    <Button className="bg-red-500 text-white rounded p-2" onClick={handleDelete}>Delete Order</Button>
                )}
                <Button className="bg-blue-500 text-white rounded p-2" onClick={() => setShowReceipt(!showReceipt)}>Show Receipt</Button>
            </div>
        </TitleComponent>
    );
};