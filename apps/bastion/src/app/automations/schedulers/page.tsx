'use client';
import { SchedulersTable } from 'ui'; // Ensure BrandsTable is exported from 'ui'

export default function SchedulersPage() {
    return (
        <div className='container mx-auto'>

            {/* Brand table */}
            <div className='overflow-x-auto'>
                <SchedulersTable />
            </div>
        </div>
    );
}