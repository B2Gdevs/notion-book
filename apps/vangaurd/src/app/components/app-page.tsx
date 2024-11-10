'use client';

import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import {
    Area,
    Brand,
    CodeBlock,
    DEFAULT_ITEM_CLASSIFICATION_TAG,
    DayOfWeek,
    DeliveryWindow,
    ENTITY_QUERY_MAX_LIMIT,
    Footer,
    ItemClassification,
    ItemClassificationSelectionBar,
    Menu,
    Order,
    PageWrapper,
    RestaurantCard,
    Share,
    StepHeader,
    Store,
    User,
    getHolidayOfDate,
    isPastOrderTime,
    isStoreOpen,
    isTodayInArea,
    useGetCalendarEvents,
    useGetItemClassifications,
    useGetMenus,
    useGetOrderItems,
    useGetOrgsByIds
} from 'ui';
import FloatingButtonGroup from './floating-admin-navigation';
import GuestInfoDialog from './guest-info-dialog';
import { Header } from './header';
import { OrderPlaced } from './order-placed';
import { RestuarantScheduleDisplay } from './restuarant-shedule-display';

import { addDays, endOfDay, isWithinInterval, parse, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Flipped, Flipper } from 'react-flip-toolkit';

// Function to convert 24-hour time to 12-hour format with AM/PM
export const to12HourFormat = (time24: string) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const suffix = hours >= 12 ? 'pm' : 'am';
    const hours12 = hours % 12 || 12;  // Converts "00" to "12"
    return `${hours12}:${minutes < 10 ? '0' + minutes : minutes}${suffix}`;
};

// Mapping from string to DayOfWeek enum
export const stringToDayOfWeek: Record<string, DayOfWeek> = {
    'SUNDAY': DayOfWeek.SUNDAY,
    'MONDAY': DayOfWeek.MONDAY,
    'TUESDAY': DayOfWeek.TUESDAY,
    'WEDNESDAY': DayOfWeek.WEDNESDAY,
    'THURSDAY': DayOfWeek.THURSDAY,
    'FRIDAY': DayOfWeek.FRIDAY,
    'SATURDAY': DayOfWeek.SATURDAY
};

interface AppPageProps {
    sortedStores: Store[];
    brands: Brand[];
    userArea: Area,
    onViewMenuClick: (storeId: string) => void;
    deliveryWindow: DeliveryWindow;
    isGuestLimitedView?: boolean;
    guestShare?: Share;
    isGuestDialogOpen?: boolean;
    setIsGuestDialogOpen?: (isOpen: boolean) => void;
    selectedDate?: Date;
    activeDates?: Set<string>; // Dates with active orders
    selectedOrder?: Order;
    guestUser?: User;
}

const AppPage: React.FC<AppPageProps> = ({
    sortedStores,
    brands,
    userArea,
    onViewMenuClick,
    isGuestLimitedView,
    guestShare,
    isGuestDialogOpen = false, // Default to false if undefined
    setIsGuestDialogOpen = () => { }, // Default to a no-op function if undefined
    activeDates,
    selectedOrder,
    guestUser,
    deliveryWindow,
    selectedDate
}) => {
    // Parse and format the order cut-off time
    // const orderCutOffTime = `10:30am`;
    // const orderCutOffTimeHHMM = orderCutOffTime.slice(0, -2); // This will remove the last two characters ('am' or 'pm')
    // *This assumes that the order cut-off time is in the format 'HH:MMam' or 'HH:MMpm'
    // const decryptedString = decryptMessage("gAAAAABmvskxyp4MDe37Pkcb5CoRYyA330EpgzCXRDk_BJvEpUwleb7wUOkZS5unN4ktPnrHjFAkSYgwkqUcC8kwWiKxF2is0A==", passphrase);
    // deliveryWindowDeliveryTime is in HHMM format
    const deliveryWindowCutoffTime = deliveryWindow?.order_cutoff_time ?? '12:00';
    // convert the delivery window delivery time to AM/PM format
    // const deliveryWindowOrderCutoffTimeHHMM = to12HourFormat(deliveryWindow?.order_cutoff_time ?? '17:00');
    // const isOrgDeliveryWindowAfterLunch = deliveryWindowCutoffTime > "14:00";

    // Check if the current time is past the order cut-off time
    const selectedDateOrCurrentDate = selectedDate ?? new Date();
    const guestShareOrSelectedOrCurrentDate = guestShare ? new Date(guestShare.date) : selectedDateOrCurrentDate;

    const timezoneAwareDate = utcToZonedTime(guestShareOrSelectedOrCurrentDate, deliveryWindow?.timezone ?? '');
    const { data: events } = useGetCalendarEvents();
    const holidayCalendarEvent = getHolidayOfDate(selectedDate?.toISOString().slice(0, 10) ?? '', events ?? [])

    const isPastCutoffTime = isPastOrderTime(
        deliveryWindowCutoffTime,
        deliveryWindow?.timezone,
        timezoneAwareDate.toISOString()
    );

    const dropOffTime = `12:00pm - 12:30pm`;
    const closeGuestDialog = () => setIsGuestDialogOpen(false);
    let storesListedAlready: string[] = [];
    const brandClassificationIds = _.uniq(brands?.flatMap(brand => brand.item_classification_ids) ?? []);
    const { data: menus } = useGetMenus({
        page: 1,
        pageSize: 10000,
        storeIds: sortedStores?.map(store => store.id).filter(id => id !== undefined) as string[],
    });

    // Correcting storeMenuRecord to map store ID to an array of menus
    const storeMenuRecord: Record<string, Menu[]> = menus?.reduce<Record<string, Menu[]>>((acc, menu) => {
        if (menu.store_id) {
            if (!acc[menu.store_id]) {
                acc[menu.store_id] = [];
            }
            acc[menu.store_id].push(menu);
        }
        return acc;
    }, {}) ?? {};

    const orgIds = sortedStores.map(store => store.org_id);
    const { data: orgs } = useGetOrgsByIds(orgIds);

    const { data: orderItems } = useGetOrderItems({
        page: 1,
        pageSize: ENTITY_QUERY_MAX_LIMIT,
        dateTimeField: 'delivery_date',
        startDate: startOfDay(guestShareOrSelectedOrCurrentDate ?? new Date()).toISOString(),
        endDate: endOfDay(guestShareOrSelectedOrCurrentDate ?? new Date()).toISOString(),
    });

    const orderCountsByStore = orderItems?.reduce((acc, item) => {
        if (item.delivery_date && guestShareOrSelectedOrCurrentDate) {
            if (new Date(item.delivery_date).toDateString() === new Date(guestShareOrSelectedOrCurrentDate).toDateString()) {
                acc[item.store_id] = (acc[item.store_id] || 0) + (item.quantity || 1);
            }
        }
        return acc;
    }, {} as Record<string, number>);

    const orderCountsByOrg = sortedStores.reduce((acc, store) => {
        const orgId = store.org_id;
        if (store.id) {
            const storeOrderCount = orderCountsByStore?.[store.id] || 0;
            acc[orgId] = (acc[orgId] || 0) + storeOrderCount;
        }
        return acc;
    }, {} as Record<string, number>);

    const { data: itemClassifications } = useGetItemClassifications({
        page: 1,
        pageSize: 100,
        ids: brandClassificationIds.join(',')
    },
        brandClassificationIds.length > 0)

    const defaultActiveClassification = itemClassifications?.find(itemClassification =>
        itemClassification.tag === DEFAULT_ITEM_CLASSIFICATION_TAG
    );

    const [selectedClassification, setSelectedClassification] = useState<ItemClassification | undefined>(defaultActiveClassification)
    const [brandsToShow, setBrandsToShow] = useState<Brand[]>(brands ?? [])

    const handleItemClassificationSelection = (classification: ItemClassification) => {
        setSelectedClassification(classification);
    }

    useEffect(() => {
        if (!selectedClassification) {
            setBrandsToShow(brands);
            return;
        }
        const classificationId = selectedClassification.id;
        if (selectedClassification.tag === DEFAULT_ITEM_CLASSIFICATION_TAG) {
            setBrandsToShow(brands);
        } else {
            const filteredBrands = brands.filter(brand => brand.item_classification_ids.includes(classificationId ?? ''));
            setBrandsToShow(filteredBrands);
        }
    }, [selectedClassification, brands]);

    const combinedStoreBrandData = sortedStores
        .filter(store => Boolean(store))
        .map(store => {
            const brand = brandsToShow.find(b => b.id === store.brand_id);
            return { store, brand };
        })
        .filter(({ brand }) => brand !== undefined);



    // create a record of item classfications using id as key
    const itemClassificationsRecord: Record<string, ItemClassification> = {};
    itemClassifications?.forEach((classification) => {
        if (classification?.id) itemClassificationsRecord[classification.id] = classification;
    });


    // Function to check if a given time is within a specified range
    const isTimeWithinRange = (currentTime: string, startTime: string, endTime: string) => {
        // If the start time and end time are the same, the store is open 24/7
        if (startTime === endTime) {
            return true;
        }

        // Ensure all times are in 24-hour format
        const current = parse(currentTime, 'HH:mm', new Date());
        let start = parse(startTime, 'HH:mm', new Date());
        let end = parse(endTime, 'HH:mm', new Date());

        // If the end time is earlier than the start time, assume it extends to the next day
        if (end < start) {
            end = addDays(end, 1);
        }

        const result = isWithinInterval(current, { start, end });

        return result;
    };


    const deliveryWindowKitchenPrepTime = deliveryWindow?.kitchen_prep_time ?? '17:30';
    // const isDeliveryWindowDuringLunch = deliveryWindow?.delivery_time && deliveryWindow?.delivery_time < "14:00" && deliveryWindow?.delivery_time > "11:00";

    // Ensure selectedDate is defined before using it
    const dayOfWeek = selectedDate ? selectedDate.toLocaleString('en-us', { weekday: 'long' }).toUpperCase() : undefined;
    const dayOfWeekEnum = dayOfWeek ? stringToDayOfWeek[dayOfWeek] : undefined;


    // Filter to include only those entries that have a corresponding menu with defined regular_hours
    const brandsWithinDeliveryWindow = combinedStoreBrandData.filter(({ store }) => {
        const storeMenus = menus?.filter(menu => menu.store_id === store.id);

        if (!storeMenus?.length) {
            return false;
        }


        return storeMenus?.some(menu => {
            if (menu.hours?.regular_hours?.length == 0) {
                return true;
            }

            return menu.hours?.regular_hours?.some(hour => {

                if (dayOfWeekEnum && hour.days.includes(dayOfWeekEnum)) {
                    return hour.time_ranges.some(range => {
                        // Ensure deliveryWindowKitchenPrepTime and range.start/end are defined before using them
                        if (deliveryWindowKitchenPrepTime && range.start && range.end) {
                            const isWithinRange = isTimeWithinRange(deliveryWindowKitchenPrepTime, range.start, range.end);

                            return isWithinRange;
                        }


                        return false;
                    });
                }
                return false;
            });
        });
    });


    // // Function to check if a store is valid
    const isValidStore = (store: Store) => {
        return brandsWithinDeliveryWindow.some(validStoreBrand => validStoreBrand.store.id === store.id);
    };
    const isToday: boolean = isTodayInArea(guestShareOrSelectedOrCurrentDate?.toISOString() ?? '', deliveryWindow?.timezone);
    return (
        <>
            <FloatingButtonGroup />
            <div className='z-50 sticky top-0 bg-primary-off-white'>
                <Header
                    isGuestLimitedView={isGuestLimitedView}
                    share={guestShare}
                    guestUser={guestUser}
                />
                <div className='border-b border-primary-almost-black opacity-50' />
            </div>
            <RestuarantScheduleDisplay
                isGuestLimitedView={isGuestLimitedView}
                guestLimitedDate={timezoneAwareDate}
                activeDates={activeDates}
            />
            <div className='border-b border-[#425F57]' />
            <PageWrapper className='pt-[16px] px-[16px]'>
                <div className='flex justify-center lg:justify-start items-start'>
                    <OrderPlaced
                        order={selectedOrder}
                        deliveryWindowOrderCutoffTime={deliveryWindow?.order_cutoff_time}
                    />
                </div>
                <StepHeader text={'Choose Restaurant'} step={'1'} />

                <ItemClassificationSelectionBar
                    itemClassifications={itemClassifications ?? []}
                    onClassificationSelect={handleItemClassificationSelection}
                    selectedClassification={selectedClassification}
                />
                {holidayCalendarEvent && (
                    <div className='text-center p-4 mt-4 bg-red-100 border-l-4 border-red-500 text-red-700'>
                        We are closed in observance of the holiday <CodeBlock>{holidayCalendarEvent.summary}</CodeBlock>
                    </div>
                )}
                <Flipper flipKey={combinedStoreBrandData.map(({ store }) => store.id).join('')}>
                    <div className='grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 justify-start items-start gap-[20px] lg:gap-8 py-5'>
                        <AnimatePresence>
                            {combinedStoreBrandData.map(({ store, brand }) => {

                                const org = orgs?.find(o => o.id === store.org_id);
                                const orgOrderCount = orderCountsByOrg[store.org_id] || 0;
                                // is order count at max for the org
                                const isStorePastOrderLimit = orgOrderCount >= (org?.order_limit || Infinity);
                                const isStoreWithinDeliveryWindow = isValidStore(store);

                                if (storesListedAlready.includes(store?.id ?? '')) return null;
                                storesListedAlready.push(store?.id ?? '');

                                const itemClassifications = brand?.item_classification_ids?.map(id => itemClassificationsRecord[id]) ?? [];


                                const storeMenus = storeMenuRecord[store?.id ?? ''] || [];;

                                // Check if the store is open based on special hours
                                const today = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD

                                // Check if the store is open based on special hours
                                const specialHoursToday = storeMenus.find(menu => menu?.hours?.special_hours?.some(sh => sh.date === today));
                                const isOpenToday = specialHoursToday ? specialHoursToday : isStoreOpen(store);
                                const isUnavailable = isStorePastOrderLimit || (isToday && !isOpenToday) || (isToday && isPastCutoffTime) || !isStoreWithinDeliveryWindow;


                                return (
                                    <Flipped key={store.id} flipId={store.id}>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0 }}
                                            transition={{ duration: 0.5 }}
                                            layout
                                        >
                                            <RestaurantCard
                                                storeId={store?.id ?? ''}
                                                className='transition-shadow duration-300 ease-in-out hover:shadow-2xl shadow-primary-almost-black w-full'
                                                variant={'creamer'}
                                                brandImage={brand?.brand_image_url}
                                                description={store.description}
                                                title={brand?.name}
                                                foodCategory={store.food_category}
                                                dropOffTimeWindow={dropOffTime}
                                                onViewMenuClick={onViewMenuClick}
                                                // isDisabled={(isToday && !isStoreCurrentlyOpen) || isStorePastOrderLimit || isPastCutoffTime || !isStoreValid}
                                                isUnavailable={isUnavailable || !!holidayCalendarEvent}
                                                // disabledReason={!isStoreValid ? 'Unavailable Within Delivery Hours' : isPastCutoffTime ? 'Order Cutoff Time Has Passed' : !isStoreCurrentlyOpen ? 'Unavailable' : 'Order Limit Reached'}
                                                area={userArea}
                                                brand={brand}
                                                itemClassifications={itemClassifications}
                                            />

                                        </motion.div>
                                    </Flipped>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </Flipper>
            </PageWrapper>
            <GuestInfoDialog
                isDialogOpen={isGuestDialogOpen}
                closeDialog={closeGuestDialog}
                guestOrgId={guestShare?.org_id ?? ''}
                share={guestShare ?? {} as Share}
            />
            <Footer />
        </>
    );
}

export default AppPage;