// src/hooks/calendarHooks.ts
'use client';

import { useQuery } from 'react-query';
import { CalendarClient } from '../clients/calendarClient';

const CALENDAR_EVENTS_CACHE_KEY = 'calendarEvents';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useGetCalendarEvents = () => {
    const token = useSessionToken();
    return useQuery(
        [CALENDAR_EVENTS_CACHE_KEY],
        async () => {
            return CalendarClient.getCalendarEvents(token);
        },
        {
            enabled: !!token,
        },
    );
};