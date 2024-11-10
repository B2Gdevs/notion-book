// src/models/calendarModels.ts

export interface CalendarEvent {
    id?: string;
    summary?: string;
    description?: string;
    start: { date: string };
    end: { date: string };
    visibility?: string;
}