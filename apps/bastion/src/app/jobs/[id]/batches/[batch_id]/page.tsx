'use client';
import { useParams } from 'next/navigation';
import { OrdersTable } from 'ui';

export default function BrandPage() {
    const params = useParams()
    const batchId = params.batch_id as string
    return (
        <div className='container mx-auto'>

            {/* Brand table */}
            <div className='overflow-x-auto'>
                <OrdersTable batchId={batchId} isInBastion={true} />
            </div>
        </div>
    );
}