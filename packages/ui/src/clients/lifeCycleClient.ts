import { BaseClient } from './baseClient';

export class LifeCycleClient extends BaseClient {
    public static async transferAmountsToRestaurantsForJobs(jobIds: string[], token: string | null): Promise<{ status: string }> {
        const endpoint = `/life-cycle/transfer-amounts-to-restaurants-for-jobs`;
        return this.postData(endpoint, { job_ids: jobIds }, token, null);
    }

    public static async chargeOrgForJobs(jobIds: string[], chargeDeliveryFee: boolean = false, token: string | null): Promise<{ status: string }> {
        const endpoint = `/life-cycle/charge-for-jobs`;
        return this.postData(endpoint, { job_ids: jobIds, charge_delivery_fee: chargeDeliveryFee }, token, null);
    }

    public static async completeJobs(jobIds: string[], chargeDeliveryFee: boolean, token: string | null): Promise<{ status: string }> {
        const endpoint = `/life-cycle/complete-jobs`;
        return this.postData(endpoint, { job_ids: jobIds, charge_delivery_fee: chargeDeliveryFee }, token, null);
    }

    public static async sendOrderToKitchen(orderId: string, sendASAP: boolean, token: string | null): Promise<{ status: string }> {
        const endpoint = `/life-cycle/send-order-to-kitchen`;
        return this.postData(endpoint, { order_id: orderId, send_asap: sendASAP }, token, null);
    }

    public static async sendOrdersToKitchens(jobIds: string[], sendASAP: boolean, token: string | null): Promise<{ status: string }> {
        const endpoint = `/life-cycle/send-orders-to-kitchens`;
        return this.postData(endpoint, { job_ids: jobIds, send_asap: sendASAP }, token, null);
    }

    public static async refundOrder(orderId: string, amountInCents: number = 0, token: string | null): Promise<{ status: string }> {
        const endpoint = `/life-cycle/refund-order`;
        return this.postData(endpoint, { order_id: orderId, amount_in_cents: amountInCents }, token, null);
    }

    public static async refundJob(jobId: string, amountInCents: number = 0, onlyCanceledSubOrders: boolean = false, token: string | null): Promise<{ status: string }> {
        const endpoint = `/life-cycle/refund-job`;
        return this.postData(endpoint, { job_id: jobId, amount_in_cents: amountInCents, only_canceled_sub_orders: onlyCanceledSubOrders}, token, null);
    }

    public static async startJobs(jobIds: string[], token: string | null): Promise<{ status: string }> {
        const endpoint = `/life-cycle/start-jobs`;
        return this.postData(endpoint, { job_ids: jobIds }, token, null);
    }

    public static async rebatchAreaLifecycle(areaId: string, basicBatching: boolean, date: string | null, useDate: boolean, token: string | null): Promise<{ status: string }> {
        const endpoint = `/lifecycle/rebatch`;
        try {
            return this.postData(endpoint, { area_id: areaId, basic_batching: basicBatching, date: date, use_date: useDate }, token, null);
        } catch (error) {
            console.error(`Failed to rebatch area lifecycle: ${error}`);
            throw error;
        }
    }

    public static async sendOrdersDeliveredEmails(jobId: string, token: string | null): Promise<{ status: string }> {
        const endpoint = `/life-cycle/send-orders-delivered-emails`;
        return this.postData(endpoint, { job_id: jobId }, token, null);
    }
}