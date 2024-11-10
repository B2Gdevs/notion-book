// src/clients/calendarClient.ts
import { CalendarEvent } from '../models/calendarModels';
import { BaseClient } from './baseClient';

/**
 * Client for interacting with the calendar API.
 */
export class CalendarClient extends BaseClient {
    /**
     * Fetches a list of calendar events.
     * @param token - The authentication token.
     * @returns A list of calendar events.
     */
    public static async getCalendarEvents(token: string | null): Promise<CalendarEvent[]> {
        const endpoint = `/calendar_events`;
        return this.fetchData(endpoint, token, null);
    }
}