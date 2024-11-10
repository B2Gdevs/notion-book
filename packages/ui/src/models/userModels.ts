import { Diet, NotificationPreferences } from './miscModels';

export interface PersonalIdentifier {
  taxIdentificationNumber?: string;
}

export enum UserType {
  ADMIN = 'admin',
  PARTNER = 'partner',
}

export interface OrderDetails {
  order_ids: string[];
  order_item_ids: string[];
  stipend_used: number;
}

export interface UserCalendarCart {
  cart?: { [date: string]: OrderDetails}; // the strings are order item ids
}

export interface User {
  id?: string;
  clerk_id?: string;
  name?: string;
  email: string;
  phone?: string;
  dietary_classifications?: Diet[];  // For "Dietary Restrictions"
  phone_code?: string; 
  personal_identifiers?: PersonalIdentifier[]; 
  first_name?: string;
  last_name?: string; 
  work_address?: string; 
  notification_settings?: NotificationPreferences; 
  substitutions_allowed?: boolean;
  org_id?: string; 
  calendar_cart?: UserCalendarCart;
  stripe_account_id?: string;
  amount_owed?: number;

  cart?: string[];  // Deprecated
  dietaryClassifications?: Diet[];  // @Deprecated // For "Dietary Restrictions"
  phoneCode?: string; // @Deprecated
  personalIdentifiers?: PersonalIdentifier[]; // @Deprecated
  firstName?: string; // @Deprecated
  lastName?: string; // @Deprecated
  workAddress?: string; // @Deprecated
  notificationSettings?: NotificationPreferences; // @Deprecated
  workOrgId?: string; // @Deprecated
}

