'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Couple, User } from '@/types'

export function useCouple(userId: string | undefined) {
  const [couple, setCouple] = useState<Couple | null>(null)
  const [partner, setPartner] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    if (!userId) return
    fetchCouple()

    const channel = supabase
      .channel('couple-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'couples' }, fetchCouple)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  async function fetchCouple() {
    if (!userId) return
    setLoading(true)

    const { data } = await supabase
      .from('couples')
      .select('*')
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .single()

    if (data) {
      setCouple(data)
      const partnerId = data.user1_id === userId ? data.user2_id : data.user1_id
      const { data: partnerData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', partnerId)
        .single()
      if (partnerData) setPartner({ ...partnerData, email: '' })
    }
    setLoading(false)
  }

  async function updateMeetupDates(next_meetup: string | null, last_meetup: string | null) {
    if (!couple) return
    await supabase.from('couples').update({ next_meetup, last_meetup }).eq('id', couple.id)
  }

  return { couple, partner, loading, updateMeetupDates, refetch: fetchCouple }
}
