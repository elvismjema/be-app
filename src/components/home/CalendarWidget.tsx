'use client'

import { useState } from 'react'
import { CalendarDays, Plus, X, Star } from 'lucide-react'
import type { CalendarEvent } from '@/types'
import { formatDate } from '@/lib/utils'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, parseISO } from 'date-fns'

interface CalendarWidgetProps {
  events: CalendarEvent[]
  currentUserId: string
  coupleId: string
  onAdd: (event: Omit<CalendarEvent, 'id' | 'created_at' | 'author'>) => void
  onDelete: (id: string) => void
}

export function CalendarWidget({ events, currentUserId, coupleId, onAdd, onDelete }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', start_date: '', is_meetup: false })

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) })
  const startPad = startOfMonth(currentMonth).getDay()

  function getEventsForDay(day: Date) {
    return events.filter(e => isSameDay(parseISO(e.start_date), day))
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.start_date) return
    onAdd({ couple_id: coupleId, author_id: currentUserId, title: form.title, start_date: form.start_date, end_date: null, description: null, is_meetup: form.is_meetup })
    setForm({ title: '', start_date: '', is_meetup: false })
    setAdding(false)
  }

  const upcoming = events
    .filter(e => new Date(e.start_date) >= new Date())
    .slice(0, 3)

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-3.5 h-3.5 text-green-400" />
        <span className="text-xs text-white/40 uppercase tracking-wider">Calendar</span>
        <button
          onClick={() => setAdding(!adding)}
          className="ml-auto w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
        >
          {adding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Month header */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1))} className="text-white/30 hover:text-white/60 text-xs px-1">‹</button>
        <span className="text-xs text-white/60">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={() => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1))} className="text-white/30 hover:text-white/60 text-xs px-1">›</button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-center text-xs text-white/20 py-0.5">{d}</div>
        ))}
        {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => {
          const dayEvents = getEventsForDay(day)
          const hasMeetup = dayEvents.some(e => e.is_meetup)
          return (
            <div
              key={day.toISOString()}
              className={`relative text-center text-xs py-1 rounded-lg transition-colors ${
                isToday(day) ? 'bg-blue-500/30 text-blue-200' :
                !isSameMonth(day, currentMonth) ? 'text-white/15' :
                'text-white/60 hover:bg-white/5'
              }`}
            >
              {format(day, 'd')}
              {dayEvents.length > 0 && (
                <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${hasMeetup ? 'bg-blue-400' : 'bg-blue-400'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Add event form */}
      {adding && (
        <form onSubmit={handleAdd} className="glass rounded-xl p-3 mb-3 space-y-2">
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Event name"
            className="w-full bg-transparent text-xs text-white/80 placeholder-white/30 outline-none border-b border-white/10 pb-1"
          />
          <input
            type="datetime-local"
            value={form.start_date}
            onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
            className="w-full bg-transparent text-xs text-white/60 outline-none"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_meetup}
              onChange={e => setForm(f => ({ ...f, is_meetup: e.target.checked }))}
              className="accent-blue-500"
            />
            <span className="text-xs text-white/50 flex items-center gap-1"><Star className="w-3 h-3" /> This is a meetup</span>
          </label>
          <button type="submit" className="w-full text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg py-1.5 transition-colors">
            Add event
          </button>
        </form>
      )}

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <div className="space-y-1.5">
          {upcoming.map(event => (
            <div key={event.id} className="flex items-center gap-2 group">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${event.is_meetup ? 'bg-blue-400' : 'bg-blue-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/70 truncate">{event.title}</p>
                <p className="text-xs text-white/30">{formatDate(event.start_date)}</p>
              </div>
              <button
                onClick={() => onDelete(event.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3 text-white/20 hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
