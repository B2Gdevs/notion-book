import { DeliveryJob } from "../../models/deliveryJobModels";
import { Order } from "../../models/orderModels";
import { useGetBatchOrdersByIds } from "../batchOrderHooks";
import { useGetOrdersByIds } from "../orderHooks";
import { useGetOrderTotals } from "../totalHooks";
import { useStoresAndBrands } from "./useStoresAndBrands";
import { OrderTotal } from "../../models/totalModels";
import { useGetOrgsByIds } from "../orgHooks";

export function useGetSubOrders(job: DeliveryJob) {
    const {data:batches} = useGetBatchOrdersByIds(job.batch_ids);
    const orderIds = batches?.map(batch => batch.order_ids).flat() || [];
    const {data:orders} = useGetOrdersByIds(orderIds);
    const subOrderIds = orders?.map(order => order.sub_order_ids).flat().filter(id => id !== undefined) || [];
    const {data:subOrders} = useGetOrdersByIds(subOrderIds as string[]);
    return subOrders;
}

export function useDownloadSubOrderTotalsAsCSV(subOrders: Order[]) {
    const subOrderTotalIds = subOrders.map(order => order?.order_total_id ?? '');
    const {data:subOrderTotals} = useGetOrderTotals({
        ids: subOrderTotalIds
    });

    // make subordertotals a record with id and total
    const subOrderTotalsMap = subOrderTotals?.reduce((acc:any, total: OrderTotal) => {
        acc[total?.id ?? ''] = total;
        return acc;
    }, {} as Record<string, OrderTotal>);

    const { storeMap, brandMap } = useStoresAndBrands(subOrders ?? []);

    const orgIds = subOrders.map(order => order?.org_id ?? '');
    // only use orgIds that are unique
    const uniqueOrgIds = Array.from(new Set(orgIds));
    const {data:orgs} = useGetOrgsByIds(uniqueOrgIds);
    const orgMap = orgs?.reduce((acc, org) => {
        acc[org?.id ?? ''] = org;
        return acc;
    }, {} as Record<string, any>) || {};

    const handleDownload = () => {
        const headers = "Order ID,Customer Name,Subtotal,Subsidy,Tax,Tip,Delivery Fee,Total,Tax Total,User Payment Status,Org Payment Status,User Owed Amount,Delivery Date,Order Link,Brand Name,Store Name\n,Org Name\n";
        const csv = subOrders.map(order => {
            if (!order) return '';
            const total = subOrderTotalsMap[order?.order_total_id ?? ''];
            const store = storeMap[order?.store_id ?? ''];
            const brand = brandMap[store?.brand_id ?? ''];
            const org = orgMap[order?.org_id ?? ''];
            const orderLink = `https://colorfull-bastion-git-main-colorfull-ai.vercel.app/orders/${order?.id}`;
            const brandName = brand?.name ?? '';
            const storeName = store?.name ?? '';
            return `${order.id},${order.customer?.first_name + " " + order.customer?.last_name},${total.subtotal},${total.discount},${total.tax},${total.tip},${total.delivery_fee},${total.total},${total.tax_total},${total.user_payment_status},${total.org_payment_status},${total.user_owed_amount},${total.delivery_date},${orderLink},${brandName},${storeName},${org?.name}`;
        }).join('\n');

        const blob = new Blob([headers + csv], {type: 'text/csv'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sub_order_totals.csv';
        a.click();
        URL.revokeObjectURL(url);

    };

    return handleDownload;
}