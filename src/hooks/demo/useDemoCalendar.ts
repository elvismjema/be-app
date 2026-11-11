'use client'

import { useState, useCallback } from 'react'
import { loadDemo, saveDemo } from './demoStore'
import type { CalendarEvent } from '@/types'

export function useDemoCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadDemo().events)

  const sync = useCallback((next: CalendarEvent[]) => {
    setEvents(next)
    saveDemo({ events: next })
  }, [])

  function addEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'author'>) {
    const e: CalendarEvent = { ...event, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    sync([...events, e].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()))
  }

  function deleteEvent(id: string) {
    sync(events.filter(e => e.id !== id))
  }

  function updateEvent(id: string, updates: Partial<CalendarEvent>) {
    sync(events.map(e => e.id === id ? { ...e, ...updates } : e))
  }

  const nextMeetup = events.find(e => e.is_meetup && new Date(e.start_date) > new Date())

  return { events, addEvent, deleteEvent, updateEvent, nextMeetup }
}
