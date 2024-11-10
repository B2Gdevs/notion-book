'use client'

import React from 'react';
import { Order, OrderTotal, useRefundOrder, useSendOrderToKitchen } from '..';
import { ContextMenuContent, ContextMenuItem, ContextMenuShortcut } from './ui/context-menu';
import { toast } from './ui/use-toast';

interface OrderActionsProps {
    order: Order;
    orderTotal: OrderTotal;
    disabledItems: string[];
    excludedItems: string[];
}

export const OrderContextActions: React.FC<OrderActionsProps> = ({
    order,
    orderTotal,
    disabledItems,
    excludedItems,
}) => {
    const sendOrderMutation = useSendOrderToKitchen({
        onSuccess: () => {
            toast({
                title: 'Order Sent',
                description: 'Order sent to kitchen successfully',
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error sending order to kitchen: ${error?.body?.detail}`,
                duration: 5000,
                variant: 'destructive'
            });
        },
    })

    const refunderOrderMutation = useRefundOrder({
        onSuccess: () => {
            toast({
                title: 'Order Refunded',
                description: 'Order refunded successfully',
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Error refunding order: ${error}`,
                duration: 5000,
            });
        },
    });

    const handleSendOrder = () => {
        sendOrderMutation.mutate({ orderId: order?.id ?? '', sendASAP: true });
    }

    const handleRefundOrgOrder = () => {
        const amountInCents = ((orderTotal?.subtotal ?? 0) + (orderTotal?.tax_total ?? 0)) * 100;
        refunderOrderMutation.mutate({ orderId: order?.id ?? '', amountInCents: amountInCents });
    }

    const handleUserRefundOrder = () => {
        const amountInCents = (orderTotal?.user_owed_amount ?? 0) * 100;
        refunderOrderMutation.mutate({ orderId: order?.id ?? '', amountInCents: amountInCents });
    }

    return (
        <ContextMenuContent className="w-64">
            {!excludedItems.includes('Send Order ASAP') && (
                <ContextMenuItem onClick={handleSendOrder} disabled={disabledItems.includes('Send Order ASAP')}>
                    <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                        1
                    </span>
                    Send Order ASAP
                    <ContextMenuShortcut>Ctrl+Shift+W</ContextMenuShortcut>
                </ContextMenuItem>
            )}
            {!excludedItems.includes('Refund Org Portion of Order') && (
                <ContextMenuItem onClick={handleRefundOrgOrder} disabled={disabledItems.includes('Refund Org Portion of Order')}>
                    <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                        2
                    </span>
                    Refund Org Portion of Order
                    <ContextMenuShortcut>Ctrl+Shift+E</ContextMenuShortcut>
                </ContextMenuItem>
            )}
            {!excludedItems.includes('Refund User Portion of Order') && (
                <ContextMenuItem onClick={handleUserRefundOrder} disabled={disabledItems.includes('Refund User Portion of Order')}>
                    <span className='bg-primary-almost-black text-white font-righteous rounded-full flex items-center justify-center h-[28px] w-[28px]'>
                        1
                    </span>
                    Refund User Portion of Order
                    <ContextMenuShortcut>Ctrl+Shift+R</ContextMenuShortcut>
                </ContextMenuItem>
            )}
        </ContextMenuContent>
    );
};