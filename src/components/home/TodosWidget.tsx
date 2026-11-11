'use client'

import { useState } from 'react'
import { Plus, Trash2, CheckSquare2 } from 'lucide-react'
import type { Todo } from '@/types'
import { cn } from '@/lib/utils'

interface TodosWidgetProps {
  todos: Todo[]
  currentUserId: string
  onAdd: (title: string) => void
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TodosWidget({ todos, currentUserId, onAdd, onToggle, onDelete }: TodosWidgetProps) {
  const [input, setInput] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onAdd(input.trim())
    setInput('')
  }

  const pending = todos.filter(t => !t.completed)
  const done = todos.filter(t => t.completed)

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <CheckSquare2 className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs text-white/40 uppercase tracking-wider">Together list</span>
        {pending.length > 0 && (
          <span className="ml-auto text-xs text-white/20">{pending.length} left</span>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add something…"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500/40 transition-all"
        />
        <button type="submit" className="w-8 h-8 rounded-xl bg-white/8 hover:bg-white/12 flex items-center justify-center transition-colors">
          <Plus className="w-3.5 h-3.5 text-white/50" />
        </button>
      </form>

      <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-hide">
        {pending.map(todo => (
          <div key={todo.id} className="flex items-center gap-2 group">
            <button
              onClick={() => onToggle(todo.id, true)}
              className="w-4 h-4 rounded-full border border-white/20 hover:border-blue-400/60 flex items-center justify-center shrink-0 transition-colors"
            />
            <span className="flex-1 text-xs text-white/80 truncate">{todo.title}</span>
            <button
              onClick={() => onDelete(todo.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3 text-white/20 hover:text-red-400 transition-colors" />
            </button>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <div className="pt-2 pb-1">
              <span className="text-xs text-white/20">Done</span>
            </div>
            {done.map(todo => (
              <div key={todo.id} className={cn('flex items-center gap-2 group opacity-40')}>
                <button
                  onClick={() => onToggle(todo.id, false)}
                  className="w-4 h-4 rounded-full border border-blue-400/60 bg-blue-400/20 flex items-center justify-center shrink-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </button>
                <span className="flex-1 text-xs text-white/50 line-through truncate">{todo.title}</span>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-white/20 hover:text-red-400 transition-colors" />
                </button>
              </div>
            ))}
          </>
        )}

        {todos.length === 0 && (
          <p className="text-xs text-white/20 text-center py-4">Nothing here yet</p>
        )}
      </div>
    </div>
  )
}
