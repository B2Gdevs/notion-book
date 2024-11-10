'use client'
import React, { useState } from 'react';
import { CurrentOrdersTable, Org, OrgSelect, OrderItemsCurrentOrdersTable, GuestShareCurrentOrdersTable, Button, useSendRestaurantOrderItemsForecast, toast, DatePicker } from 'ui';

const CurrentOrdersPage: React.FC = () => {
    const [org, setOrg] = useState<Org>();
    const [guestOrdersOrg, setGuestOrdersOrg] = useState<Org>();
    const [forecastDate, setForecastDate] = useState<Date | undefined>(undefined);

    const { mutate: sendForecast } = useSendRestaurantOrderItemsForecast({
        onSuccess: () => {
            toast({
                title: 'Forecast Sent',
                description: 'The forecast has been successfully sent.',
                duration: 3000,
            });
        },
        onError: (error) => {
            console.error('Error sending forecast:', error);
            toast({
                title: 'Error',
                description: 'Failed to send the forecast.',
                duration: 3000,
            });
        },
    });

    return (
        <div className="m-8">
            <h2 className='font-righteous text-xl'>What should kitchens expect today?</h2>
            <div className='bg-primary-lime-green rounded-lg p-2 border-black border-2 mb-4 relative'>
                <div className='absolute top-1 right-1 flex flex-col justify-center items-center gap-1 max-w-[200px]'>
                    <DatePicker
                        selectedDate={forecastDate}
                        onSelect={setForecastDate}
                        className='bg-primary-spinach-green text-white flex justify-center items-center w-full'
                    />
                    {/* Add a date picker to select the forecast date */}
                    <Button
                        className='border border-4 border-secondary-pink-salmon bg-secondary-corn-yellow text-black hover:bg-secondary-peach-orange hover:border-secondary-corn-yellow w-full'
                        onClick={
                            () => {
                                if (!forecastDate) {
                                    toast({
                                        title: 'Error',
                                        description: 'Please select a date to send the forecast.',
                                        duration: 3000,
                                    })
                                    return;
                                }
                                sendForecast(forecastDate.toISOString())
                            }
                        }
                    >
                        Send Forecast
                    </Button>
                    <span className='italic text-xs'>Clicking this button will send the <span className='underline'>current</span> orders forecast to every kitchen</span>
                </div>
                <OrderItemsCurrentOrdersTable isRestaurantView={false} />
            </div>
            <h2 className='font-righteous text-xl'>Have corporation employees placed their orders?</h2>
            <div className='bg-purple-100 rounded-lg p-2 border-black border-2 mb-4'>
                <OrgSelect onChange={(org) => {
                    setOrg(org);
                }} />
                <CurrentOrdersTable orgClerkId={org?.external_id ?? ''} subtitle={`${org?.name} Users`} />
            </div>
            <h2 className='font-righteous text-xl'>What did guest users order via the share link?</h2>
            <div className='bg-blue-100 rounded-lg p-2 border-black border-2 mb-4'>
                <OrgSelect onChange={(org) => {
                    setGuestOrdersOrg(org);
                }} />
                <GuestShareCurrentOrdersTable orgClerkId={guestOrdersOrg?.external_id ?? ''} subtitle={`${org?.name} Guest Orders`} />
            </div>
        </div>
    );
};

export default CurrentOrdersPage;
