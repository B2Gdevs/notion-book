'use client';

import { JobTotalsTable } from "ui";

export default function OrdersPage() {
    return (
        <div className='container mx-auto'>
            {/* Orders table */}
            <div className='overflow-x-auto'>
                <JobTotalsTable  />
            </div>
        </div>
    );
}