import React from 'react';
import { Button, Checkbox, Collapsible, OrderItem, TextBox, calculateOrderTotals } from 'ui';
import { GlobalState, useGlobalStore } from '../../stores/globalStore';
import { TrashIcon } from 'lucide-react';

interface OrderSheetOrderItemCollapsibleProps {
    orderItem: OrderItem;
    index: number;
    tax: number;
    subsidy: number;
    onOrderItemRemove?: (orderItem: OrderItem) => void;
    isCheckout: boolean;
    subHeaderText?: string;
    onOrderItemChange?: (orderItem: OrderItem) => void;
    disabled?: boolean;
}

export const OrderSheetOrderItemCollapsible: React.FC<OrderSheetOrderItemCollapsibleProps> = ({
    orderItem,
    index,
    tax,
    subsidy,
    onOrderItemRemove,
    isCheckout,
    subHeaderText,
    onOrderItemChange,
    disabled,
}) => {
	const globalStore = useGlobalStore() as GlobalState;

    const handleSetOrderItem = () => {
        globalStore.setSelectedOrderItem(orderItem);
    }

    const handleCloseSheet = () => {
        
        handleSetOrderItem();
        globalStore.setWasSheetOpen(true);
        globalStore.setIsSheetOpen(false);
        // might need to debounce this and call it first
        globalStore.setIsOrderItemDialogOpen(true);
    }
    // Handlers for adding and subtracting quantity
    const handleQuantityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newQuantity = Number(event.target.value);
        const updatedOrderItem = { ...orderItem, quantity: newQuantity };
        onOrderItemChange?.(updatedOrderItem);
    };

    const handleDeleteOrderItem = () => {
        onOrderItemRemove?.(orderItem);
    };

    return (
        <Collapsible
            key={`${orderItem.id}-${index}`}
            stepHeaderProps={{
                step: (index + 1).toString(),
                text: `${orderItem?.name ?? ''} - $${orderItem?.price.toFixed(2) ?? 0}`,
                secondaryText: `$${calculateOrderTotals([orderItem], tax, subsidy)?.subtotal?.toFixed(2)}`,
                orderPopup: true,
            }}
            expanded={false}
            imageSrc={''}
            endComponent={
                <div className='flex justify-center items-center gap-2'>
                    <select
                        value={orderItem.quantity}
                        onChange={handleQuantityChange}
                        disabled={disabled}
                        className='p-1 rounded-lg'
                    >
                        {[...Array(100).keys()].map((_, i) => (
                            <option value={i + 1} key={i}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                    <TrashIcon
                        className={`w-6 h-6 ${disabled ? 'text-gray-400' : 'text-secondary-pink-salmon'}`}
                        onClick={disabled ? undefined : handleDeleteOrderItem}
                    />
                </div>

            }
            isCheckout={isCheckout}
            subHeaderText={subHeaderText}
        >
            <div className='mt-2 flex flex-col justify-start items-start gap-1'>
                <Button onClick={handleCloseSheet} className='w-full'>
                    Edit Item
                </Button>
                {orderItem?.modifiers?.map((modifier, modIndex) => (
                    <Checkbox
                        key={`${modifier.id}-${modIndex}`}
                        text={modifier.name}
                        currencyValue={modifier.price}
                        checked={true}
                        disabled={true}
                        isCheckout={true}
                    />
                ))}
                <TextBox
                    maxChars={100}
                    headerText='Special Requests?'
                    text={orderItem?.note}
                    disabled={true}
                />
            </div>
        </Collapsible>
    );
};
