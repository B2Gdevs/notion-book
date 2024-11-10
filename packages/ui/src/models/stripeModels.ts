export interface Customer {
  id?: string; // Typically, Stripe provides an ID for the customer.
  email: string;
  name?: string | null;
  phone?: string | null;
  description?: string | null;
  // Add any other properties you might need from Stripe's Customer object
  // such as 'address', 'default_source', 'metadata', etc.
}

export enum PaymentStatus {
  PAID = "paid",
  UNPAID = "unpaid",
  FAILED = "failed",
  TRANSFERRED = "transferred",
}


export interface BillingDetails {
  address: any;
  email: string;
  name: string;
  phone: string;
}
