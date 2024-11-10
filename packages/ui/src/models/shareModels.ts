export interface Share {
    date: Date;
    org_id: string;
    guests: number;
    budget: number | null;
    payment_method_id: string;
    custom_message: string;
    email_domains_whitelist?: string[]; 
    id?: string;
    order_ids?: string[];
    order_total_ids?: string[];
    delivery_window_id?: string;
}