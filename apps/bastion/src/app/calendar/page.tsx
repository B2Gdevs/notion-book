'use client'

import React, { useState, useEffect } from 'react';
import { Button, CalendarEvent, CalendarEventList, CodeBlock, getHolidayOfDate, useGetCalendarEvents } from 'ui';

const CalendarPage: React.FC = () => {
  const { data: events, isLoading: eventsLoading, isError: eventsError } = useGetCalendarEvents();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
  const [sortedEvents, setSortedEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (events) {
      const sorted = [...events].sort((a, b) =>
        Math.abs(new Date(a.start.date).getTime() - new Date().getTime()) -
        Math.abs(new Date(b.start.date).getTime() - new Date().getTime())
      );
      setSortedEvents(sorted);
      // Set the closest event date only initially or when no event has been selected yet
      if (sorted.length && selectedDate === new Date().toISOString().slice(0, 10)) {
        setSelectedDate(sorted[0].start.date);
      }
    }
  }, [events]);

  // Determine if the selected date is a holiday
  const holidayCalendarEvent = getHolidayOfDate(selectedDate, sortedEvents);

  if (eventsLoading) return <div>Loading...</div>;
  if (eventsError || !sortedEvents.length) return <div>Error loading events.</div>;

  return (
    <div>
      <a href="https://www.googleapis.com/calendar/v3/calendars/en.usa%23holiday%40group.v.calendar.google.com/events">https://www.googleapis.com/calendar/v3/calendars/en.usa%23holiday%40group.v.calendar.google.com/events</a>
      <div className='border-2 p-2 border-black rounded-lg'>
        <h1>Status: <CodeBlock>{holidayCalendarEvent ? 'Closed' : 'Open'}</CodeBlock></h1>
        <div>Date to Check Colorfull Operation Status: <CodeBlock>{selectedDate}</CodeBlock></div>
      <Button onClick={() => { setSelectedDate(new Date().toISOString().slice(0, 10)) }}>Reset</Button>
      </div>
      <div className='border-2 rounded-lg border-black p-2'>
        <CalendarEventList
          events={sortedEvents}
          currentDate={new Date().toISOString().slice(0, 10)}
          selectedDate={selectedDate}
          onSelect={(event) => setSelectedDate(event ? event.start.date : new Date().toISOString().slice(0, 10))}
        />
      </div>
    </div>
  );
};

export default CalendarPage;