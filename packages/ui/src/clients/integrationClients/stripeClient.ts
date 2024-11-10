import { Order } from '../../models/orderModels';
import { BillingDetails } from '../../models/stripeModels';
import { BaseClient } from '../baseClient';

export interface StripeConnectAccountLinkResponse {
	url: string;
}

export interface PaymentMethodRequest {
	paymentMethodId: string;
	stripeCustomerId: string;
	totalAmountInCents: number;
	transferGroup?: string;
	description?: string;
}

export interface ConnectStripeAccountResponse {
    stripe_account_id: string;
}
export class StripeClient extends BaseClient {
    public static async startCheckoutSession(
        orders: Order[],
        token: string
    ): Promise<{ url: string }> {
        const response = await this.postData(`/create-checkout-session`, orders, token, null);
        if (response && response.url) {
            return { url: response.url };
        } else {
            console.error('Invalid response or missing URL in response:', response);
            throw new Error('Failed to start checkout session');
        }
    }

    public static async createStripeConnectAccountLink(
        orgId: string,
        token: string
    ): Promise<StripeConnectAccountLinkResponse> {
        try {
            return await this.postData(`/create_stripe_account_link`, { org_id: orgId }, token, null);
        } catch (error) {
            console.error('Error creating Stripe Connect account:', error);
            throw new Error('Failed to create Stripe Connect account');
        }
    }

    public static async createIntent(customerId: string, token: string) {
        try {
            return await this.postData(`/create-intent`, { customer_id: customerId }, token, null);
        } catch (error) {
            console.error('Error creating Stripe intent:', error);
            throw new Error('Failed to create Stripe intent');
        }
    }

    public static async connectStripeAccount(orgId: string, token: string): Promise<ConnectStripeAccountResponse> {
        try {
            const response = await this.postData(`/connect_stripe`, { org_id: orgId }, token, null) as ConnectStripeAccountResponse;
            return response;
        } catch (error) {
            console.error(`Error connecting Stripe account for orgId: ${orgId}:`, error);
            throw new Error('Failed to connect Stripe account');
        }
    }

    public static async listPaymentMethods(customerId: string, token: string) {
        try {
            return await this.fetchData(`/list-payment-methods?customer_id=${customerId}`, token, null);
        } catch (error) {
            console.error('Error listing Stripe payment methods:', error);
            throw new Error('Failed to list Stripe payment methods');
        }
    }

    public static async updatePaymentMethod(
        paymentMethodId: string,
        billingDetails: BillingDetails,
        metadata: any,
        token: string
    ) {
        try {
            return await this.postData(`/update-payment-method`, {
                payment_method_id: paymentMethodId,
                billing_details: billingDetails,
                metadata: metadata,
            }, token, null);
        } catch (error) {
            console.error('Error updating Stripe payment method:', error);
            throw new Error('Failed to update Stripe payment method');
        }
    }

    public static async getDefaultPaymentMethod(customerId: string, token: string) {
        try {
            return await this.fetchData(`/customers/${customerId}/default-payment-method`, token, null);
        } catch (error) {
            console.error('Error getting default payment method:', error);
            throw new Error('Failed to get default payment method');
        }
    }

    public static async deletePaymentMethod(paymentMethodId: string, token: string) {
        try {
            return await this.postData(`/delete-payment-method`, {
                payment_method_id: paymentMethodId,
            }, token, null);
        } catch (error) {
            console.error('Error detaching Stripe payment method:', error);
            throw new Error('Failed to detach Stripe payment method');
        }
    }
	public static async setDefaultPaymentMethod(
		customerId: string,
		paymentMethodId: string,
		token: string
	) {
		try {
			return await this.postData(`/customers/${customerId}/default-payment-method`, {
				payment_method_id: paymentMethodId,
			}, token, null);
		} catch (error) {
			console.error('Error setting default payment method:', error);
			throw new Error('Failed to set default payment method');
		}
	}
	
	public static async transferToRecipient(
		currency: string,
		amount: number,
		destination_account: string,
		description: string,
		transfer_group: string,
		token: string
	) {
		try {
			const body = {
				currency,
				amount,
				destination_account,
				description,
				transfer_group: transfer_group || undefined
			};
			return await this.postData(`/transfer-to-recipient`, body, token, null);
		} catch (error) {
			console.error('Error making transfer to recipient:', error);
			throw new Error('Failed to transfer to recipient');
		}
	}
	
	public static async chargeRecipient(
		request: PaymentMethodRequest,
		token: string
	): Promise<any> {
		try {
			return await this.postData(`/charge-recipient`, {
				payment_method_id: request.paymentMethodId,
				stripe_customer_id: request.stripeCustomerId,
				total_amount_in_cents: request.totalAmountInCents,
				transfer_group: request.transferGroup,
				description: request.description,
			}, token, null);
		} catch (error) {
			console.error('Error charging the recipient:', error);
			throw new Error('Failed to charge the recipient');
		}
	}
	
	public static async chargeCustomer(
		stripe_account_id: string,
		total_amount_in_cents: number,
		payment_method_id: string,
		description: string,
		token: string
	) {
		try {
			const body = {
				stripe_account_id,
				total_amount_in_cents,
				payment_method_id,
				description: description || undefined
			};
			return await this.postData(`/charge-customer`, body, token, null);
		} catch (error) {
			console.error('Error charging the customer:', error);
			throw new Error('Failed to charge the customer');
		}
	}
	
	public static async processDailyPayments(token: string) {
		try {
			return await this.postData(`/process-daily-payments`, {}, token, null);
		} catch (error) {
			console.error('Error processing daily payments:', error);
			throw new Error('Failed to process daily payments');
		}
	}
	
	public static async processDeliveryJobs(date: Date, orgId: string, token: string) {
		try {
			return await this.postData(`/process-delivery-jobs`, {
				date: date.toISOString(),
				org_id: orgId
			}, token, null);
		} catch (error) {
			console.error('Error processing delivery jobs:', error);
			throw new Error('Failed to process delivery jobs');
		}
	}
	
	public static async processRestaurantTransfersDateRange(start_date: Date, end_date: Date, orgId: string, token: string): Promise<any> {
		try {
			return await this.postData(`/process-restaurant-transfers-date-range`, {
				start_date: start_date.toISOString(),
				end_date: end_date.toISOString(),
				org_id: orgId
			}, token, null);
		} catch (error) {
			console.error('Error processing restaurant transfers:', error);
			throw new Error('Failed to process restaurant transfers');
		}
	}
	
	public static async deleteCustomer(customerId: string, token: string) {
		try {
			return await this.postData(`/delete-customer`, {
				customer_id: customerId
			}, token, null);
		} catch (error) {
			console.error('Error deleting Stripe customer:', error);
			throw new Error('Failed to delete Stripe customer');
		}
	}
}
