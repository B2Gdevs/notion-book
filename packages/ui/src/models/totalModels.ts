import { PaymentStatus } from "./stripeModels";

export enum CurrencyFormat {
    CENTS = "cents",
    DOLLARS = "dollars"
}

export interface OrderTotal {
    id?: string;
    order_id?: string;
    org_id?: string;
    subtotal?: number;
    claimed_subtotal?: number;
    discount?: number;
    tax?: number;
    tip?: number;
    delivery_fee?: number;
    total?: number;
    coupon_code?: string;
    tax_total?: number;
    payment_intent_id?: string;
    user_payment_status?: PaymentStatus; // replace with actual PaymentStatus values
    org_payment_status?: PaymentStatus; // replace with actual PaymentStatus values
    currency_format?: CurrencyFormat;
    total_before_subsidy?: number;
    user_owed_amount?: number;
    is_sub_order_total?: boolean;
    store_id?: string;
    user_id?: string;
    created_at?: string; // assuming date is in ISO string format
    updated_at?: string; // assuming date is in ISO string format
    delivery_date?: string; // assuming date is in ISO string format
    share_id?: string;

    // DEPRECATED
    payment_status?: PaymentStatus; // replace with actual PaymentStatus values
}

export interface DeliveryJobTotal {
    id?: string;
    job_id?: string;
    org_id?: string;
    tax_total?: number;
    subtotal: number;
    discount?: number;
    tax?: number;
    tip_total?: number;
    delivery_fee?: number;
    total?: number;
    coupon_code?: string;
    num_orders: number;
    order_totals?: OrderTotal[];
    restaurant_transfer_amounts?: { [key: string]: number };
    user_spend_total?: number;
    subsidy_total?: number;
    currency_format: CurrencyFormat;
    payment_intent_id?: string;
    payment_status?: PaymentStatus; // replace with actual PaymentStatus values
    created_at?: string; // assuming date is in ISO string format
    updated_at?: string; // assuming date is in ISO string format
    delivery_date?: string; // assuming date is in ISO string format
    sum_under_50_overages?: number;
}