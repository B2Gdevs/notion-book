import React from 'react';
import _ from 'lodash';
import { TitleComponent } from './title-component';
import { KpiCard } from './kpi-card';

interface KpiSectionProps {
    jobTotals: any[]; // Define a more specific type if possible
    invoiceSummaryTotals: {
        sumOfUserTotals: number;
        sumOfJobTotals: number;
        sumOfSubTotals: number;
        sumOfOrderTaxes: number;
        sumOfDeliveryFeeTaxes: number;
        sumDeliveryFeesTotal: number;
        taxTotal: number;
    };
    menuItems: any[]; // Define a more specific type if possible
    handleMenuClick: (buttonName: string) => void;
}

export const ColorfullKpiSection: React.FC<KpiSectionProps> = ({ jobTotals, invoiceSummaryTotals, menuItems, handleMenuClick }) => {
    return (
        <TitleComponent
            leftTitle='How Well Colorfull Is Doing!'
            leftTitleClassName='text-white'
            className='flex flex-col'>
            <div className='flex flex-wrap mt-4 w-full'>
                <div className='flex flex-1 flex-col p-2'>
                    <TitleComponent leftTitle='KPIs' rightTitle='Volume'>
                        <KpiCard title="Total Jobs" value={jobTotals?.length ?? 0} />
                        <KpiCard title="Total Orders" value={_.sum(jobTotals?.map(jobTotal => jobTotal.num_orders)) ?? 0} />
                    </TitleComponent>
                </div>
                <div className='flex flex-1 flex-col p-2'>
                    <TitleComponent leftTitle='Revenue' rightTitle='Foundational Metrics'>
                        <KpiCard title="User Revenue" value={(invoiceSummaryTotals.sumOfUserTotals + invoiceSummaryTotals?.sumOfUserTotals).toFixed(2)} />
                        <KpiCard title="Org Revenue" value={(invoiceSummaryTotals.sumOfJobTotals - invoiceSummaryTotals.sumOfUserTotals).toFixed(2)} />
                        <KpiCard title="Revenue With Taxes Collected" value={(invoiceSummaryTotals.sumOfSubTotals + invoiceSummaryTotals.sumOfOrderTaxes + invoiceSummaryTotals.sumOfDeliveryFeeTaxes + invoiceSummaryTotals.sumDeliveryFeesTotal).toFixed(2)} />
                    </TitleComponent>
                </div>
                <div className='flex flex-1 flex-col p-2'>
                    <TitleComponent
                        menuItems={menuItems}
                        onMenuItemClick={handleMenuClick}
                        leftTitle='Taxes'
                        rightTitle='Additional Metrics'>
                        <KpiCard title="Order Subtotal Sum" value={(invoiceSummaryTotals.sumOfSubTotals).toFixed(2)} />
                        <KpiCard title="Total Delivery Fees" value={(invoiceSummaryTotals.sumDeliveryFeesTotal).toFixed(2)} />
                        <KpiCard title="Total Taxes Collected" value={(invoiceSummaryTotals.sumOfDeliveryFeeTaxes + invoiceSummaryTotals.taxTotal).toFixed(2)} />
                    </TitleComponent>
                </div>
            </div>
        </TitleComponent>
    );
};