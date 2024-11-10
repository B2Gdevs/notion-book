'use client';
import { OrderItemsTable } from 'ui'; // Ensure OrdersTable is exported from 'ui'

export default function OrdersPage() {
    return (
        <div className='container mx-auto'>
            {/* Orders table */}
            <div className='overflow-x-auto'>
                <OrderItemsTable  />
            </div>
        </div>
    );
}