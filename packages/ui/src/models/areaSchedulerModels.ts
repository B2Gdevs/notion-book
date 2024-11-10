export interface AreaLifecycleRequest {
    basic_batching: boolean;
    area_id: string;
    endpoint_suffix?: string;
    cron_schedule?: string;
    is_rebatch?: boolean;
    date?: string;
    use_date?: boolean;
}