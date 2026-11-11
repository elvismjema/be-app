'use client'

import { useState, useCallback } from 'react'
import { loadDemo, saveDemo } from './demoStore'
import type { Moment } from '@/types'

export function useDemoMoments() {
  const [moments, setMoments] = useState<Moment[]>(() => loadDemo().moments)
  const [uploading, setUploading] = useState(false)

  const sync = useCallback((next: Moment[]) => {
    setMoments(next)
    saveDemo({ moments: next })
  }, [])

  async function uploadMoment(file: File, caption: string) {
    setUploading(true)
    // Store as data URL in demo mode
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      const moment: Moment = { id: crypto.randomUUID(), couple_id: 'demo', author_id: 'me', photo_url: url, caption: caption || null, created_at: new Date().toISOString() }
      sync([moment, ...moments])
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  function deleteMoment(id: string) {
    sync(moments.filter(m => m.id !== id))
  }

  return { moments, uploading, uploadMoment, deleteMoment }
}
