'use client';

import { useSession } from '@clerk/nextjs';
import { DeliveryJobList, useGetCouriers, useGetOrg, useGetUsers } from 'ui'; 

export default function CourierJobsPage() {

    const session = useSession();
    const userEmail = session.session?.user.primaryEmailAddress?.emailAddress
    const { data: userEmailSessionUsers } = useGetUsers({
        email: userEmail ?? ''
    })

    const { data: couriers } = useGetCouriers({
        email: userEmail ?? ''
    })

    // Check if userEmail ends in "colorfull.ai" to determine if user is a Colorfull user
    const isColorfullUser = userEmail?.endsWith('colorfull.ai');

    const courier = couriers?.[0];
    const user = userEmailSessionUsers?.[0];
    const orgIdToUse = user?.org_id ?? courier?.org_id ?? '';

    const { data: org } = useGetOrg(orgIdToUse)

    return (
        <div className='container mx-auto'>
            <h2 className='font-righteous text-2xl my-2'>Delivery Jobs History</h2>
            <DeliveryJobList 
                areaId={org?.locations?.[0]?.area_id ?? ''}
                isColorfullUser={!!isColorfullUser}
                // isColorfullUser={false}
                courierId={courier?.id ?? ''}
                // courierId='7YI5JfJnTCgfbCJJIUY6'
            />
        </div>
    );
}