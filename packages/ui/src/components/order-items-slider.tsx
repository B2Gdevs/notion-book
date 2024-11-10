import React, { useRef } from 'react';
import { Order, Store } from '..';
import { ScrollableItemLayout } from './scrollable-item-layout';
import { SummaryItemProps } from './summary-section';

interface OrderItemsSliderProps {
    order: Order;
    storeMap: { [key: string]: Store };
    brandMap: { [key: string]: any };
}

export const OrderItemsSlider: React.FC<OrderItemsSliderProps> = ({ order, storeMap, brandMap }) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={sliderRef} className="flex overflow-x-auto whitespace-nowrap scrollable-container lg:w-full font-righteous text-[16px] text-primary-spinach-green justify-start gap-8 sm:px-2 px-1 md:pr-[15%]">
            {order.items?.map(item => {
                const store = storeMap[item.store_id];
                const brand = store ? brandMap[store?.brand_id ?? ''] : null;

                const totalModifiersPrice = item.modifiers?.reduce((total, modifier) => total + ((modifier.price || 0) * modifier.quantity), 0) || 0;
                const totalItemPrice = item.price + totalModifiersPrice;
                const totalItemTax = totalItemPrice * (order.order_total?.tax || 0);
                const totalItemPriceWithTax = totalItemPrice + totalItemTax;

                const summaryItems: SummaryItemProps[] = [
                    { title: "Brand Name", value: brand?.name, description: "The brand associated with the item." },
                    { title: "Item Name", value: item.name, description: "The name of the item." },
                    { title: "Quantity", value: item.quantity.toString(), description: "The quantity ordered." },
                    { title: "Price", value: `$${item.price.toFixed(2)}`, description: "Price per unit." },
                    { title: "Total Item Price", value: `$${totalItemPrice.toFixed(2)}`, description: "Total price of the item including modifiers." },
                    { title: "Item Tax Total", value: `$${totalItemTax.toFixed(2)}`, description: "Total tax for the item." },
                    { title: "Total Item Price + Tax", value: `$${totalItemPriceWithTax.toFixed(2)}`, description: "Total price of the item including tax." }
                ];

                return (
                    <ScrollableItemLayout
                        key={item.id}
                        title={item?.name ?? ''}
                        summaryItems={summaryItems}
                    />
                );
            })}
        </div>
    );
};