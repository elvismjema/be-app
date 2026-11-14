'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BeLogo } from '@/components/ui/BeLogo'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInAnonymously({
      options: { data: { display_name: name.trim() } },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/setup'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#060608]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-[#060608] to-amber-950/20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-amber-900/5 blur-3xl" />

      <div className="relative w-full max-w-sm mx-4">
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="mb-4 animate-pulse-glow rounded-2xl">
            <BeLogo size="lg" />
          </div>
          <h1 className="text-3xl font-semibold text-gradient">be</h1>
          <p className="text-white/30 text-sm mt-1">just the two of you</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider">Your name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="Eli"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-amber-700 hover:from-blue-500 hover:to-amber-600 disabled:opacity-50 text-white font-medium rounded-xl py-3 text-sm transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
