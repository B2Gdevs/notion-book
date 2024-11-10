'use client';
import { DeliveryJobsTable } from 'ui'; // Ensure BrandsTable is exported from 'ui'

export default function BrandPage() {
    return (
        <div className='container mx-auto'>
            <div className='overflow-x-auto'>
                <DeliveryJobsTable />
            </div>
        </div>
    );
}