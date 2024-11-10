export enum SchedulerType {
  INVOICE = 'invoice',
  PAYMENT = 'payment',
  REPORT = 'report',
  REBATCH = 'rebatch',
  BEGIN_LIFECYCLE = 'begin_lifecycle',
  REMINDER_NOTIFICATION = 'reminder_notification',
}


export enum SchedulerStatus {
    SCHEDULED = "SCHEDULED",
    NOT_SCHEDULED = "NOT_SCHEDULED",
    PAUSED = "PAUSED",
  }
  
  export interface HttpTarget {
    uri: string;
    http_method: string;
    body?: string;
  }
  
  export interface SchedulerCreateRequest {
    name: string;
    http_target: HttpTarget;
    schedule: string;
    time_zone: string;
    store_id?: string;
    area_id?: string;
    order_id?: string;
    org_id?: string;
    target_endpoint?: string;
    payload?: Record<string, any>;
  }
  
  export interface SchedulerUpdateRequest {
    http_target: HttpTarget;
    schedule: string;
    time_zone: string;
    payload: Record<string, any>;
    store_id?: string;
    area_id?: string;
    order_id?: string;
    org_id?: string;
    target_endpoint?: string;

  }
  
  export interface Scheduler {
    id?: string;
    time_zone?: string;
    cron_schedule?: string;
    job_name?: string;
    job_status?: string;
    http_target?: HttpTarget;
    store_id?: string;
    area_id?: string;
    order_id?: string;
    org_id?: string;
    target_endpoint?: string;
    payload?: Record<string, any>;
    type?: SchedulerType;
  }