'use client'

import React from 'react';
import { Order, OrderStatus} from '../models/orderModels'; // Adjust import paths as necessary
import { Brand, Store } from '..';

interface OrderSheetCanceledSubOrdersSectionProps {
  canceledOrders?: Order[];
  canceledMainOrders?: Order[];
  stores?: Store[];
  brands?: Brand[];
}

export const OrderSheetCanceledSubOrdersSection: React.FC<OrderSheetCanceledSubOrdersSectionProps> = ({ canceledOrders, canceledMainOrders, stores, brands }) => {
    if (!((canceledMainOrders?.length ?? 0) > 0 && canceledMainOrders?.[0]?.status === OrderStatus.PARTIALLY_CANCELED)){
        return null
    }
    
    return (
        <>
        <div className="text-xs px-4 py-2 bg-secondary-pink-salmon rounded-lg text-center my-2 flex justify-between">You have items in your cart from a store that previously canceled one of your items already, please remove them to reorder.</div>
            {brands?.map((brand, index) => {
                const brandStores = stores?.filter(s => s.brand_id === brand.id);
                const brandOrders = canceledOrders?.filter(order => brandStores?.some(store => store.id === order.store_id));
                return (
                    <div key={index} className="text-xs px-4 py-2 bg-secondary-pink-salmon rounded-lg text-center my-2 flex justify-between">
                        <div className="font-righteous">Store: {brand.name}</div>
                        <ul className='italic'>
                            {brandOrders?.flatMap(order => order.items).map((item, itemIndex) => (
                                <li key={itemIndex}>Item: {item?.name ?? ''}</li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </>
    );
};