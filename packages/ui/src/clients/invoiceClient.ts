import { CreateInvoiceRequest, Invoice } from '../models/invoiceModels';
import { BaseClient } from './baseClient';

/**
 * Query parameters for fetching invoices.
 */
export interface InvoiceQueryParams {
  page?: number;
  pageSize?: number;
  orgId?: string;
  ids?: string;
  sortBy?: string;
  sortDirection?: string;
}

/**
 * Client for interacting with the invoice API.
 */
export class InvoicesClient extends BaseClient {
  /**
   * Creates a new invoice.
   * @param invoice - The invoice data to create.
   * @param token - The JWT token for authentication.
   * @returns The created invoice.
   */
  public static async createInvoice(invoice: CreateInvoiceRequest, token: string | null): Promise<Invoice> {
    const endpoint = `/invoices`;
    return this.postData(endpoint, invoice, token, null);
  }

  /**
   * Fetches an invoice by its ID.
   * @param invoiceId - The ID of the invoice to fetch.
   * @param token - The JWT token for authentication.
   * @returns The invoice with the given ID.
   */
  public static async getInvoiceById(invoiceId: string, token: string | null): Promise<Invoice> {
    const endpoint = `/invoices/${invoiceId}`;
    return this.fetchData(endpoint, token, null);
  }

  /**
   * Updates an existing invoice.
   * @param invoiceId - The ID of the invoice to update.
   * @param invoiceData - The updated invoice data.
   * @param token - The JWT token for authentication.
   * @returns The updated invoice.
   */
  public static async updateInvoice(invoiceId: string, invoiceData: Invoice, token: string | null): Promise<Invoice> {
    const endpoint = `/invoices/${invoiceId}`;
    return this.putData(endpoint, invoiceData, token, null);
  }

  /**
   * Deletes an invoice.
   * @param invoiceId - The ID of the invoice to delete.
   * @param token - The JWT token for authentication.
   * @returns A message indicating that the invoice was deleted.
   */
  public static async deleteInvoice(invoiceId: string, token: string | null): Promise<{ message: string }> {
    const endpoint = `/invoices/${invoiceId}`;
    return this.deleteData(endpoint, token, null);
  }

  /**
   * Fetches a list of invoices.
   * @param params - The query parameters for the request.
   * @param token - The JWT token for authentication.
   * @returns A list of invoices.
   */
  public static async getInvoices(params: InvoiceQueryParams, token: string | null): Promise<Invoice[]> {
    const endpoint = `/invoices?${this.constructQueryString(params)}`;
    return this.fetchData(endpoint, token, null);
  }

  /**
   * Fetches a list of invoices based on a list of invoice IDs.
   * @param invoiceIds - A list of invoice IDs.
   * @param token - The JWT token for authentication.
   * @returns A list of invoices.
   */
  public static async getInvoicesByIds(invoiceIds: string[], token: string | null): Promise<Invoice[]> {
    if (!invoiceIds || invoiceIds.length === 0) return [];
    const endpoint = `/invoices?ids=${invoiceIds.join(',')}`;
    return this.fetchData(endpoint, token, null);
  }

  /**
   * Constructs a query string from the given parameters.
   * @param params - The parameters to construct the query string from.
   * @returns The constructed query string.
   */
  private static constructQueryString(params: InvoiceQueryParams): string {
    const queries: string[] = [];
    if (params.page) {
      queries.push(`page=${params.page}`);
    }
    if (params.pageSize) {
      queries.push(`page_size=${params.pageSize}`);
    }
    if (params.orgId) {
      queries.push(`org_id=${params.orgId}`);
    }
    if (params.ids) {
      queries.push(`ids=${params.ids}`);
    }
    if (params.sortBy) {
      queries.push(`sort_by=${params.sortBy}`);
    }
    if (params.sortDirection) {
      queries.push(`sort_direction=${params.sortDirection}`);
    }
    return queries.join('&');
  }
}