import { OrderTotal, PaymentStatus } from 'ui'; // Ensure correct import paths

export interface LineGraphData {
    id: string;
    color: string;
    data: { x: string; y: number }[];
}
interface DataPoint {
    x: string;
    y: number;
}
export const getEnhancedOrderTotalsForGraph = (orderTotals: OrderTotal[]): LineGraphData[] => {
    if (!orderTotals) {
        return [];
    }

    const sortedData = orderTotals.sort(({ delivery_date: date1 }, { delivery_date: date2 }) => {
        if (date1 && date2) {
            return date1.localeCompare(date2);
        }
        return 0; // return 0 if either date is undefined
    });

    const paidData: DataPoint[] = [];
    const unpaidData: DataPoint[] = [];

    for (let orderTotal of sortedData) {
        let deliveryDate = orderTotal.delivery_date ?? ''; // provide a default value when deliveryDate is undefined
        let totalBeforeSubsidy = orderTotal.total_before_subsidy ?? 0; // provide a default value when total_before_subsidy is undefined
        if (orderTotal.org_payment_status === PaymentStatus.PAID) {
            paidData.push({ x: deliveryDate, y: totalBeforeSubsidy });
            unpaidData.push({ x: deliveryDate, y: 0 });
        } else {
            paidData.push({ x: deliveryDate, y: 0 });
            unpaidData.push({ x: deliveryDate, y: totalBeforeSubsidy });
        }
    }

    // Set the graph data with separate lines for paid and unpaid
    return [
        { id: "Paid", color: "hsl(120, 70%, 50%)", data: paidData },
        { id: "Unpaid", color: "hsl(0, 70%, 50%)", data: unpaidData }
    ];
};