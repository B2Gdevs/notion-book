import { Share } from "../models/shareModels";
import { OrderItem, User } from "..";

export const handleCreatingOrderItem = async (
	user: User | undefined,
	orderItem: OrderItem,
	date: Date,
	onDialogClose: () => void,
	createOrderItemMutation: any, 
	updateUserMutation: any,
	isGuestUser?: boolean,
	share?: Share,
	deliveryWindowId?: string
) => {
	try {
		date.setHours(12, 30, 0, 0); // Set the time to 12:00:00.000
		orderItem.delivery_date = date.toISOString();
		// If isGuestUser is true, assign the share ID to the created order item
		if (isGuestUser && share && user) {
			orderItem.share_id = share.id;
			orderItem.share_guest_id = user.id;
			if (share?.delivery_window_id) {
				orderItem.delivery_window_id = share.delivery_window_id;
			}
		}

		if (deliveryWindowId) {
			orderItem.delivery_window_id = deliveryWindowId;
		}

		const createdOrderItem = await createOrderItemMutation.mutateAsync(orderItem);
		if (!user || !date || !createdOrderItem?.id) {
			console.error('User, date, or createdOrderItem ID is undefined.');
			return;
		}

		// Only run updateUserMutation if isGuestUser is not true
        if (!isGuestUser && user?.calendar_cart) {
            await updateUserMutation.mutateAsync({
                userId: user.id ?? '',
                user: {
                    ...user,
                    calendar_cart: [],
                },
            });
        }

		onDialogClose();
	} catch (error) {
		console.error('Failed to create order item:', error);
	}
};