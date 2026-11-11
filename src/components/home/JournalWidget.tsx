'use client'

import { useState } from 'react'
import { Feather, ChevronDown, ChevronUp } from 'lucide-react'
import type { JournalEntry } from '@/types'
import { timeAgo } from '@/lib/utils'

const MOODS = ['🥰', '😊', '😌', '🤔', '😔', '❤️', '✨']

interface JournalWidgetProps {
  entries: JournalEntry[]
  currentUserId: string
  partnerName: string | null
  onAdd: (content: string, mood: string | null) => void
}

export function JournalWidget({ entries, currentUserId, partnerName, onAdd }: JournalWidgetProps) {
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [composing, setComposing] = useState(false)

  function handleAdd() {
    if (!content.trim()) return
    onAdd(content.trim(), mood)
    setContent('')
    setMood(null)
    setComposing(false)
  }

  const myEntries = entries.filter(e => e.author_id === currentUserId)
  const theirEntries = entries.filter(e => e.author_id !== currentUserId)

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Feather className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs text-white/40 uppercase tracking-wider">How we feel</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-auto w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {!composing ? (
        <button
          onClick={() => setComposing(true)}
          className="w-full text-left bg-white/5 border border-white/8 rounded-xl px-3 py-2.5 text-xs text-white/30 hover:text-white/50 hover:bg-white/8 transition-all mb-3"
        >
          How are you feeling today?
        </button>
      ) : (
        <div className="glass rounded-xl p-3 mb-3 space-y-2">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write how you're feeling…"
            rows={3}
            className="w-full bg-transparent text-xs text-white/80 placeholder-white/30 outline-none resize-none"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {MOODS.map(m => (
                <button
                  key={m}
                  onClick={() => setMood(mood === m ? null : m)}
                  className={`text-sm transition-transform ${mood === m ? 'scale-125' : 'opacity-50 hover:opacity-100'}`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button onClick={() => setComposing(false)} className="text-xs text-white/30 hover:text-white/50">Cancel</button>
              <button onClick={handleAdd} className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
          {entries.length === 0 && (
            <p className="text-xs text-white/20 text-center py-4">No entries yet</p>
          )}
          {entries.map(entry => (
            <div key={entry.id} className="glass rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium text-white/60">
                  {entry.author_id === currentUserId ? 'You' : partnerName || 'Them'}
                </span>
                {entry.mood && <span className="text-sm">{entry.mood}</span>}
                <span className="ml-auto text-xs text-white/20">{timeAgo(entry.created_at)}</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">{entry.content}</p>
            </div>
          ))}
        </div>
      )}

      {!expanded && (
        <div className="flex gap-2">
          {myEntries[0] && (
            <div className="flex-1 glass rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs text-white/40">You</span>
                {myEntries[0].mood && <span className="text-xs">{myEntries[0].mood}</span>}
              </div>
              <p className="text-xs text-white/60 line-clamp-2">{myEntries[0].content}</p>
            </div>
          )}
          {theirEntries[0] && (
            <div className="flex-1 glass rounded-xl p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs text-white/40">{partnerName || 'Them'}</span>
                {theirEntries[0].mood && <span className="text-xs">{theirEntries[0].mood}</span>}
              </div>
              <p className="text-xs text-white/60 line-clamp-2">{theirEntries[0].content}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
