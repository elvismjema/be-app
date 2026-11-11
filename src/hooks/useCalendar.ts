'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { CalendarEvent } from '@/types'

export function useCalendar(coupleId: string | undefined) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    if (!coupleId) return
    fetchEvents()

    const channel = supabase
      .channel('calendar-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events', filter: `couple_id=eq.${coupleId}` }, fetchEvents)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId])

  async function fetchEvents() {
    if (!coupleId) return
    const { data } = await supabase
      .from('calendar_events')
      .select('*, author:profiles!calendar_events_author_id_fkey(*)')
      .eq('couple_id', coupleId)
      .order('start_date', { ascending: true })
    if (data) setEvents(data)
  }

  async function addEvent(event: Omit<CalendarEvent, 'id' | 'created_at' | 'author'>) {
    await supabase.from('calendar_events').insert(event)
  }

  async function deleteEvent(id: string) {
    await supabase.from('calendar_events').delete().eq('id', id)
  }

  async function updateEvent(id: string, updates: Partial<CalendarEvent>) {
    await supabase.from('calendar_events').update(updates).eq('id', id)
  }

  const nextMeetup = events.find(e => e.is_meetup && new Date(e.start_date) > new Date())

  return { events, addEvent, deleteEvent, updateEvent, nextMeetup }
}
