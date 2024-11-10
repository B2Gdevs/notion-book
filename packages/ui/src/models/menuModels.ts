import { MenuHoursConfiguration } from "./hoursModels";

export interface Category {
  menu_id: string;
  otter_id?: string;
  id?: string;
  name: string;
  description: string;
  item_ids: string[];
  is_active?: boolean;
}

export interface TimeInterval {
  id?: string;
  day: string;
  from_hour: number;
  from_minute: number;
  to_hour: number;
  to_minute: number;
  timezone: string;
}

export interface CurrencyAmount {
  currency_code: string;
  amount: number;
}

export interface AdditionalCharge {
  id?: string;
  charge_type: string;
  charge_amount?: CurrencyAmount;
}


export interface Item {
  id?: string;
  description: string;
  menu_id: string;
  name: string;
  rules?: Record<string, any>[];
  modifier_group_ids: string[];
  price: CurrencyAmount;
  photo_ids: string[];
  otter_id?: string;
  sale_status: string
  suspended_until?: string;
  is_active: boolean;
  store_id?: string;
  item_classifications_ids?: string[]; // Optional array of item classification ids
  
  // Deprecating soon
  item_classifications?: ItemClassification[]; // Optional array of item classifications

}
export interface ModifierGroup {
  id?: string;
  otter_id?: string;
  menu_id: string;
  name: string;
  minimum_selections: number;
  maximum_selections: number;
  item_ids?: string[];
  required: boolean;
  is_active: boolean;
}

export interface Photo {
  id?: string;
  otter_id?: string;
  menu_id: string;
  file_name?: string;
  fileName?: string;
  content_type?: string;
  contentType?: string;
  url: string;
  is_active?: boolean;
}

export interface ItemClassification {
  id?: string;
  tag: string; // Classification tag for the item, e.g., "vegan"
  containsAllergen?: boolean; // Indicates whether the item contains allergens
  default?: boolean; // Indicates whether the classification is as default
}

export interface Menu {
  store_id: string;
  name: string;
  hours?: MenuHoursConfiguration; // Using the detailed hours configuration
  id?: string;
  otter_id?: string;
  description?: string;
  fulfillment_modes?: string[];
  additional_charges?: AdditionalCharge[];
  category_ids?: string[];
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  dietary_classifications?: ItemClassification[]; // Optional array of dietary classifications
  allergen_classifications?: ItemClassification[]; // Optional array of allergen classifications

  categories?: Record<string, Category>; // Deprecated
  modifier_groups?: Record<string, ModifierGroup>; // Deprecated
  items?: Record<string, Item>; // Deprecated
  photos?: Record<string, Photo>; // Deprecated
}
