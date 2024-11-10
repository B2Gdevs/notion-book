'use client';
import { StoresTable } from 'ui'; // Ensure StoresTable is exported from 'ui'

export default function StorePage() {
    return (
        <div className='container mx-auto'>

            {/* Store table */}
            <div className='overflow-x-auto'>
                <StoresTable />
            </div>
        </div>
    );
}