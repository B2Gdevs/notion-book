import { BaseClient } from './baseClient';

export class SvixClient extends BaseClient {
    public static async getAppPortalUrl(token: string | null): Promise<{ url: string }> {
        const endpoint = `/svix/app-portal`;
        return this.fetchData(endpoint, token, null);
    }
}