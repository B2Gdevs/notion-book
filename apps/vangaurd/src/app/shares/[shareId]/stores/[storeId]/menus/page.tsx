'use client';
import { useEffect, useState } from "react";
import StoreIdMenuPage from "../../../../../components/store-id-menu-page";
import { useParams } from "next/navigation";
import { Area, useGetArea, useGetOrg, useGetShare, useGetDeliveryWindowById } from "ui";
import { ShareLinkError } from "../../../../../components/share-link-error";
import { GlobalState, useGlobalStore } from "../../../../../../stores/globalStore";

export default function StoreMenu() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

    const shareId = useParams().shareId as string; 
    const { data: share, isError } = useGetShare(shareId);
    const orgId = share?.org_id;
    const { data: org } = useGetOrg(orgId ?? '');
    const areaId = org?.locations?.[0]?.area_id;
    const { data: area } = useGetArea(areaId ?? '');

    const { data: guestDeliveryWindow } = useGetDeliveryWindowById(share?.delivery_window_id ?? '');

	const selectedDate = useGlobalStore(
		(state: GlobalState) => state.selectedDate,
	);
	
	const isOrgActive = org?.is_active ?? false; // Add null check, default to false;

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


	if (isError || !share) {
        return (
            <ShareLinkError />
        );
    }

	return (
		<StoreIdMenuPage
			userArea={area ?? {} as Area}
			isGuestLimitedView={true}
			guestShare={share}
			isGuestDialogOpen={isDialogOpen}
			setIsGuestDialogOpen={setIsDialogOpen}
			selectedDate={selectedDate}
			isOrgActive={isOrgActive}
			deliveryWindow={guestDeliveryWindow}
		/>
	);
}