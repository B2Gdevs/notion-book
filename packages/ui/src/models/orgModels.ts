import { NotificationPreferences } from './miscModels';

export enum OrgType {
	RESTAURANT = 'restaurant',
	RECIPIENT = 'recipient',
	COURIER = 'courier',
	PARTNER = 'partner',
}

export enum InvoicingPeriod {
	DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY"
}

export enum DistributionListType {
	ORDER_ITEMS_FORECAST = 'ORDER_ITEMS_FORECAST',
}

export interface BudgetSchedule {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;
}

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface ColorfullLocation {
	address: string;
	is_served: boolean;
	latitude: number | null;
	longitude: number | null;
	users?: string[];
	area_id?: string;
	delivery_instructions?: string;
}

export interface OrgGroup {
	id?: string;
	name: string;
	org_ids: string[];
}

interface Deal {
	colorfull_percentage?: number;
	base_delivery_fee?: number;
	is_grandfathered?: boolean;
	order_threshold?: number;
	service_percentage?: number;
	price_threshold?: number;
}

// Define a new interface for prioritized couriers
export interface PrioritizedCourier {
    courier_id: string;
    priority: number;
}

export interface Org {
    id?: string | null; 
    external_id?: string | null; 
    name: string;
    logo_url?: string | null; 
    brand_image_url?: string | null; 
    description?: string | null; 
    budget?: Budget; 
    financial_details?: FinancialDetails; 
    notification_settings?: NotificationPreferences; 
    created_at?: string | null; 
    updated_at?: string | null; 
    address?: string | null; 
    org_type?: string; 
    is_active?: boolean; 
    food_category?: string | null; 
    stripe_account_id?: string | null; 
    bank_onboarding_complete?: boolean; 
    white_listed_domains?: string[]; 
    store_id?: string | null; 
    locations?: ColorfullLocation[]; 
    integration_ids?: string[];
    brand_ids?: string[]; 
    store_ids?: string[];
	admin_email?: string; 
	org_group_id?: string;
	invoicing_period?: InvoicingPeriod;
	deal?: Deal	
	budget_schedule?: BudgetSchedule; // Optional property to handle cases where the schedule might not be set
	share_calendar?: { [key: string]: string }; // Optional property to handle cases where the calendar might not be set
	order_limit?: number;
	delivery_window_id?: string;
	preferred_courier_ids?: PrioritizedCourier[]; 
	text_art?: string;
	distribution_list: { [K in DistributionListType]?: string[] };
}

export interface Tax {
	name: string;
	rate: number;
	description: string;
}

interface FinancialDetails {
	serviceCharge: number;
	taxes: Tax[];
	bank_name: string;
	account_number: string;
	routing_number: string;
}

export enum BudgetType {
	RECURRING = 'RECURRING',
	ONE_TIME = 'ONE_TIME',
}

export enum BudgetFrequency {
	DAILY = 'DAILY',
	WEEKLY = 'WEEKLY',
	MONTHLY = 'MONTHLY',
	YEARLY = 'YEARLY',
}

export interface Budget {
	id: string;
	name: string; 
	amount: number; 
	type: BudgetType; 
	frequency: BudgetFrequency;
	start_date?: string; 
	end_date?: string;
	description?: string; 
	userIds: string[]; 
	created_at?: string; 
	last_updated?: string; 
}
