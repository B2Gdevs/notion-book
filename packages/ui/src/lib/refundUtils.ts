export function isRefundable(obj: any): boolean {
    return !!obj?.payment_intent_id;
}