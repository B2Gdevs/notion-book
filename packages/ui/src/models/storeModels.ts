import { StoreHoursConfiguration } from './hoursModels'; // You'll need to define this based on your needs

export type StoreState = 'OPEN' | 'OFF_HOUR' | 'SERVICE_PROVIDER_PAUSED' | 'OPERATOR_PAUSED' | 'SERVICE_PROVIDER_PAUSED_COURIERS_UNAVAILABLE' | 'STORE_UNAVAILABLE' | 'HOLIDAY_HOUR' | 'MENU_UNAVAILABLE' | 'SERVICE_PROVIDER_PAUSED_MISCONFIGURED' | 'OPEN_FOR_PICKUP_ONLY' | 'OPEN_FOR_DELIVERY_ONLY' | 'CLOSED_FOR_UNDETERMINED_REASON';

export enum StoreStates {
  OPEN = 'OPEN',
  OFF_HOUR = 'OFF_HOUR',
  SERVICE_PROVIDER_PAUSED = 'SERVICE_PROVIDER_PAUSED',
  OPERATOR_PAUSED = 'OPERATOR_PAUSED',
  SERVICE_PROVIDER_PAUSED_COURIERS_UNAVAILABLE = 'SERVICE_PROVIDER_PAUSED_COURIERS_UNAVAILABLE',
  STORE_UNAVAILABLE = 'STORE_UNAVAILABLE',
  HOLIDAY_HOUR = 'HOLIDAY_HOUR',
  MENU_UNAVAILABLE = 'MENU_UNAVAILABLE',
  SERVICE_PROVIDER_PAUSED_MISCONFIGURED = 'SERVICE_PROVIDER_PAUSED_MISCONFIGURED',
  OPEN_FOR_PICKUP_ONLY = 'OPEN_FOR_PICKUP_ONLY',
  OPEN_FOR_DELIVERY_ONLY = 'OPEN_FOR_DELIVERY_ONLY',
  CLOSED_FOR_UNDETERMINED_REASON = 'CLOSED_FOR_UNDETERMINED_REASON',
}

// Represents the Store model, extended with new properties from the Python model
export interface Store {
  [key: string]: any;
  id?: string;
  otter_id?: string;
  org_id: string;
  name: string;
  menu_ids?: string[];
  brand_id?: string;
  is_otter_connected?: boolean;
  // brand_image_url?: string;
  priority_group?: number;
  hours?: StoreHoursConfiguration;
  store_state?: StoreState;
  store_hours_changed_at?: Date;
  store_state_changed_at?: Date;
}
