import { EmailMessage } from '../models/notificationModels';
import { BaseClient } from './baseClient';

/**
 * Client for interacting with the email API.
 */
export class NotificationClient extends BaseClient {
  /**
   * Sends a custom email.
   * @param emailMessage - The email message to send.
   * @param token - The JWT token for authentication.
   * @returns A message indicating the status of the email sending process.
   */
  public static async sendEmail(emailMessage: EmailMessage, token: string | null): Promise<{ message: string }> {
    const endpoint = `/send_email`;
    return this.postData(endpoint, emailMessage, token, null);
  }

  public static async sendRestaurantOrderItemsForecast(forecastDate: string, token: string | null): Promise<{ message: string }> {
    const endpoint = `/send_restaurant_order_items_forecast`;
    return this.postData(endpoint, { forecast_date: forecastDate }, token, null); // Pass the selected date in the request
  }
}