'use client'

import { useState, useRef } from 'react'
import { MessageCircle, Send, ShoppingBag } from 'lucide-react'
import type { Message } from '@/types'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const FOOD_WORDS = /\b(hungry|starving|eat|food|order|pizza|burger|snack|dinner|lunch|breakfast|fasting|famished)\b/i

interface ChatWidgetProps {
  messages: Message[]
  currentUserId: string
  partnerName: string | null
  onSend: (content: string) => void
  bottomRef: React.RefObject<HTMLDivElement | null>
}

export function ChatWidget({ messages, currentUserId, partnerName, onSend, bottomRef }: ChatWidgetProps) {
  const [input, setInput] = useState('')

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input.trim())
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as unknown as React.FormEvent) }
  }

  const lastFoodMsg = [...messages].reverse().find(m => FOOD_WORDS.test(m.content))

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs text-white/40 uppercase tracking-wider">Chat</span>
      </div>

      {/* Food order nudge */}
      {lastFoodMsg && (
        <div className="glass-warm rounded-xl px-3 py-2 mb-2 flex items-center gap-2 shrink-0">
          <ShoppingBag className="w-3.5 h-3.5 text-[#c9a87c] shrink-0" />
          <span className="text-xs text-white/60 flex-1">Someone&apos;s hungry 👀</span>
          <div className="flex gap-1.5">
            <a href="https://www.ubereats.com" target="_blank" rel="noopener noreferrer"
              className="text-xs bg-[#06c167]/20 text-[#06c167] rounded-lg px-2 py-1 hover:bg-[#06c167]/30 transition-colors">Uber Eats</a>
            <a href="https://www.doordash.com" target="_blank" rel="noopener noreferrer"
              className="text-xs bg-[#ff3008]/20 text-[#ff3008] rounded-lg px-2 py-1 hover:bg-[#ff3008]/30 transition-colors">DoorDash</a>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 min-h-0 max-h-52">
        {messages.length === 0 && (
          <p className="text-center text-white/20 text-xs py-8">Say something 💙</p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.author_id === currentUserId
          const prevMsg = messages[i - 1]
          const showTime = !prevMsg || new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() > 300000
          return (
            <div key={msg.id}>
              {showTime && (
                <p className="text-center text-white/20 text-xs py-1">
                  {format(new Date(msg.created_at), 'h:mm a')}
                </p>
              )}
              <div className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                  isMe
                    ? 'bg-blue-600/70 text-white rounded-br-sm'
                    : 'bg-white/10 text-white/85 rounded-bl-sm'
                )}>
                  {msg.content}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 mt-2 shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${partnerName || 'her'}…`}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500/40 transition-all"
        />
        <button type="submit" disabled={!input.trim()}
          className="w-8 h-8 rounded-xl bg-blue-600/70 hover:bg-blue-500/80 disabled:opacity-30 flex items-center justify-center transition-colors">
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </form>
    </div>
  )
}
