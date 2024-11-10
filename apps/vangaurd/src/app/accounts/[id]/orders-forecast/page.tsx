'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Button, DistributionListType, OrderItemsCurrentOrdersTable, toast, useGetOrgsByQuery, useUpdateOrg, } from 'ui';

export default function OrdersForecastPage() {

    const params = useParams();
    const orgClerkId = params.id as string;
    const { data: orgs } = useGetOrgsByQuery({ externalId: orgClerkId });
    const queryClient = useQueryClient();
    const org = orgs?.[0] ?? null;
    const orgId = org?.id ?? '';

    const updateOrgMutation = useUpdateOrg({
        onSuccess: () => {
            toast({
                title: 'Org updated',
                description: 'Org updated successfully',
                duration: 3000,
            });
            queryClient.invalidateQueries(['org', orgId]);
        },
    });

    // Function to initialize distribution list with all keys and existing data
    const getInitialDistributionList = (): Record<DistributionListType, string[]> => {
        const initialList: Partial<Record<DistributionListType, string[]>> = {};
        Object.values(DistributionListType).forEach(type => {
            initialList[type] = org?.distribution_list?.[type] || [];
        });
        return initialList as Record<DistributionListType, string[]>;
    };

    // State to hold distribution list data
    const [distributionList, setDistributionList] = useState<Record<DistributionListType, string[]>>(getInitialDistributionList);

    // Handler to update distribution list
    const handleDistributionListChange = (type: DistributionListType, value: string[]) => {
        setDistributionList(prev => ({ ...prev, [type]: value }));
    };

    // Submit handler
    const handleSubmitDistributionList = () => {
        if (!org) return;
        updateOrgMutation.mutate({
            ...org,
            distribution_list: distributionList
        });
    };

    useEffect(() => {
        if (org) {
            setDistributionList(getInitialDistributionList());
        }
    }, [org]);

    return (
        <div className="m-8">
            <div className='bg-purple-100 rounded-lg p-2 border-black border-2 mb-4'>
                <div className='my-2 grid grid-cols-2'>
                    <div>
                        <h2 className='font-righteous'>
                            Orders Forecast
                        </h2>
                        <div className='italic w-3/4'>
                            Select a date to get an idea of the number of items coming your way.
                            <br />
                            Many users place orders <span className='underline'>an hour</span> before the cutoff time, so these numbers may change quickly. Orders may be canceled or modified up until the cutoff time.
                            <br />
                            <span className='text-red-500'>
                                Please understand that these are estimates and are <span className='underline'>not</span> to be used in place of the orders we send through Otter.
                            </span>
                        </div>
                    </div>
                    <div>
                        <h2 className='font-righteous'>Distribution List</h2>
                        <div className='italic flex flex-col justify-start items-start gap-1'>
                            <span>
                                Order forecast emails are sent to your admin email.
                            </span>
                            <span className='underline'>
                                To add more recipients, enter their email addresses below, separated by commas (e.g., johnsmith@gmail.com, janedoe@gmail.com).
                            </span>
                        </div>
                        <div className='flex justify-start items-center gap-2 my-1'>
                            <input
                                type="text"
                                value={distributionList[DistributionListType.ORDER_ITEMS_FORECAST]?.join(', ') || ''}
                                onChange={(e) => handleDistributionListChange(DistributionListType.ORDER_ITEMS_FORECAST, e.target.value.split(',').map(item => item.trim()))}
                                className='border-2 border-black rounded-lg px-2 py-1 w-full'
                            />
                        </div>
                        <Button onClick={handleSubmitDistributionList}>Save Distribution List</Button>
                    </div>
                </div>
                <OrderItemsCurrentOrdersTable
                    storeIds={org?.store_ids ?? []}
                    orgDeliveryWindowId={org?.delivery_window_id ?? ''}
                    isRestaurantView={true}
                />
            </div>
        </div>
    );
};

