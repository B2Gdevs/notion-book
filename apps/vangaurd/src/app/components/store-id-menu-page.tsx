'use client';

import { endOfDay, startOfDay } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    Area,
    CodeBlock,
    CubeLoader,
    DeliveryWindow,
    ENTITY_QUERY_MAX_LIMIT,
    Footer,
    Item,
    LeftArrowButton,
    Menu,
    MenuCategorySelector,
    MenuItemCard,
    PageWrapper,
    Photo,
    Separator,
    Share,
    StepHeader,
    StoreStates,
    getHolidayOfDate,
    isPastOrderTime,
    useGetBrandById,
    useGetCalendarEvents,
    useGetOrderItems,
    useGetOrg,
    useGetStore,
    useMenuDataFromStoreId
} from 'ui';
import { GlobalState, useGlobalStore } from '../../stores/globalStore';
import GuestInfoDialog from './guest-info-dialog';
import DialogComponent from './order-item-dialog';
import { stringToDayOfWeek } from './app-page';

interface StoreIdMenuPageProps {
    userArea: Area;
    selectedDate: Date;
    isGuestLimitedView?: boolean;
    guestShare?: Share;
    isGuestDialogOpen?: boolean;
    setIsGuestDialogOpen?: (isOpen: boolean) => void;
    isOrgActive?: boolean;
    deliveryWindow?: DeliveryWindow,
}

const StoreIdMenuPage: React.FC<StoreIdMenuPageProps> = ({
    userArea,
    selectedDate,
    isGuestLimitedView,
    guestShare,
    isGuestDialogOpen = false, // Default to false if undefined
    setIsGuestDialogOpen = () => { }, // Default to a no-op function if undefined
    isOrgActive,
    deliveryWindow,
}) => {
    const globalStore = useGlobalStore() as GlobalState;
    const dateToUse = guestShare ? new Date(guestShare.date) : selectedDate;
    // Parse and format the order cut-off time
    const orderCutOffTime = `10:30am`;

    const orderCutOffTimeHHMM = orderCutOffTime.slice(0, -2); // This will remove the last two characters ('am' or 'pm')
    // *This assumes that the order cut-off time is in the format 'HH:MMam' or 'HH:MMpm'

    // deliveryWindowDeliveryTime is in HHMM format
    const deliveryWindowOrderCutoffTime = deliveryWindow?.order_cutoff_time ?? '12:00';
    const isOrgDeliveryWindowAfterLunch = deliveryWindowOrderCutoffTime > "14:00";

    // Check if the current time is past the order cut-off time
    const isPastCutoffTime = isPastOrderTime(isOrgDeliveryWindowAfterLunch ? deliveryWindowOrderCutoffTime : orderCutOffTimeHHMM, userArea.timezone, dateToUse?.toISOString() ?? new Date().toISOString());

    const isAdminGuestAccount = globalStore.isAdminGuestAccount;
    const params = useParams();
    const router = useRouter();
    let storeId: string;
    if (isGuestLimitedView) {
        storeId = params.storeId as string;
    } else {
        storeId = params.id as string;
    }
    const { data: store, isLoading: isStoreLoading } = useGetStore(storeId);
    const { data: brand, isLoading: isBrandLoading } = useGetBrandById(store?.brand_id || '');
    const { data: org } = useGetOrg(store?.org_id || '');

    // Add a new piece of state for the selected category
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [selectedItemPhotos, setSelectedItemPhotos] = useState<Photo[] | null>(
        null,
    );
    const [isDialogOpen, setDialogOpen] = useState(false);

    const closeDialog = () => setDialogOpen(false);

    const goBack = () => {
        router.back();
    };

    let {
        menus,
        items,
        photos,
        modifierGroups,
        categories,
    } = useMenuDataFromStoreId(storeId ?? '');

    const closeGuestDialog = () => setIsGuestDialogOpen(false);

    const activeMenus = Object.values(menus).filter(menu => menu.is_active);
    const activeCategoryId = Object.keys(categories).find(key =>
        categories[key]?.is_active || activeMenus.find(menu => menu?.category_ids?.includes(key))
    );
    const activeMenuCategoryIds = [...new Set(activeMenus.flatMap(menu => menu.category_ids))];
    let activeCategories = Object.values(categories).filter(category => activeMenuCategoryIds?.includes(category.id) && category.is_active);

    // Filter out categories where all items are unavailable
    activeCategories = activeCategories.filter(category => {
        // Check if all items in the category are unavailable
        const allItemsUnavailable = category.item_ids.every(itemId => {
            const item = items[itemId];
            return !item || item.sale_status !== 'FOR_SALE' || !item.is_active;
        });

        // Return true if not all items are unavailable
        return !allItemsUnavailable;
    });

    const isStoreUnavailable = !store || store.store_state !== StoreStates.OPEN && store.store_state !== StoreStates.OPEN_FOR_DELIVERY_ONLY;
    const isBrandUnavailable = !brand;

    const { data: orderItems } = useGetOrderItems({
        page: 1,
        pageSize: ENTITY_QUERY_MAX_LIMIT,
        dateTimeField: 'delivery_date',
        startDate: startOfDay(dateToUse ?? new Date()).toISOString(),
        endDate: endOfDay(dateToUse ?? new Date()).toISOString(),
    });

    const storeOrderCount = orderItems?.reduce((acc, item) => {
        if (item.delivery_date && dateToUse) {
            if (new Date(item.delivery_date).toDateString() === new Date(dateToUse).toDateString() && item.store_id === storeId) {
                acc += item.quantity || 1;
            }
        }
        return acc;
    }, 0) || 0; // Ensure storeOrderCount is defined    

    const isOrderLimitReached = storeOrderCount >= (org?.order_limit || Infinity);

    // Function to check if the kitchen prep time falls within any of the menu's available time ranges
    const doesKitchenPrepTimeFallWithinMenuHours = (storeMenus: Menu[], kitchenPrepTime: string, selectedDate: Date) => {
        const dayOfWeek = selectedDate ? selectedDate.toLocaleString('en-us', { weekday: 'long' }).toUpperCase() : undefined;
        const dayOfWeekEnum = dayOfWeek ? stringToDayOfWeek[dayOfWeek] : undefined;
    
        return storeMenus.some(menu => {
            if (!menu.hours?.regular_hours?.length) {
                return false;
            }
    
            if (!dayOfWeekEnum) {
                return false;
            }
    
            return menu.hours.regular_hours.some(hour => {
                if (!hour.days.includes(dayOfWeekEnum)) {
                    return false;
                }
    
                return hour.time_ranges.some(range => {
                    if (!range.start || !range.end) {
                        return false;
                    }
                    const startTime = range.start.replace(':', '');
                    const endTime = range.end.replace(':', '');
                    const prepTime = kitchenPrepTime.replace(':', '');
    
                    // Handle time range crossing midnight or 24-hour open period
                    if (endTime === startTime) {
                        return true; // Open 24 hours
                    } else if (endTime < startTime) {
                        return (prepTime >= startTime && prepTime <= "2400") || (prepTime >= "0000" && prepTime <= endTime);
                    } else {
                        return prepTime >= startTime && prepTime <= endTime;
                    }
                });
            });
        });
    };

    const kitchenPrepTime = deliveryWindow?.kitchen_prep_time ?? '17:30';
    const menuArray = Object.values(menus); // Convert Record<string, Menu> to Menu[] 
    const isPrepTimeWithinMenuHours = doesKitchenPrepTimeFallWithinMenuHours(menuArray, kitchenPrepTime, selectedDate);

    const isStoreOrBrandUnavailable = isStoreUnavailable || isBrandUnavailable;
    const isStoreOrBrandUnavailableOrPrepTimeOutsideMenuHours = isStoreOrBrandUnavailable || !isPrepTimeWithinMenuHours;

    const { data: events } = useGetCalendarEvents();
    const holidayCalendarEvent = getHolidayOfDate(selectedDate?.toISOString().slice(0, 10) ?? '', events ?? [])
    if (isStoreLoading || isBrandLoading) return <div className='flex items-center justify-center space-x-4 px-16 py-8'>
        <div>Loading...</div>
        <CubeLoader />
    </div>;

    return (
        <PageWrapper className='relative lg:pt-14 lg:px-2'>
            {holidayCalendarEvent && (
                <div className='text-center p-4 mt-4 bg-red-100 border-l-4 border-red-500 text-red-700'>
                    We are closed in observance of the holiday <CodeBlock>{holidayCalendarEvent.summary}</CodeBlock>
                </div>
            )}
            <div className='flex-col space-y-2 mb-2 '>
                <LeftArrowButton
                    className='hidden lg:block mb-5 w-full pl-2 m-0 absolute top-[18px]'
                    onClick={goBack}
                    text='Restaurants'
                />
                <StepHeader
                    text={'Pick a menu item(s)'}
                    step={'2'}
                    className='pl-4 m-0'
                    logoUrl={store?.brand_image_url || undefined}
                    logoAlternative={brand?.name || undefined}
                />
                {isOrderLimitReached && (
                    <div className='flex items-center justify-center gap-2 p-2 rounded-lg bg-secondary-peach-orange'>
                        <div className='font-righteous text-red-500'>Order Limit Reached:</div>
                        <div className='italic'>This store has reached its order limit for the day. Please check back in tomorrow!</div>
                    </div>)
                }
                {(isStoreOrBrandUnavailableOrPrepTimeOutsideMenuHours || isPastCutoffTime) && (
                    <div className='flex items-center justify-center gap-2 p-2 rounded-lg bg-secondary-peach-orange'>
                        <div className='font-righteous text-red-500'>Store Unavailable:</div>
                        <div className='italic'>This store is currently unavailable. Please note that these menu items cannot be added to your cart.</div>
                    </div>
                )}
            </div>
            <div className='flex flex-col gap-x-4 justify-center'>
                <div className='pl-4 z-40 sticky top-[70px]'>
                    <MenuCategorySelector
                        categories={activeCategories.filter(category => {
                            if (!category.id || !category.is_active) return false;

                            // Check if all items in the category are unavailable
                            const allItemsUnavailable = category.item_ids.every(itemId => {
                                const item = items[itemId];
                                return !item || item.sale_status !== 'FOR_SALE' || !item.is_active;
                            });

                            // Only include the category if not all items are unavailable
                            return !allItemsUnavailable;
                        })}
                        onCategorySelect={(categoryId) => {
                            const element = document.getElementById(categoryId);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                                setSelectedCategory(categoryId);
                            }
                        }}
                        selectedCategory={selectedCategory || (activeCategoryId ? categories[activeCategoryId]?.id : '')}
                        className='pt-2'
                    />
                    <div className='border-b border-[#425F57]' />
                </div>

                {Object.values(menus)
                    .filter(menu => menu.is_active) // Only include menus that are active
                    .map((menu) =>
                        menu.category_ids
                            ?.filter((catId) => {
                                const category = categories[catId];
                                if (!category || !category.is_active) return false;

                                // Check if all items in the category are unavailable
                                const allItemsUnavailable = category.item_ids.every(itemId => {
                                    const item = items[itemId];
                                    return !item || item.sale_status !== 'FOR_SALE' || !item.is_active;
                                });

                                // Only include the category if not all items are unavailable
                                return !allItemsUnavailable;
                            })
                            .map((categoryId, catIdx) => {
                                const category = categories[categoryId];

                                return (
                                    <div key={category?.id} className='relative w-full mt-5'>
                                        <span className='invisible absolute -top-[110px]' id={category?.id}></span>
                                        <h2 className="text-primary-spinach-green font-righteous text-[22px] pl-4 lg:text-2xl">
                                            {category?.name}
                                        </h2>
                                        <div className='pl-4'>
                                            <Separator className='mb-5 bg-primary-almost-black' />
                                        </div>
                                        <div
                                            className={`grid gap-4 justify-items-center md:justify-items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 px-[17px] ${catIdx === 0 ? 'xl:grid-cols-4' : 'grid-auto-rows minmax(auto, auto) grid-auto-flow-row'}`}
                                        >
                                            {category?.item_ids
                                                .sort((a, b) => {
                                                    const itemA = items[a];
                                                    const itemB = items[b];

                                                    return itemA?.name.localeCompare(itemB?.name);
                                                })
                                                ?.map((itemId) => {
                                                    const item = items[itemId];
                                                    if (!item) return null;

                                                    const itemPhotos = item?.photo_ids?.map(
                                                        (photoId) => photos[photoId],
                                                    );

                                                    if (item.sale_status === 'FOR_SALE' && item.is_active) {
                                                        // const isMenuAvailable = isMenuAvailableAtThisTime(selectedDate, menu, area || {})
                                                        let photo = itemPhotos?.[0]
                                                        return (
                                                            <MenuItemCard
                                                                selected={false}
                                                                className='transition-shadow duration-300 ease-in-out hover:shadow-2xl'
                                                                key={item.id}
                                                                imageSrc={(photo && photo.is_active && photo.url) ? photo.url : 'https://res.cloudinary.com/dzmqies6h/image/upload/v1710964654/Burger_Menu_Item_Card_Holder_vgzofu.png'}
                                                                layout={catIdx === 0 ? 'vertical' : 'horizontal'}
                                                                variant={catIdx === 0 ? 'creamer' : 'lime'}
                                                                price={item?.price?.amount}
                                                                name={item?.name ?? ''}
                                                                description={item?.description ?? ''}
                                                                onClick={() => {
                                                                    setSelectedItem(item);
                                                                    setSelectedItemPhotos(itemPhotos);
                                                                    setDialogOpen(true);
                                                                }}
                                                                isAvailable={true}
                                                                item={item}
                                                            />
                                                        );
                                                    }
                                                })}
                                        </div>
                                    </div>
                                );
                            }),
                    )}
            </div>

            <GuestInfoDialog
                isDialogOpen={isGuestDialogOpen}
                closeDialog={closeGuestDialog}
                guestOrgId={guestShare?.org_id ?? ''}
                share={guestShare ?? {} as Share}
            />
            <Footer />
            <DialogComponent
                isDialogOpen={isDialogOpen}
                storeId={storeId ?? ''}
                onDialogClose={closeDialog}
                selectedItem={selectedItem ?? ({} as Item)}
                selectedItemPhotos={selectedItemPhotos ?? []}
                orgId={storeId}
                modifierGroups={modifierGroups}
                photos={photos}
                items={items}
                onClose={closeDialog}
                isGuestLimitedView={isGuestLimitedView}
                isOrderLimitReached={isOrderLimitReached}
                isPastCutoffTime={isPastCutoffTime}
                isStoreOrBrandUnavailable={isStoreOrBrandUnavailableOrPrepTimeOutsideMenuHours}
                isOrgActive={isOrgActive}
                isAdminGuestAccount={isAdminGuestAccount}
                deliveryWindowId={deliveryWindow?.id}
            />
        </PageWrapper>
    )
}

export default StoreIdMenuPage;