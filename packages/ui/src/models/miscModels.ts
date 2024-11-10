export interface NotificationSetting {
  id?: string;
  title?: string;
  description?: string;
  email: boolean;
  phone: boolean;
}

export interface NotificationPreferences {
  successful_delivery: NotificationSetting;
  substitution_requests: NotificationSetting;
  unsuccessful_payment: NotificationSetting;
  friendly_reminder: NotificationSetting;
  friendly_reminder_without_stipend: NotificationSetting;
  purchase_receipt: NotificationSetting;
}

export interface Diet {
  id?: string;
  name?: string;
  description?: string;
  image_url?: string;
  item_classification_ids?: string[];
}
