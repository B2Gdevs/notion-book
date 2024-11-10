'use client';
import { useParams } from 'next/navigation';
import { OrdersTable } from 'ui'; // Ensure OrdersTable is exported from 'ui'

export default function OrdersPage() {
    const params = useParams()
    const orgId = params.id as string;
    return (
        <div className='container mx-auto'>
            <div className='overflow-x-auto'>
                <OrdersTable isInBastion={true} orgId={orgId}/>
            </div>
        </div>
    );
}