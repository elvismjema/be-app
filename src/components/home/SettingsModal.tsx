'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Calendar, User, Loader2 } from 'lucide-react'
import type { Couple, User as UserType } from '@/types'

interface SettingsModalProps {
  couple: Couple | null
  user: UserType
  onClose: () => void
  onUpdateMeetups: (next: string | null, last: string | null) => void
}

export function SettingsModal({ couple, user, onClose, onUpdateMeetups }: SettingsModalProps) {
  const [nextMeetup, setNextMeetup] = useState(couple?.next_meetup || '')
  const [lastMeetup, setLastMeetup] = useState(couple?.last_meetup || '')
  const [displayName, setDisplayName] = useState(user.display_name || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [supabase] = useState(() => createClient())

  async function handleSave() {
    setSaving(true)
    await Promise.all([
      onUpdateMeetups(nextMeetup || null, lastMeetup || null),
      supabase.from('profiles').update({ display_name: displayName }).eq('id', user.id),
    ])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-sm glass rounded-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-medium">Settings</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/12 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Display name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5" /> Your name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/40 transition-all"
              placeholder="Your name"
            />
          </div>

          <div className="border-t border-white/5 pt-4">
            <label className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" /> Meetup dates
            </label>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/30 mb-1">Last time we met</p>
                <input
                  type="date"
                  value={lastMeetup}
                  onChange={e => setLastMeetup(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-blue-500/40 transition-all"
                />
              </div>
              <div>
                <p className="text-xs text-white/30 mb-1">Next time we meet</p>
                <input
                  type="date"
                  value={nextMeetup}
                  onChange={e => setNextMeetup(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-blue-500/40 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-amber-700 hover:from-blue-500 hover:to-amber-600 disabled:opacity-50 text-white font-medium rounded-xl py-2.5 text-sm transition-all flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
