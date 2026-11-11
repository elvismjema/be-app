'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Moment } from '@/types'

export function useMoments(coupleId: string | undefined) {
  const [moments, setMoments] = useState<Moment[]>([])
  const [uploading, setUploading] = useState(false)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    if (!coupleId) return
    fetchMoments()

    const channel = supabase
      .channel('moments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'moments', filter: `couple_id=eq.${coupleId}` }, fetchMoments)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId])

  async function fetchMoments() {
    if (!coupleId) return
    const { data } = await supabase
      .from('moments')
      .select('*, author:profiles!moments_author_id_fkey(*)')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false })
    if (data) setMoments(data)
  }

  async function uploadMoment(file: File, caption: string, authorId: string) {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${authorId}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from('moments').upload(path, file)
    if (uploadError) { setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('moments').getPublicUrl(path)
    await supabase.from('moments').insert({ couple_id: coupleId, author_id: authorId, photo_url: publicUrl, caption })
    setUploading(false)
  }

  async function deleteMoment(id: string, photoUrl: string) {
    const path = photoUrl.split('/moments/')[1]
    await supabase.storage.from('moments').remove([path])
    await supabase.from('moments').delete().eq('id', id)
  }

  return { moments, uploading, uploadMoment, deleteMoment }
}
