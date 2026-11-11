'use client'

import { useRef, useState } from 'react'
import { Plus, X, Loader2, ImageIcon } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import type { Moment } from '@/types'
import Image from 'next/image'

interface MomentsWidgetProps {
  moments: Moment[]
  currentUserId: string
  onUpload: (file: File, caption: string) => void
  onDelete: (id: string, photoUrl: string) => void
  uploading: boolean
}

export function MomentsWidget({ moments, currentUserId, onUpload, onDelete, uploading }: MomentsWidgetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [caption, setCaption] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [selected, setSelected] = useState<Moment | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPendingFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleUpload() {
    if (!pendingFile) return
    onUpload(pendingFile, caption)
    setPendingFile(null)
    setPreview(null)
    setCaption('')
  }

  function cancelUpload() {
    setPendingFile(null)
    setPreview(null)
    setCaption('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
          <span className="text-xs text-white/40 uppercase tracking-wider">Moments</span>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-6 h-6 rounded-lg bg-white/8 hover:bg-white/12 flex items-center justify-center transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-white/50" />
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* Upload preview */}
      {preview && (
        <div className="glass rounded-xl p-3 mb-3 space-y-2">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-white/5">
            <Image src={preview} alt="Preview" fill className="object-cover" />
          </div>
          <input
            type="text"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Add a caption…"
            className="w-full bg-transparent text-xs text-white/70 placeholder-white/30 outline-none border-b border-white/10 pb-1"
          />
          <div className="flex gap-2">
            <button onClick={handleUpload} disabled={uploading}
              className="flex-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg py-1.5 transition-colors flex items-center justify-center gap-1">
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
              Share
            </button>
            <button onClick={cancelUpload} className="text-xs text-white/30 hover:text-white/50 px-2 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Moments grid */}
      {moments.length === 0 && !preview ? (
        <div className="text-center py-8 text-white/20 text-xs">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
          Share your first moment
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {moments.slice(0, 9).map(moment => (
            <button
              key={moment.id}
              onClick={() => setSelected(moment)}
              className="relative aspect-square rounded-lg overflow-hidden bg-white/5 group"
            >
              <Image src={moment.photo_url} alt={moment.caption || ''} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {/* Selected moment modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="relative max-w-lg w-full glass rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
              <X className="w-4 h-4 text-white/80" />
            </button>
            <div className="relative w-full aspect-square">
              <Image src={selected.photo_url} alt={selected.caption || ''} fill className="object-cover" />
            </div>
            <div className="p-4">
              {selected.caption && <p className="text-sm text-white/80 mb-1">{selected.caption}</p>}
              <p className="text-xs text-white/30">{timeAgo(selected.created_at)}</p>
              {selected.author_id === currentUserId && (
                <button
                  onClick={() => { onDelete(selected.id, selected.photo_url); setSelected(null) }}
                  className="mt-3 text-xs text-red-400/60 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
