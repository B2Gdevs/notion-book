'use client';

import { OrderTotalsTable } from "ui";

export default function OrdersPage() {
    return (
        <div className='container mx-auto'>
            {/* Orders table */}
            <div className='overflow-x-auto'>
                <OrderTotalsTable isCustomerFacing={false} />
            </div>
        </div>
    );
}