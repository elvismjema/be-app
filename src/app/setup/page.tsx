'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Copy, Check } from 'lucide-react'
import { BeLogo } from '@/components/ui/BeLogo'

export default function SetupPage() {
  const [loading, setLoading] = useState(true)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  useEffect(() => { generateInvite() }, [])

  async function generateInvite() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/auth/login'; return }

    const { data, error } = await supabase
      .from('invitations')
      .insert({ inviter_id: user.id, email: user.email ?? `anon-${user.id}@be.local` })
      .select()
      .single()

    if (error) setError(error.message)
    else setInviteLink(`${window.location.origin}/invite/${data.token}`)
    setLoading(false)
  }

  async function copyLink() {
    if (!inviteLink) return
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060608]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-[#060608] to-amber-950/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/4 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md mx-4 text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 animate-float"><BeLogo size="lg" /></div>
          <h1 className="text-2xl font-semibold mb-2">Invite your person</h1>
          <p className="text-white/40 text-sm">Send them this link — that's all they need.</p>
        </div>

        <div className="glass rounded-2xl p-6 space-y-4">
          {loading && (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {inviteLink && (
            <>
              <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2">
                <p className="text-xs text-white/60 flex-1 truncate font-mono">{inviteLink}</p>
                <button onClick={copyLink}
                  className="shrink-0 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/60" />}
                </button>
              </div>

              <button onClick={copyLink}
                className="w-full bg-gradient-to-r from-blue-600 to-amber-700 hover:from-blue-500 hover:to-amber-600 text-white font-medium rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2">
                {copied ? <><Check className="w-4 h-4" /> Copied!</> : <>Copy invite link</>}
              </button>

              <p className="text-xs text-white/25">Once they open it and sign up, your space opens automatically.</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
