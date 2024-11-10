'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { StripeClient } from '../../clients/integrationClients/stripeClient';
import { MutationCallbacks } from '../../lib/utils';
import { Order } from '../../models/orderModels';
import { BillingDetails } from '../../models/stripeModels';
import { toast } from '../../components/ui/use-toast';
import { USERS_CACHE_KEY } from '../userHooks';

const PAYMENT_METHODS_CACHE_KEY = 'paymentMethods';

const useSessionToken = () => {
    const { useSessionToken } = require('../sessionHooks');
    return useSessionToken();
};


export const useStartCheckoutSession = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async (orders: Order[]) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.startCheckoutSession(orders, token);
        },
        {
            onSuccess,
            onError,
        },
    );
};

export const useCreateStripeConnectAccountLink = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async (orgId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.createStripeConnectAccountLink(orgId, token);
        },
        {
            onSuccess,
            onError,
        },
    );
};

export const useConnectStripeAccount = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async (orgId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.connectStripeAccount(orgId, token);
        },
        {
            onSuccess,
            onError,
        },
    );
};

export const useCreateIntent = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async (customerId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.createIntent(customerId, token);
        },
        {
            onSuccess,
            onError,
        },
    );
};

export const useListPaymentMethods = (customerId: string) => {
    const token = useSessionToken();
    return useQuery(
        [PAYMENT_METHODS_CACHE_KEY, customerId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.listPaymentMethods(customerId, token);
        },
        {
            enabled: !!customerId && !!token,
        },
    );
};

export const useUpdatePaymentMethod = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async ({
            paymentMethodId,
            billingDetails,
            metadata,
        }: {
            paymentMethodId: string;
            billingDetails: BillingDetails;
            metadata: any;
        }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.updatePaymentMethod(
                paymentMethodId,
                billingDetails,
                metadata,
                token
            );
        },
        {
            onSuccess,
            onError,
        },
    );
};

export const useDeletePaymentMethod = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (paymentMethodId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.deletePaymentMethod(paymentMethodId, token);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(PAYMENT_METHODS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess();
                }
            },
            onError,
        },
    );
};

export const useChargeRecipient = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async (request: {
            paymentMethodId: string;
            stripeCustomerId: string;
            totalAmountInCents: number;
            transferGroup?: string;
            description?: string;
        }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.chargeRecipient(request, token);
        },
        {
            onSuccess,
            onError,
        },
    );
};

export const useDeleteCustomer = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async (customerId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.deleteCustomer(customerId, token);
        },
        {
            onSuccess,
            onError,
        },
    );
};

export const useSetDefaultPaymentMethod = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async ({ customerId, paymentMethodId }: { customerId: string; paymentMethodId: string }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.setDefaultPaymentMethod(customerId, paymentMethodId, token);
        },
        {
            onSuccess,
            onError,
        },
    );
};

export const useGetDefaultPaymentMethod = (customerId: string) => {
    const token = useSessionToken();
    return useQuery(
        ['defaultPaymentMethod', customerId],
        async ({ queryKey }) => {
            const [, custId] = queryKey;
            if (!token) {
                throw new Error("Session token not available");
            }
            return StripeClient.getDefaultPaymentMethod(custId, token);
        },
        {
            enabled: !!customerId && !!token,
        }
    );
};



interface ChargeCustomerParams {
    stripeAccountId: string;
    amountOwedInCents: number;
    paymentMethodId: string;
    description?: string;
}


export const useChargeCustomer = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();

    return useMutation(
        async (params: ChargeCustomerParams) => {
            const { stripeAccountId, amountOwedInCents, paymentMethodId, description = "Charge for owed amount" } = params;
            if (!token) {
                throw new Error("Session token not available");
            }
            if (!paymentMethodId) {
                throw new Error("No payment method available for charging.");
            }
            return StripeClient.chargeCustomer(
                stripeAccountId,
                amountOwedInCents,
                paymentMethodId,
                description,
                token
            );
        },
        {
            onSuccess: (data) => {
                toast({
                    title: 'Charge Successful',
                    description: 'The payment was successfully processed.',
                    duration: 3000,
                });
                if (onSuccess) {
                    onSuccess(data);
                }
                // Invalidate and refetch the users query to update the UI with the latest user data
                queryClient.invalidateQueries([USERS_CACHE_KEY]);
            },
            onError: (error) => {
                toast({
                    title: 'Charge Failed',
                    description: 'Failed to process the payment. Please try again.',
                    duration: 3000,
                });
                if (onError) {
                    onError(error);
                }
            },
        },
    );
};