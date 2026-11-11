'use client'

import { useState, useRef } from 'react'
import { Camera, X, Send, Loader2 } from 'lucide-react'

interface QuickSnapProps {
  onSnap: (file: File, caption: string) => void
  uploading: boolean
}

export function QuickSnap({ onSnap, uploading }: QuickSnapProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  function handleSend() {
    if (!file) return
    onSnap(file, caption || '📸')
    setPreview(null)
    setFile(null)
    setCaption('')
  }

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="snap preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button onClick={() => { setPreview(null); setFile(null) }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-white" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-2 flex gap-2">
          <input value={caption} onChange={e => setCaption(e.target.value)}
            placeholder="Say something…"
            className="flex-1 bg-black/30 text-xs text-white placeholder-white/40 outline-none rounded-lg px-2 py-1.5 backdrop-blur-sm border border-white/10" />
          <button onClick={handleSend} disabled={uploading}
            className="w-8 h-8 rounded-lg bg-blue-600/80 hover:bg-blue-500 flex items-center justify-center transition-colors disabled:opacity-50">
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" /> : <Send className="w-3.5 h-3.5 text-white" />}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" capture="environment"
        className="hidden" onChange={handleCapture} />
      <button onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 glass rounded-xl py-3 text-sm text-white/50 hover:text-white/80 hover:bg-white/8 transition-all border border-dashed border-white/10 hover:border-blue-500/30">
        <Camera className="w-4 h-4 text-blue-400" />
        <span className="text-xs">Quick snap</span>
      </button>
    </>
  )
}
