'use client';
import React, { useEffect, useState } from 'react';
import { getHolidayOfDate, useGetCalendarEvents } from '..';
import { Item, ModifierGroup, Photo } from '../models/menuModels';
import { OrderItem, OrderItemModifier } from '../models/orderModels';
import { Checkbox } from './checkbox';
import { Collapsible } from './collapsible';
import { PaymentButton } from './payment-button';
import { QuantityComp } from './quantity-comp';
import { RequirementTag } from './requirement-tag';
import { TextBox } from './textbox';

interface OrderItemDialogContentProps {
	restaurantId: string;
	menuItem: Item;
	modifierGroups: Record<string, ModifierGroup>;
	photos: Record<string, Photo>;
	items: Record<string, Item>;
	onCompletedOrderItemSelection?: (orderItem: OrderItem) => void;
	storeId: string;
	userId: string;
	orderingDisabled?: boolean;
	disabledMessage?: string;
	hasUserOrderedToday?: boolean;
	existingOrderItem?: OrderItem;
	isOrderLimitReached?: boolean;
	isPastCutoffTime?: boolean;
	isStoreOrBrandUnavailable?: boolean;
	isOrgActive?: boolean;
	isAdminGuestAccount?: boolean;
	selectedDate?: Date;
}

export const OrderItemDialogContent: React.FC<OrderItemDialogContentProps> = ({
	menuItem,
	modifierGroups,
	items,
	onCompletedOrderItemSelection,
	storeId,
	userId,
	orderingDisabled: initialOrderingDisabled,
	hasUserOrderedToday,
	existingOrderItem,
	isOrderLimitReached,
	isPastCutoffTime,
	isStoreOrBrandUnavailable,
	isOrgActive,
	isAdminGuestAccount,
	selectedDate,
}) => {
	const [quantity, setQuantity] = useState<number>(existingOrderItem?.quantity ?? 1);
	const [instructions, setInstructions] = useState<string>(existingOrderItem?.note ?? '');
	const [selectedModifiers, setSelectedModifiers] = useState<Record<string,
		{
			groupId: string;
			selected: boolean
		}>>(
			existingOrderItem?.modifiers.reduce((acc, mod) => {
				acc[`${mod.group_id}-${mod.id}`] = { groupId: mod?.group_id ?? '', selected: true };
				return acc;
			}, {} as Record<string, { groupId: string; selected: boolean }>) ?? {}
		);
	const [totalPrice, setTotalPrice] = useState<number>(
		(existingOrderItem?.price ?? (menuItem.price?.amount ?? 0)) * (existingOrderItem?.quantity ?? 1),
	);
	const [orderingDisabled, setOrderingDisabled] = useState<boolean>(
		initialOrderingDisabled ?? false,
	);

    const { data: events } = useGetCalendarEvents();
    const holidayCalendarEvent = getHolidayOfDate(selectedDate?.toISOString().slice(0, 10) ?? '', events ?? [])

	useEffect(() => {
		const selectedModifierItems = Object.keys(selectedModifiers).filter(
			(key) => selectedModifiers[key]?.selected,
		);
		const totalModifierPrice = selectedModifierItems.reduce((sum, key) => {
			const itemId = key.split('-')[1];
			return sum + (items[itemId]?.price?.amount ?? 0);
		}, 0);
		setTotalPrice(((menuItem.price?.amount ?? 0) + totalModifierPrice) * quantity);
	}, [selectedModifiers, items, menuItem.price?.amount, quantity]);

	const handleCheckboxClick = (itemId: string, groupId: string) => {
		setSelectedModifiers(prev => {
			const newModifiers = { ...prev };
			const key = `${groupId}-${itemId}`;
			if (newModifiers[key]?.selected) {
				delete newModifiers[key];
			} else {
				newModifiers[key] = { groupId, selected: true };
			}
			return newModifiers;
		});
	};

	const countSelectedModifiersInGroup = (groupId: string) => {
		return Object.values(selectedModifiers).filter(
			(mod) => mod.groupId === groupId && mod.selected,
		).length;
	};

	const isCheckboxDisabled = (itemId: string, groupId: string) => {
		if (isPastCutoffTime) return true;
		const group = modifierGroups[groupId];
		const selectedCount = countSelectedModifiersInGroup(groupId);
		return group?.maximum_selections !== 1 &&
			(group?.maximum_selections === 0 && group?.minimum_selections === 0 ? false :
				selectedCount >= (group?.maximum_selections ?? 0) &&
				!selectedModifiers[`${groupId}-${itemId}`]?.selected);
	};

	const handleCreateOrUpdateOrderItem = () => {
		const modifiers = Object.entries(selectedModifiers)
			.filter(([_, value]) => value.selected)
			.map(([key, _]) => {
				const [groupId, itemId] = key.split('-');
				const item = items[itemId];
				const group = modifierGroups[groupId];
				return {
					id: item.id,
					name: item.name,
					quantity: 1,
					price: item.price.amount,
					group_name: group.name,
					group_id: group.id,
					store_id: storeId,
					modifiers: [],
				} as OrderItemModifier;
			});

		const orderItem: OrderItem = {
			...(existingOrderItem ?? {}),
			store_id: storeId,
			menu_item_id: menuItem?.id ?? '',
			user_id: isAdminGuestAccount ? userId + '_guest' : userId,
			name: menuItem.name,
			quantity,
			note: instructions,
			category_id: 'N/A',
			category_name: 'N/A',
			price: menuItem.price?.amount ?? 0,
			modifiers,
		};

		onCompletedOrderItemSelection?.(orderItem);
	};

	const allSelectionsValid = () => {
		return menuItem.modifier_group_ids?.every((groupId) => {
			const group = modifierGroups[groupId];
			if (!group) return true;
			if (!group.is_active) return true;
			const selectedCount = countSelectedModifiersInGroup(groupId);
			if (group.maximum_selections === 0 && group.minimum_selections === 0) {
				return true;
			}
			return (
				selectedCount >= group.minimum_selections &&
				selectedCount <= group.maximum_selections
			);
		});
	};

	const getDisabledMessage = () => {

		if (Boolean(holidayCalendarEvent)) {
			return 'This store is currently closed for the holiday.';
		}

		if (isPastCutoffTime) {
			return 'Order cutoff time has passed';
		}
		return isOrderLimitReached ? 'Order limit reached for this store' : 'Missing required items';
	};

	useEffect(() => {
		const selectionsValid = allSelectionsValid();
		setOrderingDisabled(!selectionsValid);
	}, [selectedModifiers, menuItem.modifier_group_ids, modifierGroups]);

	useEffect(() => {
		if (isPastCutoffTime) {
			setOrderingDisabled(true);
		}
	}, [isPastCutoffTime]);

	return (
		<div className='flex flex-col'>
			<div className='px-8' style={{ flex: '1 0 auto' }}>
				{menuItem?.modifier_group_ids?.map((modifierGroupId, index) => {
					const modifier = modifierGroups[modifierGroupId];
					if (!modifier) return null;
					if (!modifier.name) return null;
					if (!modifier.is_active) return null;
					const updatedLabel =
						(modifier?.minimum_selections ?? 0) < (modifier?.maximum_selections ?? 0)
							? `(Pick up to ${modifier.maximum_selections})`
							: ``;
					return (
						<Collapsible
							key={modifierGroupId}
							stepHeaderProps={{
								step: (index + 1).toString(),
								text: modifier.name,
								options: [],
								orderPopup: true,
							}}
							expanded={index === 0}
							endComponent={
								<RequirementTag
									label={updatedLabel}
									type={
										(modifier?.minimum_selections ?? 0) > 0 ? 'required' : 'optional'
									}
								/>
							}
						>
							{modifier.item_ids?.map((itemId) => {
								const option = items[itemId];
								const isDisabled = isCheckboxDisabled(itemId, modifierGroupId);
								const item = items[itemId];
								if (!item) return null;
								if (!item.name) return null;
								if (!item.is_active) return null;

								return (
									<Checkbox
										key={itemId}
										text={option?.name ?? 'N/A'}
										currencyValue={option?.price?.amount ?? 0}
										disabled={isDisabled}
										checked={
											selectedModifiers[`${modifierGroupId}-${itemId}`]
												?.selected ?? false
										}
										onClick={() => handleCheckboxClick(itemId, modifierGroupId)}
										orderPopup={true}
										className='ml-4'
									/>
								);
							})}
						</Collapsible>
					);
				})}
				<div className='flex flex-col items-center justify-center w-full'>
					<TextBox
						maxChars={100}
						headerText='Special Requests?'
						onTextChange={setInstructions}
						text={instructions}
					/>
					{(orderingDisabled || Boolean(holidayCalendarEvent)) && (
						<span className="text-secondary-pink-salmon animate-pulse text-left text-xs font-righteous p-2">
							{getDisabledMessage()}
						</span>
					)}
					{isOrderLimitReached && (
						<span className="text-secondary-pink-salmon animate-pulse text-left text-xs font-righteous p-2">
							Order limit reached for this store.
						</span>
					)}
					{isStoreOrBrandUnavailable && (
						<span className="text-secondary-pink-salmon animate-pulse text-left text-xs font-righteous p-2">
							This store is currently unavailable.
						</span>
					)}
					{!isOrgActive && (
						<span className="text-secondary-pink-salmon animate-pulse text-left text-xs font-righteous p-2">
							Your org is currently inactive and unable to place orders.
						</span>
					)}
					{hasUserOrderedToday && (
						<span className="text-secondary-pink-salmon animate-pulse text-left text-xs font-righteous p-2">
							You have already placed an order for today.
						</span>
					)}
					<div className='flex items-center justify-center w-full'>
						<QuantityComp
							maxQuantity={100}
							initialQuantity={1}
							onAdd={() => setQuantity(quantity + 1)}
							onRemove={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
						/>
					</div>
				</div>
			</div>
			<div className='z-50 sticky bottom-0 bg-secondary-creamer-beige w-full flex justify-center items-center border-t border-gray-200 py-4 mt-5 drop-shadow'>
				{/* UI Components */}
				<PaymentButton
					label={existingOrderItem ? 'Save Edits' : 'Add to Order'}
					onClick={handleCreateOrUpdateOrderItem}
					amount={totalPrice}
					disabled={orderingDisabled || hasUserOrderedToday || isOrderLimitReached || isPastCutoffTime || !isOrgActive || isStoreOrBrandUnavailable || Boolean(holidayCalendarEvent)}
				/>
			</div>
		</div>
	);
};
