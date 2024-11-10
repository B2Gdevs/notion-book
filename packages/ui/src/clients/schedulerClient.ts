import { Scheduler, SchedulerCreateRequest, SchedulerType, SchedulerUpdateRequest } from '../models/schedulerModels';
import { BaseClient } from './baseClient';

export interface SchedulerQueryParams {
    org_id?: string;
    area_id?: string;
    store_id?: string;
    project_id?: string;
    page?: number;
    page_size?: number;
    type?: SchedulerType;
}

export class SchedulerClient extends BaseClient {
    /**
     * Updates an existing scheduler.
     * @param schedulerId - The ID of the scheduler to update.
     * @param updateRequest - The updated scheduler data.
     * @param token - The JWT token for authentication.
     * @returns The updated scheduler.
     */
    public static async updateScheduler(schedulerId: string, updateRequest: SchedulerUpdateRequest, token: string | null): Promise<Scheduler> {
        const endpoint = `/scheduler/${schedulerId}`;
        return this.putData(endpoint, updateRequest, token, null);
    }

    /**
     * Deletes a scheduler.
     * @param schedulerId - The ID of the scheduler to delete.
     * @param token - The JWT token for authentication.
     * @returns A message indicating that the scheduler was deleted.
     */
    public static async deleteScheduler(schedulerId: string, token: string | null): Promise<{ message: string }> {
        const endpoint = `/scheduler/${schedulerId}`;
        return this.deleteData(endpoint, token, null);
    }

    /**
     * Retrieves a scheduler by its ID.
     * @param schedulerId - The ID of the scheduler to retrieve.
     * @param token - The JWT token for authentication.
     * @returns The scheduler with the given ID.
     */
    public static async getSchedulerById(schedulerId: string, token: string | null): Promise<Scheduler> {
        const endpoint = `/scheduler/${schedulerId}`;
        return this.fetchData(endpoint, token, null);
    }

    /**
     * Pauses a scheduler.
     * @param schedulerId - The ID of the scheduler to pause.
     * @param token - The JWT token for authentication.
     * @returns A message indicating that the scheduler was paused.
     */
    public static async pauseScheduler(schedulerId: string, token: string | null): Promise<{ message: string }> {
        const endpoint = `/scheduler/${schedulerId}/pause`;
        return this.postData(endpoint, {}, token, null);
    }

    /**
     * Unpauses a scheduler.
     * @param schedulerId - The ID of the scheduler to unpause.
     * @param token - The JWT token for authentication.
     * @returns A message indicating that the scheduler was unpaused.
     */
    public static async unpauseScheduler(schedulerId: string, token: string | null): Promise<{ message: string }> {
        const endpoint = `/scheduler/${schedulerId}/unpause`;
        return this.postData(endpoint, {}, token, null);
    }

    /**
     * Creates a new scheduler.
     * @param createRequest - The scheduler creation data.
     * @param token - The JWT token for authentication.
     * @returns The created scheduler.
     */
    public static async createScheduler(createRequest: SchedulerCreateRequest, token: string | null): Promise<Scheduler> {
        const endpoint = `/scheduler`;
        return this.postData(endpoint, createRequest, token, null);
    }

    /**
     * Queries schedulers based on provided parameters.
     * @param params - The query parameters.
     * @param token - The JWT token for authentication.
     * @returns An array of schedulers.
     */
    public static async querySchedulers(params: SchedulerQueryParams, token: string | null): Promise<Scheduler[]> {
        const endpoint = `/schedulers?${this.constructQueryString(params)}`;
        return this.fetchData(endpoint, token, null);
    }

    private static constructQueryString(params: SchedulerQueryParams): string {
        const queries: string[] = [];
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                queries.push(`${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`);
            }
        });
        return queries.join('&');
    }
}