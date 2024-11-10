import { Menu } from '../models/menuModels';
import { Store } from '../models/storeModels';
import { BaseClient } from './baseClient';

export interface GetStoresParams {
    orgId?: string;
    page?: number;
    pageSize?: number;
    storeIds?: string[];
}
export interface CreateStoreParams {
    orgId: string;
    storeData: Store;
    brandId: string;
}

export class StoreClient extends BaseClient {
    public static async getStores({ orgId, page, pageSize, storeIds: store_ids }: GetStoresParams = {}, token: string | null): Promise<Store[]> {
        let endpoint = `/stores`;
        const params = new URLSearchParams();
        if (orgId) params.append('org_id', orgId);
        if (page) params.append('page', page.toString());
        if (pageSize) params.append('pageSize', pageSize.toString());
        if (store_ids && store_ids.length > 0) {
            params.append('store_ids', store_ids.join(','));
        }
        if (params.toString()) endpoint += `?${params}`;
        return this.fetchData(endpoint, token, null);
    }

    public static async getStore(storeId: string, token: string | null): Promise<Store> {
        const endpoint = `/stores/${storeId}`;
        return this.fetchData(endpoint, token, null);
    }

    public static async getStoresByIds(storeIds: string[], token: string | null): Promise<Store[]> {
        const stores = [];
        for (const id of storeIds) {
            const store = await this.getStore(id, token);
            stores.push(store);
        }
        return stores;
    }

    public static async createStore(
        orgId: string,
        brandId: string,    
        storeData: Store,
        token: string | null
    ): Promise<Store> {
        const endpoint = `/orgs/${orgId}/brands/${brandId}/stores`;
        return this.postData(endpoint, storeData, token, null);
    }

    public static async updateStore(store: Store, token: string | null): Promise<Store> {
        const endpoint = `/stores/${store?.id}`;
        return this.putData(endpoint, store, token, null);
    }

    public static async deleteStore(
        storeId: string,
        token: string | null
    ): Promise<{ message: string }> {
        const endpoint = `/stores/${storeId}`;
        return this.deleteData(endpoint, token, null);
    }

    public static async getMenus(
        storeId: string,
        page = 1,
        pageSize = 10,
        token: string | null
    ): Promise<Menu[]> {
        const endpoint = `/stores/${storeId}/menus/?page=${page}&page_size=${pageSize}`;
        return this.fetchData(endpoint, token, null);
    }

    public static async getStoresByOrgId(orgId: string, token: string | null): Promise<Store[]> {
        const endpoint = `/stores?org_id=${orgId}`;
        return this.fetchData(endpoint, token, null);
    }

    public static async getStoresByOtterId(otterId: string, token: string | null): Promise<Store[]> {
        const endpoint = `/stores?otter_id=${otterId}`;
        return this.fetchData(endpoint, token, null);
    }

	
	public static async pauseStore(
		storeId: string,
		token: string | null
	): Promise<Store> {
		return this.postData(`/stores/${storeId}/pause`, {}, token, null);
	}
	
	public static async unpauseStore(
		storeId: string,
		token: string | null
	): Promise<Store> {
		return this.postData(`/stores/${storeId}/unpause`, {}, token, null);
	}
}