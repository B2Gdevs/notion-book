'use client';

import { OrdersTable } from 'ui';

export default function OrdersPage() {
    return (
        <div className='container mx-auto'>
            <div className='overflow-x-auto'>
                <OrdersTable isInBastion={true} />
            </div>
        </div>
    );
}