'use client';

import { FC } from 'react';
import { GlobalState, useGlobalStore } from '../../stores/globalStore';
import { OrderSheetProps } from './order-sheet';
import { OrgMenuCartFooter } from './org-menu-cart-footer';


type OrgMenuFooterHolderProps = {
	onLogoClick?: () => void;
	orgMenu?: boolean;
};

export const OrgMenuFooterHolder: FC<OrgMenuFooterHolderProps> = () => {

	const selectedDate = useGlobalStore(
		(state: GlobalState) => state.selectedDate,
	);

	// Define the props for OrderSheet
	const orderSheetProps: OrderSheetProps = {
		isCheckout: true,
		selectedDate: selectedDate,
	};

	return (
		<OrgMenuCartFooter
			orderSheetProps={orderSheetProps} // pass the props to OrgMenuCartFooter
			selectedDate={selectedDate}		/>
	);
};
