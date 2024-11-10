// packages/ui/src/hooks/orderHooks.ts
'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { OrderClient, OrderParams } from '../clients/orderClient';
import { Order } from '../models/orderModels';
import { MutationCallbacks } from '../lib/utils';

export const ORDERS_CACHE_KEY = 'orders';
const ORDER_CACHE_KEY = 'order';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateOrder = ({
	onSuccess,
	onError,
	guestUserEmail = null, // Add guestUserEmail as an optional parameter with a default value of null
}: MutationCallbacks & { guestUserEmail?: string | null } = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();

	return useMutation(
		async (order: Order) => {
			// Pass guestUserEmail to the createOrder function
			return OrderClient.createOrder(order, token, guestUserEmail);
		},
		{
			onSuccess: (data) => {
				queryClient.invalidateQueries(ORDERS_CACHE_KEY);
				if (onSuccess) {
					onSuccess(data);
				}
			},
			onError,
		}
	);
};

export const useGetOrderById = (orderId: string) => {
	const token = useSessionToken();
	return useQuery(
		[ORDER_CACHE_KEY, orderId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return OrderClient.getOrderById(orderId, token);
		},
		{
			enabled: !!orderId && !!token,
		}
	);
};

export const useGetOrders = (params: OrderParams, enabled: boolean = true) => {
    const token = useSessionToken();
    const queryInfo = useQuery(
        [ORDERS_CACHE_KEY, params],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return OrderClient.getOrders(params, token);
        },
        {
            enabled: enabled && !!params 
			&& !!token,
        }
    );

    return queryInfo;
};

export const useGetOrdersByIds = (orderIds: string[]) => {
	const token = useSessionToken();
	return useQuery(
		[ORDERS_CACHE_KEY, { ids: orderIds }],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return OrderClient.getOrdersByIds(orderIds, token);
		},
		{
			enabled: (orderIds?.length ?? 0) > 0 && !!token,
		}
	);
};

export const useUpdateOrder = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();

	return useMutation(
		async ({ orderId, orderData }: { orderId: string; orderData: Order }) => {
			return OrderClient.updateOrder(orderId, orderData, token);
		},
		{
			onSuccess: (data, variables) => {
				queryClient.invalidateQueries([ORDER_CACHE_KEY, variables.orderId]);
				queryClient.invalidateQueries(ORDERS_CACHE_KEY);
				if (onSuccess) onSuccess(data);
			},
			onError,
		}
	);
};

export const useDeleteOrder = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();

	return useMutation(
		async (orderId: string) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return OrderClient.deleteOrder(orderId, token);
		},
		{
			onSuccess: (data, variables) => {
				queryClient.invalidateQueries([ORDER_CACHE_KEY, variables]);
				queryClient.invalidateQueries(ORDERS_CACHE_KEY);
				if (onSuccess) onSuccess(data);
			},
			onError,
		}
	);
};

export const useCancelOrder = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async (orderId: string) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return OrderClient.cancelOrder(orderId, token);
		},
		{
			onSuccess: (data, variables) => {
				queryClient.invalidateQueries([ORDER_CACHE_KEY, variables]);
				if (onSuccess) onSuccess(data);
			},
			onError,
		}
	);
};