import type { Todo, CalendarEvent, JournalEntry, Moment, Couple } from '@/types'

const KEY = 'locket_demo'
const NAMES_KEY = 'locket_names'

interface DemoState {
  todos: Todo[]
  events: CalendarEvent[]
  journal: JournalEntry[]
  moments: Moment[]
  couple: Couple
  nextMeetup: string | null
  lastMeetup: string | null
}

export interface DemoNames {
  myName: string
  partnerName: string
  partnerTimezone?: string | null
}

export function loadNames(): DemoNames | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(NAMES_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveNames(names: DemoNames) {
  if (typeof window === 'undefined') return
  localStorage.setItem(NAMES_KEY, JSON.stringify(names))
}

const DEFAULT: DemoState = {
  todos: [
    { id: '1', couple_id: 'demo', author_id: 'me', title: 'Plan our next call 📞', completed: false, created_at: new Date().toISOString() },
    { id: '2', couple_id: 'demo', author_id: 'her', title: 'Send care package', completed: false, created_at: new Date().toISOString() },
    { id: '3', couple_id: 'demo', author_id: 'me', title: 'Book flights ✈️', completed: true, created_at: new Date().toISOString() },
  ],
  events: [
    {
      id: 'e1',
      couple_id: 'demo',
      author_id: 'me',
      title: 'Video call 💻',
      description: null,
      start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: null,
      is_meetup: false,
      created_at: new Date().toISOString(),
    },
    {
      id: 'e2',
      couple_id: 'demo',
      author_id: 'her',
      title: 'We finally meet!! 🥰',
      description: null,
      start_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: null,
      is_meetup: true,
      created_at: new Date().toISOString(),
    },
  ],
  journal: [
    {
      id: 'j1',
      couple_id: 'demo',
      author_id: 'me',
      content: 'Missing you today but feeling grateful we have each other.',
      mood: '🥰',
      created_at: new Date().toISOString(),
    },
    {
      id: 'j2',
      couple_id: 'demo',
      author_id: 'her',
      content: 'Counting down the days. Can\'t wait to see you.',
      mood: '❤️',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  moments: [],
  couple: {
    id: 'demo',
    user1_id: 'me',
    user2_id: 'her',
    next_meetup: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    last_meetup: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  nextMeetup: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  lastMeetup: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
}

export function loadDemo(): DemoState {
  if (typeof window === 'undefined') return DEFAULT
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT
    return { ...DEFAULT, ...JSON.parse(raw) }
  } catch {
    return DEFAULT
  }
}

export function saveDemo(state: Partial<DemoState>) {
  if (typeof window === 'undefined') return
  const current = loadDemo()
  localStorage.setItem(KEY, JSON.stringify({ ...current, ...state }))
}
