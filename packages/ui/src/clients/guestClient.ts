import { BaseClient } from './baseClient';

/**
 * Client for interacting with the guest session API.
 */
export class GuestClient extends BaseClient {
  /**
   * Creates a guest session and retrieves a token.
   * @param token - The authentication token, if needed.
   * @returns A promise resolving to the guest session token.
   */
  public static async createGuestActorToken(token: string | null): Promise<string> {
    const endpoint = `/guest/create_actor_token`;
    return this.postData(endpoint, {}, token, null);
  }
}