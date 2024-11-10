'use client';
import { endOfDay, startOfDay } from 'date-fns';
import { X } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
	DeliveryWindow,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogPrimitive,
	DialogTitle,
	ENTITY_QUERY_MAX_LIMIT,
	Item,
	ItemDescriptionBox,
	ModifierGroup,
	OrderItem,
	OrderItemDialogContent,
	Photo,
	User,
	handleCreatingOrderItem,
	isPastOrderTime,
	toast,
	useCreateOrderItem,
	useCurrentColorfullUserOrdersForSelectedDate,
	useGetCurrentColorfullUser,
	useGetOrderItems,
	useGetOrg,
	useGetShare,
	useUpdateOrderItem,
	useUpdateUser
} from 'ui';
import { GlobalState, useGlobalStore } from '../../../../stores/globalStore';

interface OrderItemDialogComponentProps {
	isDialogOpen: boolean;
	onDialogClose: () => void;
	selectedItem: Item;
	selectedItemPhotos: Photo[];
	orgId: string;
	modifierGroups: Record<string, ModifierGroup>;
	photos: Record<string, Photo>;
	items: Record<string, Item>;
	storeId: string;
	onClose: () => void;
	existingOrderItem?: OrderItem;
	isGuestLimitedView?: boolean;
	deliveryWindow: DeliveryWindow;
}

const OrderItemDialogComponent: React.FC<OrderItemDialogComponentProps> = ({
	isDialogOpen,
	onDialogClose,
	selectedItem,
	selectedItemPhotos,
	orgId,
	modifierGroups,
	photos,
	items,
	storeId,
	onClose,
	existingOrderItem,
	isGuestLimitedView,
	deliveryWindow
}) => {
	const globalStore = useGlobalStore() as GlobalState;
	const { data: user } = useGetCurrentColorfullUser();
	const { activeMainOrders } = useCurrentColorfullUserOrdersForSelectedDate(globalStore?.selectedDate);

	const shareId = useParams().shareId as string;
	const { data: share } = useGetShare(shareId);

	const { data: org} = useGetOrg(orgId);
	const isOrgActive = org?.is_active;

	const hasUserOrderedToday = Boolean(activeMainOrders?.[0]);

	const createOrderItemMutation = useCreateOrderItem({
		onSuccess: () => {
			toast({
				title: 'Order item added to cart',
				duration: 5000,
			})
		},
		onError: () => {
			toast({
				title: 'Failed to add order item to cart',
				duration: 5000,
				variant: 'destructive',
			})
		},
	});
	const updateOrderItemMutation = useUpdateOrderItem({
		onSuccess: () => {
			toast({
				title: 'Order item updated',
				duration: 5000,
			})
		},
		onError: () => {
			toast({
				title: 'Failed to update order item',
				duration: 5000,
				variant: 'destructive',
			})
		},

	});
	const updateUserMutation = useUpdateUser();

	const handleOnCompletedOrderItemSelection = (orderItem: OrderItem) => {
		if (orderItem?.id) {
			handleOnUpdateOrderItem(orderItem);
			globalStore?.setIsOrderItemDialogOpen(false);
			return;
		}

		if (isGuestLimitedView && share) {
			const guestOrderId = localStorage.getItem('guestOrderId');
			if (!guestOrderId) {
				console.error('Guest order ID is missing.');
				return;
			}

			const guestUserInfo = localStorage.getItem('guestUserInfo');
			if (!guestUserInfo) {
				console.error('Guest user info is missing.');
				return;
			}

			const {
				first_name,
				last_name,
				email,
				phone,
				org_id,
				work_address,
			} = JSON.parse(guestUserInfo);

			// Construct a temporary User object
			const guestUser: User = {
				id: first_name + '_' + last_name + '_' + guestOrderId,
				first_name: first_name,
				last_name: last_name,
				email: email,
				phone: phone,
				org_id: org_id,
				work_address: work_address,
			};


			const date = new Date(share.date);
			// Use the temporary guestUser object to handle order creation
			handleCreatingOrderItem(
				guestUser,
				orderItem,
				date,
				onDialogClose,
				createOrderItemMutation,
				updateUserMutation,
				true,
				share
			);
		} else {
			handleCreatingOrderItem(
				user,
				orderItem,
				globalStore?.selectedDate,
				onDialogClose,
				createOrderItemMutation,
				updateUserMutation
			);
		}


	};

	const handleOnUpdateOrderItem = (orderItem: OrderItem) => {
		updateOrderItemMutation.mutate({
			orderItemId: orderItem?.id ?? '',
			orderItem: orderItem
		});
	}
    const dateToUse = globalStore.selectedDate;
    // Parse and format the order cut-off time
    const orderCutOffTime = `10:30am`;

    const orderCutOffTimeHHMM = orderCutOffTime.slice(0, -2); // This will remove the last two characters ('am' or 'pm')
    const { data: orderItems } = useGetOrderItems({
        page: 1,
        pageSize: ENTITY_QUERY_MAX_LIMIT,
        dateTimeField: 'delivery_date',
        startDate: startOfDay(dateToUse ?? new Date()).toISOString(),
        endDate: endOfDay(dateToUse ?? new Date()).toISOString(),
    });

    // *This assumes that the order cut-off time is in the format 'HH:MMam' or 'HH:MMpm'
    const storeOrderCount = orderItems?.reduce((acc, item) => {
        if (item.delivery_date && dateToUse) {
            if (new Date(item.delivery_date).toDateString() === new Date(dateToUse).toDateString() && item.store_id === storeId) {
                acc += item.quantity || 1;
            }
        }
        return acc;
    }, 0) || 0; // Ensure storeOrderCount is defined    

    const isOrderLimitReached = storeOrderCount >= (org?.order_limit || Infinity);
    // deliveryWindowDeliveryTime is in HHMM format
    const deliveryWindowOrderCutoffTime = deliveryWindow?.order_cutoff_time ?? '12:00';
    const isOrgDeliveryWindowAfterLunch = deliveryWindowOrderCutoffTime > "14:00";

    const isPastCutoffTime = isPastOrderTime(isOrgDeliveryWindowAfterLunch ? deliveryWindowOrderCutoffTime : orderCutOffTimeHHMM, deliveryWindow.timezone, dateToUse?.toISOString() ?? new Date().toISOString());

    const isOrderingDisabled = isOrderLimitReached || isPastCutoffTime || !org?.is_active;

	return (
		<Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
			{/* add overflow-y-auto below to scroll */}
			<DialogContent
				isSticky={true}
				className="bg-secondary-creamer-beige overflow-y-auto w-full h-full max-h-[95vh] lg:max-h-[80vh] rounded-2xl"
			>
				<DialogHeader className='sticky top-0 z-50 bg-secondary-creamer-beige lg:pt-6'>
					<div className='relative w-full flex justify-center items-center lg:pb-4'>
						<DialogTitle className='font-righteous py-4 lg:py-0'>
							<span className='px-8 lg:px-0 text-xl lg:text-2xl'>{selectedItem?.name ?? ''}</span>
						</DialogTitle>
						<DialogPrimitive.Close
							className='absolute right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
							onClick={onClose}
						>
							<X className='h-[25px] w-[25px]' />
							<span className='sr-only'>Close</span>
						</DialogPrimitive.Close>
					</div>
					<div className='border-b border-primary-spinach-green' />
				</DialogHeader>
				<ItemDescriptionBox
					description={selectedItem?.description ?? ''}
					photos={selectedItemPhotos}
					item={selectedItem}
				/>
				<div className='border-b border-primary-spinach-green' />
				{selectedItem && (
					<OrderItemDialogContent
						existingOrderItem={existingOrderItem}
						restaurantId={orgId}
						menuItem={selectedItem}
						modifierGroups={modifierGroups}
						photos={photos}
						items={items}
                        isOrgActive={isOrgActive}
						storeId={storeId}
						userId={user?.id ?? ''}
						onCompletedOrderItemSelection={handleOnCompletedOrderItemSelection}
						orderingDisabled={isOrderingDisabled} // Disable ordering if not today, only serve for current day
						hasUserOrderedToday={hasUserOrderedToday}
						disabledMessage='Missing required items'
						selectedDate={globalStore?.selectedDate}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default OrderItemDialogComponent;
