'use client';

import { useSession } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { AreaSelect, ColorfullLogo, DeliveryJobList, StepHeader, useGetCouriers } from 'ui';
interface CourierDashboardProps {
    area_id?: string;
    isColorfullUser?: boolean;
}

export const CourierDashboard: React.FC<CourierDashboardProps> = ({
    area_id = "8u8haaLK0BwO64KcKUXF", // Default to Austin area ID
    isColorfullUser = false,
}) => {
    const [selectedAreaId, setSelectedAreaId] = useState<string>(area_id);
    const router = useRouter();

    const session = useSession();

    const userClerkId = session.session?.user.id;

    const { data: couriers } = useGetCouriers({
        clerkId: userClerkId ?? ''
    })

    const courier = couriers?.[0];

    const handleAreaChange = (areaId: string) => {
        setSelectedAreaId(areaId);
    };

    return (
        <div className='flex flex-col justify-center items-center gap-2 bg-primary-off-white relative pt-20'>
            <div className='w-full flex justify-center items-center p-2 border-b border-[#425F57] fixed z-40 bg-primary-off-white top-0'>
                <ColorfullLogo />
            </div>
            <h2 className='font-righteous text-3xl text-primary-spinach-green'>
                Courier Dashboard
            </h2>
            <p
                className='underline text-secondary-peach-orange'
                onClick={() => {
                    const guideElement = document.getElementById('guide-section');
                    if (guideElement) {
                        guideElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
            >
                Refer to Delivery Process Guide
            </p>
            <h2 className='font-righteous text-3xl text-primary-spinach-green mt-4'>
                Today's Deliveries
            </h2>

            {isColorfullUser && (
                <div className='bg-primary-spinach-green p-1 rounded-lg border border-2 border-black'>
                    <p className='italic text-white'>
                        Colorfull View
                    </p>
                    <p className='text-white'>
                        Current Area ID: {selectedAreaId}
                    </p>
                    <AreaSelect
                        selectedAreaId={selectedAreaId}
                        onChange={(areaId) => handleAreaChange(areaId)}
                    />
                </div>
            )}

            <DeliveryJobList
                isSearchingToday={true}
                areaId={courier?.area_id ? courier?.area_id : selectedAreaId}
                courierId={courier?.id}
                // courierId='7YI5JfJnTCgfbCJJIUY6'
                isColorfullUser={isColorfullUser}
                // isColorfullUser={false}
            />

            <p id="guide-section" className='flex flex-col justify-center items-center gap-4 mt-4'>
                <span className='font-righteous text-primary-spinach-green text-2xl'>
                    Delivery Guide
                </span>
                <div className='bg-white rounded-lg p-2 flex justify-center items-center gap-2'>
                    <div className='shadow border border-1 border-black rounded-lg flex flex-col justify-center items-center w-1/4 h-[44px]'>
                        <span className='text-red-400'>4</span>
                        <span className='text-center text-xs'>Not Ready</span>
                    </div>
                    <StepHeader
                        textFontFamily='font-sans'
                        text={`"Not Ready" means the kitchen is still preparing the food.`}
                        step={'1'}
                        orderPopup={true}
                    />
                </div>
                <div className='bg-white rounded-lg p-2 flex justify-center items-center gap-2'>
                    <div className='border border-4 border-red-400 rounded-lg w-1/4 h-[44px]' />
                    <StepHeader
                        textFontFamily='font-sans'
                        text={`The order is not yet ready, don't leave just yet.`}
                        step={'2'}
                    />
                </div>
                <div className='bg-white rounded-lg p-2 flex justify-center items-center gap-2'>
                    <div className='border border-4 border-green-400 rounded-lg w-1/4 h-[44px]' />
                    <StepHeader
                        textFontFamily='font-sans'
                        text={`When you see a green status, you're good to deliver the order!`}
                        step={'3'}
                    />
                </div>
                {/* <div className='bg-white rounded-lg mx-2 p-2'>
                    <StepHeader 
                        textFontFamily='font-sans'
                        text={`Once the orders are picked up, click the "Mark job as Picked Up" button.`}
                        step={'4'}
                    />
                </div> */}
                <div className='bg-white rounded-lg p-2 flex justify-center items-center gap-2'>
                    <div className='bg-primary-lime-green rounded-lg w-1/4 h-[44px] flex justify-center items-center relative'>
                        <span className='text-center text-xs font-righteous text-primary-spinach-green'>
                            Delivered
                        </span>
                        <img
                        src='https://res.cloudinary.com/dzmqies6h/image/upload/v1726260194/001-press-button_hlckly.svg'
                        alt='Pointer icon'
                        className='w-6 h-6 absolute -bottom-2 right-2'
                    />
                    </div>
                    <StepHeader
                        textFontFamily='font-sans'
                        text={`Once the orders are delivered, click the "Mark Job as Delivered" button.`}
                        step={'4'}
                    />
                </div>
            </p>
            <p className='italic text-gray-500 hidden'>
                To access past delivery jobs, click <span className='underline cursor-pointer' onClick={() => router.push('/courier-jobs')}>here</span>.
            </p>
        </div>
    )
};