'use client'

import { useState } from 'react'
import { X, Calendar } from 'lucide-react'
import type { Couple } from '@/types'

interface DemoSettingsModalProps {
  couple: Couple
  onClose: () => void
  onUpdateMeetups: (next: string | null, last: string | null) => void
}

export function DemoSettingsModal({ couple, onClose, onUpdateMeetups }: DemoSettingsModalProps) {
  const [nextMeetup, setNextMeetup] = useState(couple.next_meetup || '')
  const [lastMeetup, setLastMeetup] = useState(couple.last_meetup || '')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    onUpdateMeetups(nextMeetup || null, lastMeetup || null)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
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

        <button
          onClick={handleSave}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-amber-700 hover:from-blue-500 hover:to-amber-600 text-white font-medium rounded-xl py-2.5 text-sm transition-all"
        >
          {saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
