'use client'

import { useState, useCallback } from 'react'
import { loadDemo, saveDemo } from './demoStore'
import type { JournalEntry } from '@/types'

export function useDemoJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => loadDemo().journal)

  const sync = useCallback((next: JournalEntry[]) => {
    setEntries(next)
    saveDemo({ journal: next })
  }, [])

  function addEntry(content: string, mood: string | null) {
    const entry: JournalEntry = { id: crypto.randomUUID(), couple_id: 'demo', author_id: 'me', content, mood, created_at: new Date().toISOString() }
    sync([entry, ...entries])
  }

  return { entries, addEntry }
}
