
import { Share } from '../models/shareModels';
import { BaseClient } from './baseClient';

export interface ShareParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    orgId?: string;
    startDate?: Date;
    endDate?: Date;
    share_ids?: string[];
}

export class ShareClient extends BaseClient {
    public static async getShare(shareId: string, token: string | null = null): Promise<Share> {
        if (!shareId) throw new Error("shareId is required");
        const endpoint = `/shares/${shareId}`;
        return this.fetchData(endpoint, token, null);
    }

    public static async getShares(params: ShareParams, token: string | null): Promise<Share[]> {
        const endpoint = `/shares${this.constructQueryString(params)}`;
        return this.fetchData(endpoint, token, null);
    }

    public static async createShare(shareData: Share, token: string | null): Promise<Share> {
        const endpoint = `/shares`;
        return this.postData(endpoint, shareData, token, null);
    }

    public static async updateShare(share: Share, token: string | null): Promise<{ message: string }> {
        if (!share?.id) throw new Error("share.id is required");
        const endpoint = `/shares/${share.id}`;
        return this.putData(endpoint, share, token, null);
    }

    public static async deleteShare(shareId: string, token: string | null): Promise<{ message: string }> {
        const endpoint = `/shares/${shareId}`;
        return this.deleteData(endpoint, token, null);
    }

    private static constructQueryString(params: ShareParams): string {
        const query = new URLSearchParams();

        if (params.page) query.append('page', params.page.toString());
        if (params.pageSize) query.append('pageSize', params.pageSize.toString());
        if (params.sortBy) query.append('sortBy', params.sortBy);
        if (params.sortDirection) query.append('sortDirection', params.sortDirection);
        if (params.orgId) query.append('orgId', params.orgId);
        if (params.startDate) query.append('startDate', params.startDate.toISOString());
        if (params.endDate) query.append('endDate', params.endDate.toISOString());
        if (params.share_ids) query.append("share_ids", params.share_ids.join(','))

        return `?${query.toString()}`;
    }
}