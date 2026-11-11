'use client'

import { useState, useRef, useCallback } from 'react'
import { loadDemo, saveDemo } from './demoStore'
import type { Message } from '@/types'

const SEED: Message[] = [
  { id: '1', couple_id: 'demo', author_id: 'her', content: 'Hey babe 🥰', created_at: new Date(Date.now() - 3600000 * 3).toISOString() },
  { id: '2', couple_id: 'demo', author_id: 'me', content: 'Hey you 💙 missing you', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: '3', couple_id: 'demo', author_id: 'her', content: 'im so hungry rn lol', created_at: new Date(Date.now() - 1800000).toISOString() },
]

export function useDemoChat() {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('locket_demo_chat') : null
  const [messages, setMessages] = useState<Message[]>(() => stored ? JSON.parse(stored) : SEED)
  const bottomRef = useRef<HTMLDivElement>(null)

  const sync = useCallback((next: Message[]) => {
    setMessages(next)
    localStorage.setItem('locket_demo_chat', JSON.stringify(next))
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [])

  function sendMessage(content: string, authorId: string) {
    const msg: Message = { id: crypto.randomUUID(), couple_id: 'demo', author_id: authorId, content, created_at: new Date().toISOString() }
    sync([...messages, msg])
  }

  return { messages, sendMessage, bottomRef }
}
