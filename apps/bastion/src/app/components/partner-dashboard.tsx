'use client';

import React from 'react';
import { ColorfullLogo, OrderItemsCurrentOrdersTable } from 'ui';

interface PartnerDashboardProps {
    area_id?: string;
    isColorfullUser?: boolean;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({}) => {

    return (
        <div className='flex flex-col justify-center items-center gap-2 bg-primary-off-white relative pt-20'>
            <div className='w-full flex justify-center items-center p-2 border-b border-[#425F57] fixed z-40 bg-primary-off-white top-0'>
                <ColorfullLogo />
            </div>
            <h2 className='font-righteous text-3xl text-primary-spinach-green'>
                Partner Dashboard
            </h2>

            <OrderItemsCurrentOrdersTable isRestaurantView={false} isPartnerView={true} />
        </div>
    )
};