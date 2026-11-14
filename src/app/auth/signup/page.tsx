'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { BeLogo } from '@/components/ui/BeLogo'

function SignupContent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [supabase] = useState(() => createClient())
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/setup'

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: { display_name: name },
        emailRedirectTo: `${window.location.origin}${next}`,
      },
    })
    if (error) setError(error.message)
    else setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060608]">
        <div className="text-center glass rounded-2xl p-10 max-w-sm mx-4 space-y-3">
          <div className="flex justify-center mb-2"><BeLogo size="md" /></div>
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="text-white/50 text-sm">We sent a sign-in link to <span className="text-white/80">{email}</span>. Tap it to open the app.</p>
          <p className="text-white/25 text-xs">No password needed — ever.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060608]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-[#060608] to-amber-950/20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="relative w-full max-w-sm mx-4">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="mb-4 animate-pulse-glow rounded-2xl">
            <BeLogo size="lg" />
          </div>
          <h1 className="text-3xl font-semibold text-gradient">be</h1>
          <p className="text-white/30 text-sm mt-1">create your space</p>
        </div>

        <form onSubmit={handleSignup} className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Your name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="Eli" />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="you@example.com" />
          </div>

          {error && <p className="text-red-400 text-xs text-center bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading || !name.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-amber-700 hover:from-blue-500 hover:to-amber-600 disabled:opacity-50 text-white font-medium rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Send me a link
          </button>
          <p className="text-center text-white/25 text-xs">No password — we'll email you a sign-in link</p>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#060608]" />}>
      <SignupContent />
    </Suspense>
  )
}
