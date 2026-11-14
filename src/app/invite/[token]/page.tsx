'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { BeLogo } from '@/components/ui/BeLogo'

export default function InvitePage() {
  const params = useParams()
  const token = params.token as string
  const [status, setStatus] = useState<'loading' | 'ready' | 'accepting' | 'done' | 'error'>('loading')
  const [inviterName, setInviterName] = useState<string>('')
  const [partnerName, setPartnerName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  useEffect(() => { checkInvite() }, [token])

  async function checkInvite() {
    const { data: invite, error: inviteError } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .single()
    if (inviteError || !invite) {
      setStatus('error')
      setError(inviteError ? `Error: ${inviteError.message}` : 'Invite not found.')
      return
    }
    if (invite.accepted) {
      setStatus('error')
      setError('This invite has already been used.')
      return
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', invite.inviter_id)
      .single()
    setInviterName(profile?.display_name || 'Someone special')
    setStatus('ready')
  }

  async function acceptInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!partnerName.trim()) return
    setStatus('accepting')

    const { data: { user }, error: signInError } = await supabase.auth.signInAnonymously({
      options: { data: { display_name: partnerName.trim() } },
    })
    if (signInError || !user) {
      setStatus('error')
      setError(signInError?.message ?? 'Sign in failed.')
      return
    }

    const { data: invite } = await supabase.from('invitations').select('*').eq('token', token).single()
    if (!invite) { setStatus('error'); setError('Invite not found.'); return }

    const { error: coupleError } = await supabase.from('couples').insert({ user1_id: invite.inviter_id, user2_id: user.id })
    if (coupleError) { setStatus('error'); setError(coupleError.message); return }

    await supabase.from('invitations').update({ accepted: true }).eq('id', invite.id)
    setStatus('done')
    setTimeout(() => { window.location.href = '/' }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060608]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-[#060608] to-amber-950/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative text-center max-w-sm mx-4 w-full">
        <div className="glass rounded-2xl p-10">
          {status === 'loading' && <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />}

          {status === 'ready' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="animate-pulse-glow rounded-2xl"><BeLogo size="lg" /></div>
              </div>
              <h1 className="text-2xl font-semibold mb-2">You&apos;re invited</h1>
              <p className="text-white/50 text-sm mb-6">
                <span className="text-white font-medium">{inviterName}</span> wants to share their space with you.
              </p>
              <form onSubmit={acceptInvite} className="space-y-3 text-left">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Your name</label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={e => setPartnerName(e.target.value)}
                    required
                    autoFocus
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <button type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-amber-700 hover:from-blue-500 hover:to-amber-600 text-white font-medium rounded-xl py-3 text-sm transition-all">
                  Open our space 💙
                </button>
              </form>
            </>
          )}

          {status === 'accepting' && (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
              <p className="text-white/60 text-sm">Setting up your space…</p>
            </>
          )}

          {status === 'done' && (
            <>
              <div className="flex justify-center mb-4"><BeLogo size="md" /></div>
              <h2 className="text-xl font-semibold mb-2">Your space is ready 💙</h2>
              <p className="text-white/50 text-sm">Taking you there now…</p>
            </>
          )}

          {status === 'error' && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  )
}
