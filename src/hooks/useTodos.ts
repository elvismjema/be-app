'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Todo } from '@/types'

export function useTodos(coupleId: string | undefined) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    if (!coupleId) return
    fetchTodos()

    const channel = supabase
      .channel('todos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos', filter: `couple_id=eq.${coupleId}` }, fetchTodos)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [coupleId])

  async function fetchTodos() {
    if (!coupleId) return
    const { data } = await supabase
      .from('todos')
      .select('*, author:profiles!todos_author_id_fkey(*)')
      .eq('couple_id', coupleId)
      .order('created_at', { ascending: false })
    if (data) setTodos(data)
  }

  async function addTodo(title: string, authorId: string) {
    await supabase.from('todos').insert({ couple_id: coupleId, author_id: authorId, title })
  }

  async function toggleTodo(id: string, completed: boolean) {
    await supabase.from('todos').update({ completed }).eq('id', id)
  }

  async function deleteTodo(id: string) {
    await supabase.from('todos').delete().eq('id', id)
  }

  return { todos, addTodo, toggleTodo, deleteTodo }
}
