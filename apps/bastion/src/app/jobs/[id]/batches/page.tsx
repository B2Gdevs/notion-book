'use client';
import { useParams } from 'next/navigation';
import { BatchOrdersTable } from 'ui';

export default function BrandPage() {
    const params = useParams()
    const jobId = params.id as string
    return (
        <div className='container mx-auto'>

            {/* Brand table */}
            <div className='overflow-x-auto'>
                <BatchOrdersTable deliveryJobId={jobId} />
            </div>
        </div>
    );
}