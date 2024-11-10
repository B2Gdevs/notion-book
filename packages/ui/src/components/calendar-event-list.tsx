'use client'

import React, { useEffect, useRef } from 'react';
import { CalendarEvent } from '../models/calendarModels';

interface EventListProps {
  events: CalendarEvent[];
  currentDate: string;
  selectedDate: string;
  onSelect: (event: CalendarEvent) => void;
}

export const CalendarEventList: React.FC<EventListProps> = ({ events, currentDate, selectedDate, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onSelect(events.find(event => event.start.date === currentDate) || events[0]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [events, currentDate, onSelect]);

  // Find the closest event to the current date
  const closestEvent = events.reduce((closest, event) => {
    const closestDate = new Date(closest.start.date);
    const eventDate = new Date(event.start.date);
    const currentDateObj = new Date(currentDate);

    if (eventDate.getTime() < currentDateObj.getTime()) {
        return closest;
    }

    return Math.abs(eventDate.getTime() - currentDateObj.getTime()) < Math.abs(closestDate.getTime() - currentDateObj.getTime()) ? event : closest;
  }, events[0]);

  return (
    <div ref={containerRef} className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-lg cursor-pointer transform transition duration-200 ease-in-out ${
              event.start.date === selectedDate ? 'bg-blue-100 scale-105' : 
              event.start.date === closestEvent.start.date ? 'bg-green-100' : 'hover:bg-blue-100'
            }`}
            onClick={() => onSelect(event)}
          >
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium mb-2">{event.summary}</h3>
              <p className="text-sm text-gray-600 mb-4">{event.description}</p>
              <div className="text-sm text-gray-500">
                <p><strong>Start:</strong> {event.start.date}</p>
                <p><strong>End:</strong> {event.end.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};