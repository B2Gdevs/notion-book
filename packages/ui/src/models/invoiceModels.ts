// src/models/invoiceModels.ts

export interface Invoice {
    id?: string;
    payment_intent_id?: string;
    payment_status?: string; // Consider using an enum for known statuses
    job_total_ids?: string[];
    amount?: number;
    org_id?: string;
  }

export interface CreateInvoiceRequest {
    job_total_ids: string[];
}