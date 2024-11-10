import React from 'react';
import { OrderTotal } from '../models/totalModels';
import { Button } from '..';
import { MobileOrderTotalCard } from './mobile-order-total-card';

interface OrderTotalsTableMobileViewProps {
    orderTotalPageData: OrderTotal[];
    goPrevPage: () => void;
    goNextPage: () => void;
    pageIndex: number;
    hasMoreOrderTotals: boolean;
}

export const OrderTotalsTableMobileView: React.FC<OrderTotalsTableMobileViewProps> = ({
    orderTotalPageData,
    goPrevPage,
    goNextPage,
    pageIndex,
    hasMoreOrderTotals
}) => {
    return (
        <div>
            {orderTotalPageData?.map((orderTotal: OrderTotal) => (
                <MobileOrderTotalCard key={orderTotal.id + 'mobile-card'} orderTotal={orderTotal} />
            ))}
            <Button onClick={goPrevPage} disabled={pageIndex === 1}>Previous</Button>
            <Button onClick={goNextPage} disabled={!hasMoreOrderTotals}>Next</Button>
        </div>
    );
};