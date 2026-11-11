'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'

export function useChat(coupleId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [supabase] = useState(() => createClient())
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!coupleId) return
    fetchMessages()

    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `couple_id=eq.${coupleId}` }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId])

  async function fetchMessages() {
    if (!coupleId) return
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: true })
      .limit(100)
    if (data) setMessages(data)
  }

  async function sendMessage(content: string, authorId: string) {
    await supabase.from('messages').insert({ couple_id: coupleId, author_id: authorId, content })
  }

  return { messages, sendMessage, bottomRef }
}
