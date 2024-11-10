'use client';
import { X } from 'lucide-react';
import {
    ItemDescriptionBox,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogPrimitive,
    DialogTitle,
    Item,
    ModifierGroup,
    OrderItem,
    OrderItemDialogContent,
    Photo,
    User,
    handleCreatingOrderItem,
    toast,
    useCreateOrderItem,
    useCurrentColorfullUserOrdersForSelectedDate,
    useCurrentGuestUserOrdersForSelectedDate,
    useGetCurrentColorfullUser,
    useGetShare,
    useUpdateUser,
    useGetDeliveryWindowById
} from 'ui';
import { GlobalState, useGlobalStore } from '../../stores/globalStore';
import { useParams } from 'next/navigation';
import { utcToZonedTime } from 'date-fns-tz';

interface DialogComponentProps {
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
    isGuestLimitedView?: boolean;
    isOrderLimitReached?: boolean;
    isPastCutoffTime?: boolean;
    isStoreOrBrandUnavailable?: boolean;
    isOrgActive?: boolean;
    isAdminGuestAccount?: boolean;
    deliveryWindowId?: string;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
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
    isGuestLimitedView,
    isOrderLimitReached,
    isPastCutoffTime,
    isStoreOrBrandUnavailable,
    isOrgActive,
    isAdminGuestAccount,
    deliveryWindowId,
}) => {
    const selectedDate = useGlobalStore(
        (state: GlobalState) => state.selectedDate,
    );
    const { data: user } = useGetCurrentColorfullUser();
    const { activeMainOrders } = useCurrentColorfullUserOrdersForSelectedDate(selectedDate);

    // --- Admin Guest Handling ---

    // const { userCartOrderItems: adminGuestItems } = useGetAdminGuestUserOrderItemsById(adminGuestId ?? '');


    // Construct a temporary User object
    const adminGuestUser: User = {
        id: user?.id + '_guest',
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email ?? '',
        phone: user?.phone,
        org_id: user?.org_id,
        work_address: user?.work_address,
    };

    const { activeMainOrders: adminGuestActiveMainOrders } = useCurrentColorfullUserOrdersForSelectedDate(selectedDate, isAdminGuestAccount);
    const hasAdminGuestUserOrderedToday = Boolean(adminGuestActiveMainOrders?.[0]);

    // ---  End Admin Guest Handling ---

    const shareId = useParams().shareId as string;
    const { data: share } = useGetShare(shareId);
    const hasUserOrderedToday = Boolean(activeMainOrders?.[0]);
    
    const { data: deliveryWindow } = useGetDeliveryWindowById(share?.delivery_window_id ?? '');
    const timeZone = deliveryWindow?.timezone ?? 'UTC';
    const shareDateToPass = utcToZonedTime(share?.date ?? new Date(), timeZone);

    const isBrowser = typeof window !== 'undefined';

    const guestOrderId = isBrowser ? localStorage.getItem('guestOrderId') : null;
    const guestUserInfo = isBrowser ? localStorage.getItem('guestUserInfo') : null;

    const {
        first_name,
        last_name,
        email,
        phone,
        org_id,
        work_address,
    } = JSON.parse(guestUserInfo || '{}');

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

    const { guestActiveMainOrders } = useCurrentGuestUserOrdersForSelectedDate(shareDateToPass, guestUser ?? {} as User);
    const hasGuestUserOrderedToday = Boolean(guestActiveMainOrders?.[0]);

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
    const updateUserMutation = useUpdateUser();

    const handleOnCompletedOrderItemSelection = (orderItem: OrderItem) => {
        if (isGuestLimitedView && share) {
            // Use the temporary guestUser object to handle order creation
            handleCreatingOrderItem(
                guestUser,
                orderItem,
                shareDateToPass,
                onDialogClose,
                createOrderItemMutation,
                updateUserMutation,
                true,
                share
            );
        }
        else if (isAdminGuestAccount && deliveryWindowId) {
            handleCreatingOrderItem(
                adminGuestUser,
                orderItem,
                selectedDate,
                onDialogClose,
                createOrderItemMutation,
                updateUserMutation,
                true,
                undefined,
                deliveryWindowId,
            );
        }
        else if (isAdminGuestAccount) {
            // Use the temporary adminGuestUser object to handle order creation
            handleCreatingOrderItem(
                adminGuestUser,
                orderItem,
                selectedDate,
                onDialogClose,
                createOrderItemMutation,
                updateUserMutation,
                true
            );
        } else if (deliveryWindowId) {
            handleCreatingOrderItem(
                user,
                orderItem,
                selectedDate,
                onDialogClose,
                createOrderItemMutation,
                updateUserMutation,
                false,
                undefined,
                deliveryWindowId,
            )
        } else {
            // Existing logic for registered users
            handleCreatingOrderItem(
                user,
                orderItem,
                selectedDate,
                onDialogClose,
                createOrderItemMutation,
                updateUserMutation
            );
        }
    };

    const isOrderingDisabled = isOrderLimitReached || isPastCutoffTime || !isOrgActive || isStoreOrBrandUnavailable;

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
                            <span className='px-8 lg:px-0 w-4/5 lg:w-3/4 text-center text-xl lg:text-2xl'>
                                {selectedItem?.name ?? ''}
                            </span>
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
                        restaurantId={orgId}
                        menuItem={selectedItem}
                        modifierGroups={modifierGroups}
                        photos={photos}
                        items={items}
                        storeId={storeId}
                        userId={user?.id ?? ''}
                        onCompletedOrderItemSelection={handleOnCompletedOrderItemSelection}
                        orderingDisabled={isOrderingDisabled} // Disable ordering if not today, only serve for current day
                        hasUserOrderedToday={isGuestLimitedView ? hasGuestUserOrderedToday : (isAdminGuestAccount ? hasAdminGuestUserOrderedToday : hasUserOrderedToday)}
                        isOrderLimitReached={isOrderLimitReached}
                        isStoreOrBrandUnavailable={isStoreOrBrandUnavailable}
                        isPastCutoffTime={isPastCutoffTime}
                        isOrgActive={isOrgActive}
                        isAdminGuestAccount={isAdminGuestAccount}
                        selectedDate={selectedDate}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default DialogComponent;