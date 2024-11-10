import React from 'react';
import { SummaryItemProps } from './summary-section';
import { DualColumnLayout } from './dual-column-layout';

interface RefundComponentProps {
    openConfirmDialog: () => void;
    openConfirmDialogForSubOrders: () => void;
    jobPaymentIntentId?: string;
}

export const RefundComponent: React.FC<RefundComponentProps> = ({
    openConfirmDialog,
    openConfirmDialogForSubOrders,
    jobPaymentIntentId
}) => {
    const refundItems: SummaryItemProps[] = [
        {
            title: "Refund Failed Orders",
            description: "Refund canceled and unsuccessful items that did not make it to the kitchen for various reasons.",
            action: openConfirmDialogForSubOrders,
            actionDisplayText: "Refund Failed Orders"
        },
        {
            title: "Refund Job",
            description: "Completely refund the job to the organization and all users that have paid overages.",
            action: openConfirmDialog,
            actionDisplayText: "Refund Job",
            valueComponent: jobPaymentIntentId ? <span className="text-primary-lime-green p-2">Eligible</span> : <span className="p-2 text-secondary-pink-salmon">Not Eligible</span>,
            isActionActive: !!jobPaymentIntentId
        }
    ];

    const quote = (
        <div className='text-white flex text-right flex-col'>
            <div className='italic text-xl '>Amat Victoria Curam</div>
            <p className="text-sm italic ">- Seneca</p>
        </div>
    );

    return (
        <DualColumnLayout
            leftTitle="Refund Options"
            className='p-5 bg-primary-spinach-green border-black'
            leftColumnSummaryItems={[]} // Assuming no items for the left column
            rightColumnSummaryItems={refundItems}
            childrenPosition="above"
            children={quote}
            hideLeftColumn={true}

        />
    );
};