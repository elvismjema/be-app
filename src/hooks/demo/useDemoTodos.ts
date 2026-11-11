'use client'

import { useState, useCallback } from 'react'
import { loadDemo, saveDemo } from './demoStore'
import type { Todo } from '@/types'

export function useDemoTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadDemo().todos)

  const sync = useCallback((next: Todo[]) => {
    setTodos(next)
    saveDemo({ todos: next })
  }, [])

  function addTodo(title: string) {
    const todo: Todo = { id: crypto.randomUUID(), couple_id: 'demo', author_id: 'me', title, completed: false, created_at: new Date().toISOString() }
    sync([todo, ...todos])
  }

  function toggleTodo(id: string, completed: boolean) {
    sync(todos.map(t => t.id === id ? { ...t, completed } : t))
  }

  function deleteTodo(id: string) {
    sync(todos.filter(t => t.id !== id))
  }

  return { todos, addTodo, toggleTodo, deleteTodo }
}
