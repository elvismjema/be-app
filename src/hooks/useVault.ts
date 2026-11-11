'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { VaultItem } from '@/types'

export function useVault(coupleId: string | undefined) {
  const [items, setItems] = useState<VaultItem[]>([])
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    if (!coupleId) return
    fetchItems()

    const channel = supabase
      .channel('vault-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vault_items', filter: `couple_id=eq.${coupleId}` }, fetchItems)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId])

  async function fetchItems() {
    if (!coupleId) return
    const { data } = await supabase
      .from('vault_items')
      .select('*')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false })
    if (data) setItems(data as VaultItem[])
  }

  async function addItem(label: string, value: string, category: VaultItem['category'], authorId: string) {
    await supabase.from('vault_items').insert({ couple_id: coupleId, author_id: authorId, label, value, category })
  }

  async function deleteItem(id: string) {
    await supabase.from('vault_items').delete().eq('id', id)
  }

  return { items, addItem, deleteItem }
}
