import { ColorfullLocation } from './orgModels';
import { OrderTotal } from './totalModels';
import { User } from './userModels';

export interface PersonalIdentifiers {
	tax_identification_number?: string;
}

export interface SignatureRequirement {
	enabled?: boolean;
	collect_signer_name?: boolean;
	collect_signer_relationship?: boolean;
}

export interface PictureRequirement {
	enabled?: boolean;
}

export interface VerificationRequirements {
	signature_requirement?: SignatureRequirement;
	picture_requirement?: PictureRequirement;
}

export enum DropoffType {
	MEET_AT_DOOR = 'MEET_AT_DOOR',
	LEAVE_AT_DOOR = 'LEAVE_AT_DOOR',
	MEET_IN_LOBBY = 'MEET_IN_LOBBY',
}

export enum SubType {
	VALUE = 'VALUE',
	TAX = 'TAX',
	VALUE_WITH_TAX = 'VALUE_WITH_TAX',
	VAT = 'VAT',
}

export interface SimpleFinanceLine {
	subType: SubType;
	name: string;
	value: number;
}

export interface CompositeFinanceLine {
	breakdown: SimpleFinanceLine[];
}

export enum Type3 {
	MISSING_ITEM = 'MISSING_ITEM',
	INCOMPLETE = 'INCOMPLETE',
	// ... other values as in Python class
}

export enum SchedulingType {
	ASAP = 'ASAP',
	FIXED_TIME = 'FIXED_TIME',
}

export interface Payout {
	payout_from_service_provider?: number;
	payout_from_3rd_party?: number;
	cash_payout?: number;
}

export enum FulfillmentMode {
	DELIVERY = 'DELIVERY',
	RESTAURANT_DELIVERY = 'RESTAURANT_DELIVERY',
	PICKUP = 'PICKUP',
	DINE_IN = 'DINE_IN',
}

export interface FinancialData {
	food_sales: CompositeFinanceLine;
	fee_for_restaurant_provided_delivery?: CompositeFinanceLine;
	// ... other fields from FinancialData class
}

export interface DropoffInstructions {
	dropoff_type?: DropoffType;
	verification_requirements?: VerificationRequirements;
}

export enum CourierStatus {
	COURIER_ASSIGNED = 'COURIER_ASSIGNED',
	COURIER_ON_ROUTE_TO_PICKUP = 'COURIER_ON_ROUTE_TO_PICKUP',
	COURIER_ARRIVED = 'COURIER_ARRIVED',
	COURIER_PICKED_UP_FOOD = 'COURIER_PICKED_UP_FOOD',
	COURIER_COMPLETED = 'COURIER_COMPLETED',
	COURIER_UNASSIGNED = 'UNASSIGNED',
}

export interface Courier {
	name?: string;
	phone?: string;
	phone_code?: string;
	email?: string;
	personal_identifiers?: PersonalIdentifiers;
}

export interface Address {
	full_address?: string;
	postal_code?: string;
	city?: string;
	state?: string;
	country_code?: string;
	address_lines?: string[];
	location?: ColorfullLocation; // Define Locationexport export interface as needed
}

export interface OrderTotalV2 {
	customer_total: FinancialData;
	customer_payment?: CustomerPaymentV2; // Define CustomerPaymentV2export export interface as needed
	payout?: Payout;
}

export interface OrderIssue {
	type: Type3;
}

export interface FulfillmentInfo {
	pickup_time?: string; // isoformat date string
	delivery_time?: string; // isoformat date string
	fulfillment_mode?: FulfillmentMode;
	scheduling_type?: SchedulingType;
	courier_status?: CourierStatus;
	table_identifier?: string;
}

export interface DeliveryInfo {
	courier?: Courier;
	destination?: Address;
	license_plate?: string;
	make_model?: string;
	last_known_location?: Location; // Define Locationexport export interface as needed
	dropoff_instructions?: DropoffInstructions;
	note?: string;
}

export interface CustomerPaymentV2 {
	customer_payment_due?: number;
	customer_prepayment?: number;
	customer_amount_to_return?: number;
	payment_due_to_restaurant?: number;
}

export enum SourceType {
	POINT_OF_SALE = 'POINT_OF_SALE',
	ORDERING_MARKETPLACE = 'ORDERING_MARKETPLACE',
	AGGREGATOR = 'AGGREGATOR',
	CUSTOMER_INTERACTION = 'CUSTOMER_INTERACTION',
}

export interface SourceExternalIdentifiers {
	id?: string;
	friendly_id?: string;
	source?: string;
	source_type?: SourceType;
	source_external_identifiers?: SourceExternalIdentifiers; // Recursive reference
}

export interface OrderExternalIdentifiers {
	id?: string;
	friendly_id: string;
	source?: string;
	source_type?: SourceType;
	source_external_identifiers?: SourceExternalIdentifiers;
}

export enum OrderStatus {
	NEW_ORDER = 'NEW_ORDER',
	CONFIRMED = 'CONFIRMED',
	PICKED_UP = 'PICKED_UP',
	CANCELED = 'CANCELED',
	PARTIALLY_CANCELED = 'PARTIALLY_CANCELED',
	PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
	FULFILLED = 'FULFILLED',
	PREPARED = 'PREPARED',
	REJECTED = 'REJECTED',
	UNKNOWN = 'UNKNOWN',
	FAILED_TO_SEND_TO_KITCHEN = 'FAILED_TO_SEND_TO_KITCHEN',
	SENT_TO_KITCHEN = 'SENT_TO_KITCHEN',
	COMPLETED_EXTERNAL_TO_SYSTEM = "COMPLETED_EXTERNAL_TO_SYSTEM",
    SUBSTITUTED = "SUBSTITUTED"
}

// Function to convert OrderStatus to a displayable string without '_' characters
export function getOrderStatusDisplay(status: OrderStatus): string {
    return status.replace('_', ' ');
}

export interface Modifier {
	quantity: number;
	sku_price?: number;
	id?: string;
	name?: string;
	price?: number;
	group_name?: string;
	group_id?: string;
	station_id?: string;
	modifiers?: Modifier[];
}

export interface OrderItem {
	user_id: string;
	menu_item_id: string;
	store_id: string;
	quantity: number;
	sku_price?: number;
	id?: string;
	name?: string;
	note?: string;
	category_id?: string;
	category_name?: string;
	price: number;
	modifiers: Modifier[];
	delivery_date?: string;
	share_id?: string;
	share_guest_id?: string;
	delivery_window_id?: string;
}
export interface Destination {
	postalCode: string;
	city: string;
	state: string;
	country_code: string;
	address_lines: string[];
	location: Location;
}

export interface Breakdown {
	sub_type: string;
	name: string;
	value: number;
}

export interface FeeWithBreakdown {
	breakdown: Breakdown[];
}

export interface CustomerTotal {
	food_sales?: FeeWithBreakdown;
	fee_for_restaurant_provided_delivery?: FeeWithBreakdown;
	restaurant_funded_discount?: FeeWithBreakdown;
	tip_for_restaurant?: FeeWithBreakdown;
	adjustments?: FeeWithBreakdown;
	packing_fee?: FeeWithBreakdown;
	bag_fee?: FeeWithBreakdown;
	service_provider_discount?: FeeWithBreakdown;
	tip_for_service_provider_courier?: FeeWithBreakdown;
	fee_for_service_provider_delivery?: FeeWithBreakdown;
	small_order_fee?: FeeWithBreakdown;
	service_fee?: FeeWithBreakdown;
	other_fee?: FeeWithBreakdown;
	coupon_codes: string[];
}

export interface ServiceProviderCharge {
	sales_tax_withheld?: FeeWithBreakdown;
	commission?: FeeWithBreakdown;
	processing_fee?: FeeWithBreakdown;
	delivery_fee_for_restaurant?: FeeWithBreakdown;
	charges_adjustments?: FeeWithBreakdown;
	other_fees?: FeeWithBreakdown;
}

export interface CustomerPayment {
	value: number;
	processing_status: string;
	payment_method: string;
}

export interface IssueDetail {
	id: string;
	acknowledged: boolean;
	note: string;
	note_key: string;
}

export interface MenuReconciliationFailedAttempt {
	menu_reconciliation_failed_reason: string;
	menu_reconciliation_method: string;
}

export interface ActivationTrigger {
	manual_activation?: Record<string, unknown>;
	immediate_activation?: Record<string, unknown>;
	timed_activation?: Record<string, unknown>;
}

export interface Order {
    id?: string;
    user_id: string;
    external_identifiers: OrderExternalIdentifiers;
    currency_code: string;
    status: OrderStatus;
    items?: OrderItem[];
    ordered_at?: string;
    customer?: User;
    customer_note?: string;
    delivery_info?: DeliveryInfo;
    order_total?: OrderTotal;
    order_total_v_2?: OrderTotalV2;
    customer_payments?: CustomerPaymentV2[];
    fulfillment_info?: FulfillmentInfo;
    order_issues?: OrderIssue[];
    order_state_changed_at?: string;
    subsidy?: number;
    org_id?: string;
    area_id?: string;
    batch_id?: string;
    order_total_id?: string;
    payment_intent_id?: string;
    sub_order_ids?: string[];
    is_sub_order: boolean;
    store_id?: string;
    parent_order_id?: string;
	created_at?: string;
	updated_at?: string;
	is_retry?: boolean;
	previous_retried_order_ids?: string[];
	current_retry_order_id?: string;
	share_id?: string;
	share_guest_id?: string;
	share_guest_email?: string;
	delivery_window_id?: string;
	colorfull_note?: string;
	substituted_store_id?: string;
}

export interface OrderItemModifier {
    quantity: number;
    sku_price?: number;
    id?: string;
    name?: string;
    price?: number;
    group_name?: string;
    group_id?: string;
    station_id?: string;
    modifiers?: OrderItemModifier[];
    delivery_date?: string;
}