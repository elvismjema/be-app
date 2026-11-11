'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCouple } from '@/hooks/useCouple'
import { useTodos } from '@/hooks/useTodos'
import { useCalendar } from '@/hooks/useCalendar'
import { useJournal } from '@/hooks/useJournal'
import { useMoments } from '@/hooks/useMoments'
import { useChat } from '@/hooks/useChat'
import { useVault } from '@/hooks/useVault'
import { ClockWidget } from './ClockWidget'
import { CountdownWidget } from './CountdownWidget'
import { VerseWidget } from './VerseWidget'
import { MomentsWidget } from './MomentsWidget'
import { QuickSnap } from './QuickSnap'
import { TodosWidget } from './TodosWidget'
import { JournalWidget } from './JournalWidget'
import { CalendarWidget } from './CalendarWidget'
import { ChatWidget } from './ChatWidget'
import { VaultWidget } from './VaultWidget'
import { SettingsModal } from './SettingsModal'
import { BeLogo } from '@/components/ui/BeLogo'
import { Settings, LogOut, Images, MessageCircle, Lock } from 'lucide-react'
import type { User, Couple } from '@/types'
import { cn } from '@/lib/utils'

type CenterTab = 'moments' | 'chat' | 'vault'

interface DashboardClientProps {
  user: User
  couple: Couple
  partner: User | null
}

export function DashboardClient({ user, couple, partner }: DashboardClientProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [centerTab, setCenterTab] = useState<CenterTab>('moments')
  const [supabase] = useState(() => createClient())

  const { couple: liveCouple, updateMeetupDates } = useCouple(user.id)
  const activeCouple = liveCouple || couple

  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos(couple.id)
  const { events, addEvent, deleteEvent, nextMeetup } = useCalendar(couple.id)
  const { entries, addEntry } = useJournal(couple.id)
  const { moments, uploading, uploadMoment, deleteMoment } = useMoments(couple.id)
  const { messages, sendMessage, bottomRef } = useChat(couple.id)
  const { items: vaultItems, addItem: addVaultItem, deleteItem: deleteVaultItem } = useVault(couple.id)

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  const nextMeetupDate = nextMeetup?.start_date || activeCouple?.next_meetup || null
  const lastMeetupDate = activeCouple?.last_meetup || null
  const unreadMessages = messages.filter(m => m.author_id !== user.id).length

  const TABS: { key: CenterTab; label: string; icon: React.ReactNode }[] = [
    { key: 'moments', label: 'Moments', icon: <Images className="w-3 h-3" /> },
    { key: 'chat', label: 'Chat', icon: <MessageCircle className="w-3 h-3" /> },
    { key: 'vault', label: 'Vault', icon: <Lock className="w-3 h-3" /> },
  ]

  return (
    <div className="min-h-screen bg-[#07080f] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -right-20 w-[460px] h-[460px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(120,60,8,0.32) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <BeLogo size="sm" />
            <span className="text-sm font-medium text-white/50 italic" style={{ fontFamily: 'Georgia, serif' }}>be</span>
          </div>
          <div className="flex items-center gap-3">
            {partner && (
              <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-[#c9a87c] flex items-center justify-center text-xs font-medium text-white">
                  {partner.display_name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="text-xs text-white/50">{partner.display_name || 'Your person'}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
            )}
            <button onClick={() => setSettingsOpen(true)}
              className="w-8 h-8 rounded-xl glass glass-hover flex items-center justify-center transition-all">
              <Settings className="w-4 h-4 text-white/40" />
            </button>
            <button onClick={handleLogout}
              className="w-8 h-8 rounded-xl glass glass-hover flex items-center justify-center transition-all">
              <LogOut className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* LEFT — Clock, Countdown, Verse */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <ClockWidget
                myName={user.display_name}
                partnerName={partner?.display_name}
                partnerTimezone={partner?.timezone}
                partnerLastSeen={partner?.last_seen_at}
              />
            </div>
            <CountdownWidget nextMeetup={nextMeetupDate} lastMeetup={lastMeetupDate} />
            <VerseWidget />
          </div>

          {/* CENTER — Tabbed: Moments | Chat | Vault */}
          <div className="glass rounded-2xl flex flex-col" style={{ minHeight: '520px' }}>
            {/* Tab bar */}
            <div className="flex border-b border-white/8 shrink-0">
              {TABS.map(tab => (
                <button key={tab.key} onClick={() => setCenterTab(tab.key)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs transition-colors relative',
                    centerTab === tab.key ? 'text-white/80' : 'text-white/30 hover:text-white/50'
                  )}>
                  {tab.icon}
                  {tab.label}
                  {tab.key === 'chat' && unreadMessages > 0 && (
                    <span className="absolute top-2 right-3 w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                  {centerTab === tab.key && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 p-4 overflow-hidden flex flex-col">
              {centerTab === 'moments' && (
                <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide">
                  <QuickSnap
                    onSnap={(file, caption) => uploadMoment(file, caption, user.id)}
                    uploading={uploading}
                  />
                  <MomentsWidget
                    moments={moments}
                    currentUserId={user.id}
                    onUpload={(file, caption) => uploadMoment(file, caption, user.id)}
                    onDelete={deleteMoment}
                    uploading={uploading}
                  />
                </div>
              )}
              {centerTab === 'chat' && (
                <ChatWidget
                  messages={messages}
                  currentUserId={user.id}
                  partnerName={partner?.display_name || null}
                  onSend={(content) => sendMessage(content, user.id)}
                  bottomRef={bottomRef}
                />
              )}
              {centerTab === 'vault' && (
                <VaultWidget
                  items={vaultItems}
                  onAdd={(label, value, category) => addVaultItem(label, value, category, user.id)}
                  onDelete={deleteVaultItem}
                />
              )}
            </div>
          </div>

          {/* RIGHT — Calendar, Todos, Journal */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4">
              <CalendarWidget events={events} currentUserId={user.id}
                coupleId={couple.id} onAdd={addEvent} onDelete={deleteEvent} />
            </div>
            <div className="glass rounded-2xl p-4">
              <TodosWidget todos={todos} currentUserId={user.id}
                onAdd={(title) => addTodo(title, user.id)}
                onToggle={toggleTodo} onDelete={deleteTodo} />
            </div>
            <div className="glass rounded-2xl p-4">
              <JournalWidget entries={entries} currentUserId={user.id}
                partnerName={partner?.display_name || null}
                onAdd={(content, mood) => addEntry(content, mood, user.id)} />
            </div>
          </div>
        </div>
      </div>

      {settingsOpen && (
        <SettingsModal couple={activeCouple} user={user}
          onClose={() => setSettingsOpen(false)} onUpdateMeetups={updateMeetupDates} />
      )}
    </div>
  )
}
