import { BatchRunResult } from '../models/processingModels';
import { BaseClient } from './baseClient';

export interface BatchRunResultParams {
    batchRunIds?: string[];
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    datetimeField?: string;
}

export interface CreateBatchRunRequest {
    basic_batching: boolean;
    date?: string; // Assuming date is optional
    delivery_window_id?: string;
}

export class BatchRunResultClient extends BaseClient {
    public static async createBatchRunResult(batchRunData: CreateBatchRunRequest, token: string | null): Promise<{ message: string }> {
        const endpoint = `/batch-run-results`;
        try {
            const response = await this.postData(endpoint, batchRunData, token, null);
            return { message: response.message ?? 'Batch run result created successfully' };
        } catch (error) {
            console.error('Error creating batch run result:', error);
            throw error;
        }
    }

    public static async getBatchRunResultById(batchRunResultId: string, token: string | null): Promise<BatchRunResult> {
        const endpoint = `/batch-run-results/${batchRunResultId}`;
        return this.fetchData(endpoint, token, null);
    }

    public static async updateBatchRunResult(batchRunResultId: string, batchRunResultData: BatchRunResult, token: string | null): Promise<BatchRunResult> {
        const endpoint = `/batch-run-results/${batchRunResultId}`;
        return this.putData(endpoint, batchRunResultData, token, null);
    }

    public static async deleteBatchRunResult(batchRunResultId: string, token: string | null): Promise<{ message: string }> {
        const endpoint = `/batch-run-results/${batchRunResultId}`;
        return this.deleteData(endpoint, token, null);
    }

    public static async getBatchRunResults(params: BatchRunResultParams, token: string | null): Promise<BatchRunResult[]> {
        const endpoint = `/batch-run-results?${this.constructQueryString(params)}`;
        return this.fetchData(endpoint, token, null);
    }

    private static constructQueryString(params: BatchRunResultParams): string {
        const queries = [];
        if (params.batchRunIds) {
            queries.push(`batch_run_ids=${params.batchRunIds.join(',')}`);
        }
        if (params.startDate) {
            queries.push(`start_date=${params.startDate.toISOString()}`);
        }
        if (params.endDate) {
            queries.push(`end_date=${params.endDate.toISOString()}`);
        }
        if (params.page) {
            queries.push(`page=${params.page}`);
        }
        if (params.pageSize) {
            queries.push(`page_size=${params.pageSize}`);
        }
        if (params.sortBy) {
            queries.push(`sort_by=${params.sortBy}`);
        }
        if (params.sortDirection) {
            queries.push(`sort_direction=${params.sortDirection}`);
        }
        if (params.datetimeField) {
            queries.push(`datetime_field=${params.datetimeField}`);
        }
     
        return queries.join('&');
    }
}