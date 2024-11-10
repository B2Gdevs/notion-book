import React from 'react';
import { Order } from 'ui';
import { to12HourFormat } from './app-page';
import { MoonStar } from 'lucide-react';

interface OrderPlacedProps {
    order?: Order; // Assuming Order is a type that contains order details
    deliveryWindowOrderCutoffTime?: string;
}

export const OrderPlaced: React.FC<OrderPlacedProps> = ({ order, deliveryWindowOrderCutoffTime }) => {

    const isDeliveryWindowAfterLunch = (deliveryWindowOrderCutoffTime ?? "17:00") > "14:00";
    if (!order) return (
        <div className='bg-white flex flex-col justify-center items-center gap-2 rounded-lg px-4 pt-4 pb-4 shadow-md w-72 relative'>
            <h1 className='font-righteous lg:text-xl text-primary-spinach-green'>Order by {deliveryWindowOrderCutoffTime ? to12HourFormat(deliveryWindowOrderCutoffTime) : '10:30 AM'}</h1>
            {isDeliveryWindowAfterLunch && (
                <MoonStar className='absolute top-2 right-2' />
            )}
            <img
                src='https://res.cloudinary.com/dzmqies6h/image/upload/v1718552486/bag_1_anohso.png'
                alt='Delivery bag icon'
                className='w-20 h-20 mt-2'
            />
            <div className='text-secondary-peach-orange font-bold text-center'>Don't forget to order {isDeliveryWindowAfterLunch ? 'dinner' : 'lunch'}!</div>
            <div className='bg-black text-white text-xs flex justify-start items-center p-2 rounded-md mt-2'>
                <img
                    src='https://res.cloudinary.com/dzmqies6h/image/upload/v1718553062/truck-time_cozeji.png'
                    alt='Delivery truck with time icon'
                    className="mr-2 w-5 h-5"
                />
                <span>Delivery time will be available once the order has been placed.</span>
            </div>
        </div>
    );

    // Function to format the delivery time
    const formatDeliveryTime = (deliveryTime: string) => {
        const date = new Date(deliveryTime);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'America/Chicago'
        };
        return date.toLocaleString('en-US', options);
    };

    return (
        <div className="flex flex-col justify-center items-center gap-2 rounded-lg bg-primary-lime-green-darker p-4 shadow-md w-72 relative">
            <h1 className='font-righteous lg:text-xl text-gray-800'>Order Placed!</h1>
            {isDeliveryWindowAfterLunch && (
                <MoonStar className='absolute top-2 right-2' />
            )}
            <div className='w-full font-righteous'>
                {order.items?.map((item, index) => (
                    <div key={index}>
                        <div className='w-full flex justify-between items-center'>
                            <span className='text-md'>{item.name}</span><span className='text-xl'>x{item.quantity}</span>
                        </div>
                        <div className='border-b border-2 border-black w-full my-2' />
                    </div>
                ))}
            </div>
            <div className='w-full flex justify-between items-center text-xl font-righteous'>
                <span>Amount Owed:</span><span>${order.order_total?.total?.toFixed(2)}</span>
            </div>
            <div className='bg-black text-white text-xs flex justify-start items-center p-2 rounded-md mt-2'>
                <img
                    src='https://res.cloudinary.com/dzmqies6h/image/upload/v1718553062/truck-time_cozeji.png'
                    alt='Delivery truck with time icon'
                    className="mr-2 w-5 h-5"
                />
                <span>
                    {order.fulfillment_info && order.fulfillment_info.delivery_time ? formatDeliveryTime(order.fulfillment_info.delivery_time) : 'Not specified'}
                </span>
            </div>
        </div>
    );
};