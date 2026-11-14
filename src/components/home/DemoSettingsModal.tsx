'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Copy, Check, LogOut, User, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { saveNames } from '@/hooks/demo/demoStore'
import type { Couple } from '@/types'
import type { DemoNames } from '@/hooks/demo/demoStore'

const TIMEZONES = [
  { label: 'Eastern (ET)', value: 'America/New_York' },
  { label: 'Central (CT)', value: 'America/Chicago' },
  { label: 'Mountain (MT)', value: 'America/Denver' },
  { label: 'Pacific (PT)', value: 'America/Los_Angeles' },
  { label: 'Alaska', value: 'America/Anchorage' },
  { label: 'Hawaii', value: 'Pacific/Honolulu' },
  { label: 'London (GMT)', value: 'Europe/London' },
  { label: 'Paris / Berlin (CET)', value: 'Europe/Paris' },
  { label: 'Lagos / Accra (WAT)', value: 'Africa/Lagos' },
  { label: 'Nairobi (EAT)', value: 'Africa/Nairobi' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'India (IST)', value: 'Asia/Kolkata' },
  { label: 'Bangkok (ICT)', value: 'Asia/Bangkok' },
  { label: 'Singapore / KL (SGT)', value: 'Asia/Singapore' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST)', value: 'Australia/Sydney' },
  { label: 'Auckland (NZST)', value: 'Pacific/Auckland' },
]

interface DemoSettingsModalProps {
  couple: Couple
  names: DemoNames
  onClose: () => void
  onUpdateMeetups: (next: string | null, last: string | null) => void
  onUpdateNames: (names: DemoNames) => void
}

export function DemoSettingsModal({ couple, names, onClose, onUpdateMeetups, onUpdateNames }: DemoSettingsModalProps) {
  const [nextMeetup, setNextMeetup] = useState(couple.next_meetup || '')
  const [lastMeetup, setLastMeetup] = useState(couple.last_meetup || '')
  const [myName, setMyName] = useState(names.myName)
  const [partnerName, setPartnerName] = useState(names.partnerName)
  const [partnerTimezone, setPartnerTimezone] = useState(names.partnerTimezone || '')
  const [saved, setSaved] = useState(false)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    async function fetchInvite() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('invitations')
        .select('token')
        .eq('inviter_id', user.id)
        .eq('accepted', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      if (data) setInviteLink(`${window.location.origin}/invite/${data.token}`)
    }
    fetchInvite()
  }, [])

  function handleSave() {
    onUpdateMeetups(nextMeetup || null, lastMeetup || null)
    const updated: DemoNames = { myName: myName || names.myName, partnerName: partnerName || names.partnerName, partnerTimezone: partnerTimezone || null }
    saveNames(updated)
    onUpdateNames(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  async function copyInvite() {
    if (!inviteLink) return
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    localStorage.clear()
    window.location.href = '/auth/login'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-sm glass rounded-2xl p-6 space-y-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Settings</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/8 hover:bg-white/12 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Names */}
        <div className="border-t border-white/5 pt-4 space-y-3">
          <label className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-wider">
            <User className="w-3.5 h-3.5" /> Names
          </label>
          <div>
            <p className="text-xs text-white/30 mb-1">Your name</p>
            <input type="text" value={myName} onChange={e => setMyName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-blue-500/40 transition-all" />
          </div>
          <div>
            <p className="text-xs text-white/30 mb-1">Her name</p>
            <input type="text" value={partnerName} onChange={e => setPartnerName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-blue-500/40 transition-all" />
          </div>
        </div>

        {/* Partner timezone */}
        <div className="border-t border-white/5 pt-4 space-y-3">
          <label className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5" /> Her timezone
          </label>
          <select value={partnerTimezone} onChange={e => setPartnerTimezone(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-blue-500/40 transition-all">
            <option value="">Select her timezone</option>
            {TIMEZONES.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>

        {/* Meetup dates */}
        <div className="border-t border-white/5 pt-4 space-y-3">
          <label className="flex items-center gap-1.5 text-xs text-white/40 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" /> Meetup dates
          </label>
          <div>
            <p className="text-xs text-white/30 mb-1">Last time we met</p>
            <input type="date" value={lastMeetup} onChange={e => setLastMeetup(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-blue-500/40 transition-all" />
          </div>
          <div>
            <p className="text-xs text-white/30 mb-1">Next time we meet</p>
            <input type="date" value={nextMeetup} onChange={e => setNextMeetup(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-blue-500/40 transition-all" />
          </div>
        </div>

        <button onClick={handleSave}
          className="w-full bg-gradient-to-r from-blue-600 to-amber-700 hover:from-blue-500 hover:to-amber-600 text-white font-medium rounded-xl py-2.5 text-sm transition-all">
          {saved ? 'Saved!' : 'Save changes'}
        </button>

        {/* Invite link */}
        {inviteLink && (
          <div className="border-t border-white/5 pt-4">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Invite link</p>
            <button onClick={copyInvite}
              className="w-full flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl px-3 py-2.5 transition-colors text-left">
              {copied ? <Check className="w-3.5 h-3.5 text-green-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-white/40 shrink-0" />}
              <span className="text-xs text-white/50 truncate font-mono">{inviteLink}</span>
            </button>
          </div>
        )}

        {/* Logout */}
        <div className="border-t border-white/5 pt-3">
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-400/70 hover:text-red-400 text-sm py-2 transition-colors">
            <LogOut className="w-3.5 h-3.5" />
            Leave
          </button>
        </div>
      </div>
    </div>
  )
}
