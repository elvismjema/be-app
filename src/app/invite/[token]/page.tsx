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
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  useEffect(() => { checkInvite() }, [token])

  async function checkInvite() {
    const { data: invite } = await supabase
      .from('invitations')
      .select('*, inviter:profiles!invitations_inviter_id_fkey(display_name)')
      .eq('token', token).single()
    if (!invite || invite.accepted) {
      setStatus('error')
      setError(invite?.accepted ? 'This invite has already been used.' : 'Invite not found.')
      return
    }
    setInviterName((invite.inviter as { display_name: string })?.display_name || 'Someone special')
    setStatus('ready')
  }

  async function acceptInvite() {
    setStatus('accepting')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = `/auth/signup?next=/invite/${token}`; return }
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

      <div className="relative text-center max-w-sm mx-4">
        <div className="glass rounded-2xl p-10">
          {status === 'loading' && <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />}

          {status === 'ready' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="animate-pulse-glow rounded-2xl"><BeLogo size="lg" /></div>
              </div>
              <h1 className="text-2xl font-semibold mb-2">You&apos;re invited</h1>
              <p className="text-white/50 text-sm mb-8">
                <span className="text-white font-medium">{inviterName}</span> wants to share their space with you.
              </p>
              <button onClick={acceptInvite}
                className="w-full bg-gradient-to-r from-blue-600 to-amber-700 hover:from-blue-500 hover:to-amber-600 text-white font-medium rounded-xl py-3 text-sm transition-all">
                Open our space 💙
              </button>
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
