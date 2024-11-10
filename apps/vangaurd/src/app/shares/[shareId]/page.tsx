'use client';

import {
    Area,
    CubeLoader,
    DeliveryWindow,
    GuestSignInLayout,
    LoweredDayOfWeek,
    OrderStatus,
    Store,
    User,
    useCreateGuestActorToken,
    useCurrentGuestUserOrdersForSelectedDate,
    useGetArea,
    useGetAreas,
    useGetBrandsByIds,
    useGetDeliveryWindowById,
    useGetOrg,
    useGetShare,
    useGetStoresByIds
} from 'ui';

import { useSession, useSignIn } from '@clerk/nextjs';
import { utcToZonedTime } from 'date-fns-tz';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppPage from '../../components/app-page';
import { ShareLinkError } from '../../components/share-link-error';
import { getStoresAndBrandsByDay as getStoreIdsByDay } from '../../scheduleUtils';

export default function Page() {

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const session = useSession()

    // Get Share from [id] page
    const shareId = useParams().shareId as string;
    const { data: share, isLoading, isError } = useGetShare(shareId);
    const shareDate = share?.date;
    const { data: deliveryWindow } = useGetDeliveryWindowById(share?.delivery_window_id ?? '');
    const timeZone = deliveryWindow?.timezone ?? 'UTC';
    const shareDateToPass = utcToZonedTime(shareDate ?? new Date(), timeZone);

    const orgId = share?.org_id;
    const { data: org } = useGetOrg(orgId ?? '');
    const areaId = org?.locations?.[0]?.area_id;
    const { data: area } = useGetArea(areaId ?? '');

    const { data: guestDeliveryWindow } = useGetDeliveryWindowById(share?.delivery_window_id ?? '');

    const currentPageNum = 1;
    const pageSize = 100;
    const router = useRouter();
    const { data: areas } = useGetAreas(currentPageNum, pageSize);
    // Filter areas so only the area that matches orgDeliveryWindow.area_id is returned
    const matchingArea = areas?.find(area => area.id === guestDeliveryWindow?.area_id);
    // Ensure Argument of type '(Area | undefined)[]' is assignable to parameter of type 'Area[]'.
    const areaToPass = matchingArea ? [matchingArea] : [] as Area[];
    const days: LoweredDayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    // Use share date if available, otherwise default to Monday
    const selectedDate = shareDateToPass ? new Date(shareDateToPass) : new Date();
    const selectedDayIndex = selectedDate?.getDay() ?? 1; // Default to Monday if selectedDate is nullish
    const selectedDay = days[selectedDayIndex];
    const { storeIds } = getStoreIdsByDay(areaToPass ?? [], selectedDay);
    const { data: stores } = useGetStoresByIds(storeIds ?? []);
    // Sort stores by priority group
    const sortedStores = [...(stores ?? [])].sort((a, b) => {
        const priorityA = a?.priority_group ?? 3;
        const priorityB = b?.priority_group ?? 3;
        return priorityA - priorityB;
    });

    const onViewMenuClick = (storeId: string) => {
        router.push(`${shareId}/stores/${storeId}/menus`);
    };

    const brandIds = (stores?.flatMap(store => store?.brand_id).filter(brandId => brandId) || []) as string[];
    const { data: brands } = useGetBrandsByIds(brandIds ?? []);
    const sortedStoresFiltered = sortedStores.filter((store): store is Store => store !== undefined);

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
    const createActorTokenMutation = useCreateGuestActorToken()
    const { isLoaded, signIn, setActive } = useSignIn()

    useEffect(() => {
        let guestUserInfo = localStorage.getItem('guestUserInfo');

        // Check if the guest user info is stored in local storage
        if (!guestUserInfo) {
            setIsDialogOpen(true);
        }
    }, []);

    useEffect(() => {
        let orderId = localStorage.getItem('guestOrderId');

        // Check if the existing orderId includes the shareId
        if (!orderId || !orderId.includes(shareId)) {
            orderId = `guest_${shareId}_${new Date().getTime()}`;
            localStorage.setItem('guestOrderId', orderId);
        }
    }, []);

    async function handleGuestSignIn() {
        if (!isLoaded) return;

        // Trigger the mutation and wait for the result
        try {
            const mutationResult = await createActorTokenMutation.mutateAsync();

            // Check if the mutation was successful and a token was returned
            if (mutationResult) {
                try {
                    const { createdSessionId } = await signIn.create({
                        strategy: 'ticket',
                        ticket: mutationResult,
                    });
                    router.push(`/shares/${shareId}`); // Redirect back to the same share URL

                    await setActive({ session: createdSessionId });
                } catch (err) {
                    // Handle errors during the sign-in process
                    console.error('Error during sign-in with impersonated user:', JSON.stringify(err, null, 2));
                }
                console.error('No token received from the impersonation token creation.');
            }
        } catch (err) {
            // Handle errors from the token creation mutation
            console.error('Error creating impersonation token:', JSON.stringify(err, null, 2));
        }
    }

    useEffect(() => {
        if (isLoaded && !session?.session?.user) {
            handleGuestSignIn();
        }
    }, [isLoaded, session?.session?.user]);


    // If share date is in the past, redirect to an error page
    if (shareDateToPass) {
        const today = new Date();
        const shareDateObject = new Date(shareDateToPass);

        // Set both dates to start of the day for comparison
        today.setHours(0, 0, 0, 0);
        shareDateObject.setHours(0, 0, 0, 0);

        if (shareDateObject < today) {
            return (
                <div className='flex flex-col justify-center items-center p-4'>
                    <span className='text-2xl font-righteous'>Error: Share date is in the past.</span>
                    <span>If you believe this is an error, please contact Colorfull at <span className='underline'>help@colorfull.ai</span></span>
                </div>
            );
        }
    }

    if (isLoading) {
        return (
            <div className='flex flex-col justify-center items-center p-4'>
                <p>Colorfull is loading details for the share...</p>
                <CubeLoader/>
            </div>
        );
    }


    if (session?.session?.user) {
        // Render the main app page or redirect as necessary
        return <AppPage
            sortedStores={sortedStoresFiltered}
            brands={brands ?? []}
            userArea={area ?? {} as Area}
            onViewMenuClick={onViewMenuClick}
            isGuestLimitedView={true}
            guestShare={share}
            isGuestDialogOpen={isDialogOpen}
            setIsGuestDialogOpen={setIsDialogOpen}
            selectedDate={selectedDate}
            selectedOrder={guestActiveMainOrders?.[0]?.status === OrderStatus.NEW_ORDER ? guestActiveMainOrders?.[0] : undefined}
            guestUser={guestUser}
            deliveryWindow={guestDeliveryWindow ?? {} as DeliveryWindow}
        />
    }

    if ((!isLoading && isError) && !share) {
        return (
            <ShareLinkError />
        );
    }

    return (
        <GuestSignInLayout share={share}/>
    );
}