
'use client'

import { TruckIcon } from 'lucide-react';
import React from 'react';
import { CodeBlock } from './code-block';
import { OrderSlider } from './order-slider';
import { RestaurantScheduleList } from './restaurant-schedule-list';
import { TitleComponent } from './title-component';
import { Order, OrderStatus } from '..';

interface DailyJobDashboardProps {
    selectedDate: Date | undefined;
    potentialMetrics: any; // Define a more specific type if possible
    orgs: any[]; // Define a more specific type if possible
    orgsOrders: Record<string, Order[]>; // Define a more specific type if possible
    potentialUserOrders: any; // Define a more specific type if possible
    userMap: Record<string, any>; // Define a more specific type if possible
    shares: any[]; // Define a more specific type if possible
    setSelectedDate: (date: Date) => void;
}

export const DailyJobDashboard: React.FC<DailyJobDashboardProps> = ({
    selectedDate,
    potentialMetrics,
    orgs,
    orgsOrders,
    potentialUserOrders,
    userMap,
    shares,
    setSelectedDate
}) => {

    return (
        <TitleComponent
            leftTitle='Daily Dashboard'>
            <RestaurantScheduleList
                className='mt-4'
                dateSelected={selectedDate}
                dateSetter={setSelectedDate}
                withCalender={true}
                variant="list"
                value={potentialMetrics?.potentialOrderTotal?.total ?? 0}
            />
            {selectedDate && (
                <div className='flex justify-center p-2 space-x-4'>
                    <div className='w-1/2'>
                        <TitleComponent
                            className='my-6'
                            leftTitle={`${selectedDate?.toDateString() ?? 'No Date Selected'} - Jobs (x${potentialMetrics?.totalJobs ?? 0}) `}>
                            {orgs && orgs.map((org) => {
                                let orgOrders = orgsOrders?.[org?.id ?? ''] ?? [];
                                orgOrders = orgOrders.filter((order) => order?.status !== OrderStatus.CANCELED);
                                const allOrdersCancelled = orgOrders.length === 0;

                                return (
                                    <TitleComponent
                                        key={org.id}
                                        leftTitle={`Job: ${org.name}`}
                                        leftTitleClassName='space-x-2'
                                        leftTitleIcon={<TruckIcon className='text-xxs' />}
                                        rightTitle={allOrdersCancelled ? 'All Orders Cancelled' : `Actual Orders Placed: ${orgsOrders?.[org?.id ?? '']?.length ?? 0}`}
                                        className={`my-6 ${allOrdersCancelled ? 'border-4 border-red-500' : ''}`}
                                    >
                                        <div className='flex justify-between items-center mt-5'>
                                            <div className=''>Drop Off Location</div>
                                            <CodeBlock className="bg-gray-100 rounded">
                                                {`${org.locations?.[0]?.address ?? 'No Address'}`}
                                            </CodeBlock>
                                        </div>
                                    </TitleComponent>
                                )
                            })}
                        </TitleComponent>
                    </div>
                    <div className='w-1/2'>
                        <OrderSlider
                            potentialUserOrderItems={potentialUserOrders}
                            userMap={userMap}
                            orgs={orgs}
                            potentialMetrics={potentialMetrics}
                            shares={shares}
                        />
                    </div>
                </div>
            )}
        </TitleComponent>
    );
};