'use client'

import { useState } from 'react'
import { Lock, Plus, Eye, EyeOff, Trash2, X, MapPin, KeyRound, Wifi, Shield } from 'lucide-react'
import type { VaultItem } from '@/types'
import { cn } from '@/lib/utils'

const CATEGORIES: { value: VaultItem['category']; label: string; icon: React.ReactNode }[] = [
  { value: 'address', label: 'Address', icon: <MapPin className="w-3 h-3" /> },
  { value: 'code', label: 'Code', icon: <KeyRound className="w-3 h-3" /> },
  { value: 'wifi', label: 'WiFi', icon: <Wifi className="w-3 h-3" /> },
  { value: 'password', label: 'Password', icon: <Shield className="w-3 h-3" /> },
  { value: 'other', label: 'Other', icon: <Lock className="w-3 h-3" /> },
]

const CAT_COLORS: Record<string, string> = {
  address: 'text-blue-400 bg-blue-500/10',
  code: 'text-[#c9a87c] bg-[#c9a87c]/10',
  wifi: 'text-teal-400 bg-teal-500/10',
  password: 'text-purple-400 bg-purple-500/10',
  other: 'text-white/40 bg-white/5',
}

interface VaultWidgetProps {
  items: VaultItem[]
  onAdd: (label: string, value: string, category: VaultItem['category']) => void
  onDelete: (id: string) => void
}

export function VaultWidget({ items, onAdd, onDelete }: VaultWidgetProps) {
  const [adding, setAdding] = useState(false)
  const [revealed, setRevealed] = useState<string | null>(null)
  const [form, setForm] = useState({ label: '', value: '', category: 'other' as VaultItem['category'] })

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!form.label || !form.value) return
    onAdd(form.label, form.value, form.category)
    setForm({ label: '', value: '', category: 'other' })
    setAdding(false)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Lock className="w-3.5 h-3.5 text-[#c9a87c]" />
        <span className="text-xs text-white/40 uppercase tracking-wider">Vault</span>
        <span className="text-xs text-white/20 ml-auto">shared secrets</span>
        <button onClick={() => setAdding(!adding)}
          className="w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors">
          {adding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="glass rounded-xl p-3 mb-3 space-y-2">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c.value} type="button"
                onClick={() => setForm(f => ({ ...f, category: c.value }))}
                className={cn('flex items-center gap-1 text-xs rounded-lg px-2 py-1 transition-colors',
                  form.category === c.value ? 'bg-blue-600/40 text-blue-200' : 'bg-white/5 text-white/40 hover:bg-white/8')}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
            placeholder="Label (e.g. Gate code)" required
            className="w-full bg-transparent text-xs text-white/80 placeholder-white/30 outline-none border-b border-white/10 pb-1" />
          <input value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
            placeholder="Value" required
            className="w-full bg-transparent text-xs text-white/80 placeholder-white/30 outline-none border-b border-white/10 pb-1" />
          <button type="submit"
            className="w-full text-xs bg-[#c9a87c]/20 hover:bg-[#c9a87c]/30 text-[#c9a87c] rounded-lg py-1.5 transition-colors">
            Save to vault
          </button>
        </form>
      )}

      <div className="space-y-1.5 max-h-44 overflow-y-auto scrollbar-hide">
        {items.length === 0 && (
          <p className="text-xs text-white/20 text-center py-4">Nothing saved yet</p>
        )}
        {items.map(item => {
          const cat = CATEGORIES.find(c => c.value === item.category)
          const isRevealed = revealed === item.id
          return (
            <div key={item.id} className="flex items-center gap-2 group glass rounded-xl px-3 py-2">
              <span className={cn('flex items-center gap-1 text-xs rounded-md px-1.5 py-0.5 shrink-0', CAT_COLORS[item.category])}>
                {cat?.icon}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/70 truncate">{item.label}</p>
                <p className="text-xs text-white/40 truncate font-mono">
                  {isRevealed ? item.value : '••••••••'}
                </p>
              </div>
              <button onClick={() => setRevealed(isRevealed ? null : item.id)}
                className="text-white/20 hover:text-white/60 transition-colors">
                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => onDelete(item.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
