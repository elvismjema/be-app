export interface User {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  timezone: string | null
  last_seen_at: string | null
  created_at: string
}

export interface Couple {
  id: string
  user1_id: string
  user2_id: string
  next_meetup: string | null
  last_meetup: string | null
  created_at: string
  user1?: User
  user2?: User
}

export interface CalendarEvent {
  id: string
  couple_id: string
  author_id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  is_meetup: boolean
  created_at: string
  author?: User
}

export interface Todo {
  id: string
  couple_id: string
  author_id: string
  title: string
  completed: boolean
  created_at: string
  author?: User
}

export interface Note {
  id: string
  couple_id: string
  author_id: string
  content: string
  created_at: string
  updated_at: string
  author?: User
}

export interface JournalEntry {
  id: string
  couple_id: string
  author_id: string
  content: string
  mood: string | null
  created_at: string
  author?: User
}

export interface Moment {
  id: string
  couple_id: string
  author_id: string
  photo_url: string
  caption: string | null
  created_at: string
  author?: User
}

export interface Invitation {
  id: string
  inviter_id: string
  email: string
  token: string
  accepted: boolean
  created_at: string
}

export interface Message {
  id: string
  couple_id: string
  author_id: string
  content: string
  created_at: string
  author?: User
}

export interface VaultItem {
  id: string
  couple_id: string
  author_id: string
  label: string
  value: string
  category: 'address' | 'code' | 'password' | 'wifi' | 'other'
  created_at: string
}

export interface DailyVerse {
  reference: string
  text: string
}
