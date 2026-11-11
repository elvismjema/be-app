'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { JournalEntry } from '@/types'

export function useJournal(coupleId: string | undefined) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    if (!coupleId) return
    fetchEntries()

    const channel = supabase
      .channel('journal-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries', filter: `couple_id=eq.${coupleId}` }, fetchEntries)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId])

  async function fetchEntries() {
    if (!coupleId) return
    const { data } = await supabase
      .from('journal_entries')
      .select('*, author:profiles!journal_entries_author_id_fkey(*)')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setEntries(data)
  }

  async function addEntry(content: string, mood: string | null, authorId: string) {
    await supabase.from('journal_entries').insert({ couple_id: coupleId, author_id: authorId, content, mood })
  }

  return { entries, addEntry }
}
