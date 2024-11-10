import React, { useState } from 'react';
import { Brand, Order, OrderItem, OrderStatus, Store, useUpdateOrder, Button, TitleComponent, StoreSelect, Textarea, BrandSelect, Label, CodeBlock, toast } from '..'; // Adjust import paths as necessary
import { calculateOrderTotals } from '../lib/orderUtils'; // Import the function
import { DualColumnLayout } from './dual-column-layout';
import { SummaryItemProps } from './summary-section';
import { OrderStatusSelect } from './order-status-select';
import { OrderContextActions } from './order-actions';
import { useRouter } from 'next/navigation';

interface SubOrderDetailProps {
    subOrder: Order;
    order: Order;
    store: Store | undefined;
    brand: Brand | undefined;
    isCourierView?: boolean;
}

export const SubOrderDetail: React.FC<SubOrderDetailProps> = ({ subOrder, order, store, brand, isCourierView }) => {
    const [colorfullNote, setColorfullNote] = useState(subOrder?.colorfull_note);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>(brand);

    const router = useRouter();
    // Calculate totals using the imported function
    const orderTotals = calculateOrderTotals(subOrder.items as OrderItem[], order.order_total?.tax, 0, 0, true);

    const leftColumnSummaryItems: SummaryItemProps[] = subOrder.items?.map(item => ({
        title: `${item.name} (${item.quantity}x)`,
        value: `$${(item.price * item.quantity).toFixed(2)}`,
        description: `Price per item: $${item.price.toFixed(2)}, Quantity: ${item.quantity}`
    })) || [];

    const updateOrderMutation = useUpdateOrder({
        onSuccess: () => {
            toast({
                title: 'Order Updated',
                description: 'The order has been updated successfully',
                duration: 3000,
            })
        },
        onError: () => {
            toast({
                title: 'Error',
                description: 'The order has been updated successfully',
                duration: 3000,
                variant: 'destructive'
            })
        }
    });

    const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
        const orderId = order?.id ?? '';
        updateOrderMutation.mutate({
            orderId,
            orderData: {
                ...order,
                status: newStatus
            }
        });
    }

    const handleColorfullNoteChange = (note: string) => {
        setColorfullNote(note);
        if (timer) clearTimeout(timer);
        const newTimer = setTimeout(() => {
            const orderId = subOrder?.id ?? '';
            updateOrderMutation.mutate({
                orderId,
                orderData: {
                    ...subOrder,
                    colorfull_note: note
                }
            });
        }, 3000); // Delay of 3 seconds
        setTimer(newTimer);
    };

    const handleSubstitutedStoreChange = (order: Order, store_id: string) => {
        const orderId = order?.id ?? '';
        updateOrderMutation.mutate({
            orderId,
            orderData: {
                ...order,
                substituted_store_id: store_id
            }
        });
    }

    const parseKitchenNote = (note: string) => {
        return note.split('\n').map((line, index) => {
            const isLabel = line.startsWith('#') || line.startsWith('###');
            return (
                <div key={index} className={isLabel ? 'bg-primary-almost-black  text-white p-1' : 'bg-white text-black p-1'}>
                    {line}
                </div>
            );
        });
    };

    let rightColumnSummaryItems: SummaryItemProps[] = [
        {
            title: "Modifiers",
            valueComponent: (<div>{subOrder.items?.flatMap(item => item.modifiers || []).length} modifiers</div>),
            description: `Modifiers: ${subOrder.items?.flatMap(item => item.modifiers || []).map(modifier => `(${modifier.name} $${modifier.price} x ${modifier.quantity})`).join(", ")}`
        },
        {
            title: "Sub Order Status",
            valueComponent: (
                <div className="flex">
                    <div className={
                        subOrder.status === OrderStatus.CONFIRMED || subOrder.status === OrderStatus.FULFILLED ? 'text-green-500' :
                            subOrder.status === OrderStatus.CANCELED || subOrder.status === OrderStatus.FAILED_TO_SEND_TO_KITCHEN || subOrder.status === OrderStatus.PARTIALLY_CANCELED ? 'text-red-500' :
                                'text-black'
                    }>
                        <OrderStatusSelect className='text' initialStatus={subOrder.status} onChange={(newStatus) =>
                            handleStatusChange(subOrder, newStatus)
                        } />
                    </div>
                </div>
            ),
            description: "Current status of the sub-order"
        },
        {
            title: "Brand",
            valueComponent: (
                <div>
                    {brand?.name || 'N/A'}
                </div>
            ),
            description: "Brand associated with the sub-order"
        },
        {
            title: subOrder.current_retry_order_id ? '(Retried)' : '',
            valueComponent: (
                <TitleComponent
                    leftTitle="Retry Order"
                    leftTitleClassName='text-xs transform -translate-x-1/2'
                    rightTitle={subOrder.current_retry_order_id}
                    rightTitleClassName='text-xs transform translate-x-1/2 text-black'>
                    <Button onClick={() => {
                        router.push(`/orders/${subOrder.current_retry_order_id}`)
                    }} className="bg-primary-spinach-green text-white rounded-lg shadow px-4 py-2">
                        View Retried Order
                    </Button>
                </TitleComponent>
            ),
            description: "The retried order, an order sent as a copy in case the original order failed"
        },
        { title: "Item Tax Total", value: `$${orderTotals?.tax_total?.toFixed(2)}`, description: "Total tax for the items" },
        { title: "Total Item Price + Tax", value: `$${orderTotals?.total?.toFixed(2)}`, description: "Total price of all items including tax" },
        {
            title: "Receipt Note",
            valueComponent: (
                <div>
                    {parseKitchenNote(subOrder.delivery_info?.note || '')}
                </div>
            ),
            description: "The note that is on the receipt of the order at the kitchen"
        },
        {
            title: "Colorfull Note",
            valueComponent: (
                <Textarea
                    className='mt-2 text-black'
                    value={colorfullNote}
                    onChange={(e) => handleColorfullNoteChange(e.target.value)}
                />
            ),
            description: "A note to describe if anything else out of the ordinary has occurred"
        },
    ];
    if (subOrder.status === OrderStatus.SUBSTITUTED) {
        rightColumnSummaryItems.unshift({
            title: "Substitute Store",
            valueComponent: (
                <div>
                    <BrandSelect initialBrandId={brand?.id} onChange={(selectedBrand) => {
                        setSelectedBrand(selectedBrand);
                    }} />
                    <StoreSelect initialStoreId={store?.id} allowedStoreIds={selectedBrand?.store_ids} onChange={(selectedStore) => {
                        handleSubstitutedStoreChange(subOrder, selectedStore?.id ?? '');
                    }} />
                </div>
            ),
            description: "The new store that the order was substituted to"
        });
    }

    if (isCourierView) {
        return (
            <div className='grid grid-cols-2'>
                <div>
                    {leftColumnSummaryItems.map(item => (
                        <div key={item.title}>
                            {item.title}
                            {/* Display modifiers linked to each item */}
                            {subOrder.items?.find(i => `${i.name} (${i.quantity}x)` === item.title)?.modifiers.map(modifier => (
                                <div key={modifier.id} className='text-sm italic'>
                                    {modifier.name} (x{modifier.quantity})
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div>
                    <div className="flex flex-col gap-1">
                        <div className={`flex flex-col justify-start items-start ${subOrder.status === OrderStatus.CONFIRMED || subOrder.status === OrderStatus.FULFILLED || subOrder.status === OrderStatus.PREPARED || subOrder.status === OrderStatus.PICKED_UP ? 'text-green-500' :
                            subOrder.status === OrderStatus.CANCELED || subOrder.status === OrderStatus.FAILED_TO_SEND_TO_KITCHEN || subOrder.status === OrderStatus.PARTIALLY_CANCELED ? 'text-red-500' :
                                'text-black'}`
                        }>
                            <Label className='font-righteous'>STATUS:</Label>

                            <OrderStatusSelect className='text' initialStatus={subOrder.status} onChange={(newStatus) =>
                                handleStatusChange(subOrder, newStatus)
                            } />
                        </div>
                        <div className='flex flex-col justify-start items-start'>
                            <Label className='font-righteous'>Brand: </Label> <CodeBlock className='text-xl'>{brand?.name || 'N/A'}</CodeBlock>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <DualColumnLayout
            leftTitle={subOrder.status == OrderStatus.SUBSTITUTED ? 'Substituted Sub Order' : 'Sub Order'}
            rightTitle={subOrder.substituted_store_id ? `Subbed Store: ${subOrder.substituted_store_id} / Order: ${subOrder.id}` : `Store: ${store?.id} / Order: ${subOrder.id}`}
            leftColumnSummaryItems={leftColumnSummaryItems}
            rightColumnSummaryItems={rightColumnSummaryItems}
            className="bg-gray-100 p-2 rounded-lg my-2"
        >
            {subOrder.status === OrderStatus.SUBSTITUTED && !subOrder.substituted_store_id && (
                <div className='text-red-500 text-center'>
                    Please select a brand and then store to substitute the order to
                </div>

            )}
            <OrderContextActions
                order={subOrder}
                orderTotal={orderTotals}
                disabledItems={[]}
                excludedItems={[]} />
        </DualColumnLayout>
    );
};