'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { GetOrderItemsQueryParams, OrderItemClient } from '../clients/orderItemClient';
import { MutationCallbacks } from '../lib/utils';
import { OrderItem } from '../models/orderModels';
import { USERS_CACHE_KEY, USER_CACHE_KEY } from './userHooks';

export const ORDER_ITEM_CACHE_KEY = 'orderItem';
export const ORDER_ITEMS_CACHE_KEY = 'orderItems';
export const ALL_ORDER_ITEMS_CACHE_KEY = 'allOrderItems';

export interface UpdateOrderItemCallback {
	orderItemId: string;
	orderItem: OrderItem;
}

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateOrderItem = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation<OrderItem, Error, OrderItem>(
		async (orderItem: OrderItem) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return OrderItemClient.createOrderItem(orderItem, token);
		},
		{
			onSuccess: (data) => {
				queryClient.invalidateQueries(ALL_ORDER_ITEMS_CACHE_KEY);
				queryClient.invalidateQueries(ORDER_ITEMS_CACHE_KEY);
				queryClient.invalidateQueries(USERS_CACHE_KEY);
				queryClient.invalidateQueries(USER_CACHE_KEY);
				if (onSuccess) onSuccess(data);
			},
			onError,
		},
	);
};

export const useGetOrderItem = (orderItemId: string) => {
	const token = useSessionToken();
	return useQuery(
		[ORDER_ITEM_CACHE_KEY, orderItemId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return OrderItemClient.getOrderItem(orderItemId, token);
		},
		{
			enabled: !!orderItemId && !!token,
		},
	);
};

export const useGetOrderItemsbyIds = (orderItemIds: string[]) => {
	const token = useSessionToken();
	const serializedOrderItemIds = JSON.stringify(orderItemIds.sort());
	const queryKey = [ORDER_ITEMS_CACHE_KEY, serializedOrderItemIds];
	const fetchOrderItems = async (): Promise<OrderItem[]> => {
		if (!token) {
			throw new Error("Session token not available");
		}
		return OrderItemClient.getOrderItems({ orderItemIds: JSON.parse(serializedOrderItemIds) }, token);
	};

	const { data, isLoading, error } = useQuery(queryKey, fetchOrderItems, {
		enabled: (orderItemIds?.length ?? 0) > 0 && !!token,
	});

	if ((orderItemIds?.length ?? 0) === 0) {
		return { data: [], isLoading: false, error: null };
	}

	return { data, isLoading, error };
};


export const useUpdateOrderItem = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async ({ orderItemId, orderItem }: UpdateOrderItemCallback) => {
			// if (!token) {
			// 	throw new Error("Session token not available");
			// }
			return OrderItemClient.updateOrderItem(orderItemId, orderItem, token);
		},
		{
			onSuccess: (data, variables) => {
				queryClient.invalidateQueries([
					ORDER_ITEM_CACHE_KEY,
					variables.orderItemId,
				]);
				queryClient.invalidateQueries(ALL_ORDER_ITEMS_CACHE_KEY);
				queryClient.invalidateQueries([ORDER_ITEMS_CACHE_KEY]);
				queryClient.invalidateQueries(ORDER_ITEMS_CACHE_KEY);
				if (onSuccess) onSuccess(data);
			},
			onError,
		},
	);
};

export const useDeleteOrderItem = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async (orderItemId: string) => {
			// if (!token) {
			// 	throw new Error("Session token not available");
			// }
			return OrderItemClient.deleteOrderItem(orderItemId, token);
		},
		{
			onSuccess: (data, itemId) => {
				queryClient.invalidateQueries([ORDER_ITEM_CACHE_KEY, itemId]);
				queryClient.invalidateQueries(ORDER_ITEMS_CACHE_KEY);
				queryClient.invalidateQueries(ALL_ORDER_ITEMS_CACHE_KEY);
				if (onSuccess) onSuccess(data);
			},
			onError,
		},
	);
};



export const useGetOrderItems = (queryParams?: GetOrderItemsQueryParams, enabled: boolean = true) => {
    const token = useSessionToken(); // Ensure token is retrieved using the useSessionToken hook
    return useQuery<OrderItem[], Error>(
        [ORDER_ITEMS_CACHE_KEY, queryParams],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            try {
                return await OrderItemClient.getOrderItems(queryParams, token); // Pass the token to the API call
            } catch (error) {
                if (error) {
                    return [];  // Return an empty array if no items are found
                }
                throw error;  // Re-throw other errors to be handled by onError
            }
        },
        {
            enabled: !!queryParams && !!token && enabled, // Ensure the query is only enabled if the token is available and enabled flag is true
            onError: (error) => {
                console.error("Failed to fetch order items:", error);
            }
        },
    );
};