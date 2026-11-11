'use client'

import { useState, useCallback } from 'react'
import type { VaultItem } from '@/types'

const SEED: VaultItem[] = [
  { id: '1', couple_id: 'demo', author_id: 'me', label: 'Home address', value: '123 Love St, Cape Town', category: 'address', created_at: new Date().toISOString() },
  { id: '2', couple_id: 'demo', author_id: 'her', label: 'Gate code', value: '#4521', category: 'code', created_at: new Date().toISOString() },
  { id: '3', couple_id: 'demo', author_id: 'her', label: 'Home WiFi', value: 'password123', category: 'wifi', created_at: new Date().toISOString() },
]

export function useDemoVault() {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('locket_demo_vault') : null
  const [items, setItems] = useState<VaultItem[]>(() => stored ? JSON.parse(stored) : SEED)

  const sync = useCallback((next: VaultItem[]) => {
    setItems(next)
    localStorage.setItem('locket_demo_vault', JSON.stringify(next))
  }, [])

  function addItem(label: string, value: string, category: VaultItem['category']) {
    const item: VaultItem = { id: crypto.randomUUID(), couple_id: 'demo', author_id: 'me', label, value, category, created_at: new Date().toISOString() }
    sync([item, ...items])
  }

  function deleteItem(id: string) {
    sync(items.filter(i => i.id !== id))
  }

  return { items, addItem, deleteItem }
}
