'use client'
import { useParams } from 'next/navigation';
import { CurrentOrdersTable, GuestShareCurrentOrdersTable, useGetOrgsByQuery, } from 'ui';

export default function CurrentOrdersPage() {
    const params = useParams();
    const orgClerkId = params.id as string;
    const { data: orgs } = useGetOrgsByQuery({ externalId: orgClerkId });
    const org = orgs?.[0] ?? null;

    return (
        <div className="m-8">
            <div className='bg-purple-100 rounded-lg p-2 border-black border-2 mb-4'>
                <CurrentOrdersTable
                    orgClerkId={orgClerkId}
                    subtitle={`${org?.name} Users`}
                    isInVangaurd={true}
                />
            </div>
            <div className='bg-green-100 rounded-lg p-2 border-black border-2 mb-4'>
                <GuestShareCurrentOrdersTable 
                    orgClerkId={orgClerkId}
                    subtitle={`${org?.name} Guests`}
                    isInVangaurd={true}
                />
            </div>
        </div>
    );
};

