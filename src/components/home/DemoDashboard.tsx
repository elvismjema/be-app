'use client'

import { useState } from 'react'
import { loadDemo, saveDemo, loadNames } from '@/hooks/demo/demoStore'
import { useDemoTodos } from '@/hooks/demo/useDemoTodos'
import { useDemoCalendar } from '@/hooks/demo/useDemoCalendar'
import { useDemoJournal } from '@/hooks/demo/useDemoJournal'
import { useDemoMoments } from '@/hooks/demo/useDemoMoments'
import { useDemoChat } from '@/hooks/demo/useDemoChat'
import { useDemoVault } from '@/hooks/demo/useDemoVault'
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
import { DemoSettingsModal } from './DemoSettingsModal'
import { BeLogo } from '@/components/ui/BeLogo'
import { Settings, FlaskConical, Images, MessageCircle, Lock } from 'lucide-react'
import type { Couple } from '@/types'
import { cn } from '@/lib/utils'

type CenterTab = 'moments' | 'chat' | 'vault'

export function DemoDashboard() {
  const demo = loadDemo()
  const names = loadNames()
  const myName = names?.myName || 'You'
  const partnerName = names?.partnerName || 'Her'
  const [couple, setCouple] = useState<Couple>(demo.couple)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [centerTab, setCenterTab] = useState<CenterTab>('moments')

  const { todos, addTodo, toggleTodo, deleteTodo } = useDemoTodos()
  const { events, addEvent, deleteEvent, nextMeetup } = useDemoCalendar()
  const { entries, addEntry } = useDemoJournal()
  const { moments, uploading, uploadMoment, deleteMoment } = useDemoMoments()
  const { messages, sendMessage, bottomRef } = useDemoChat()
  const { items: vaultItems, addItem: addVaultItem, deleteItem: deleteVaultItem } = useDemoVault()

  function updateMeetupDates(next: string | null, last: string | null) {
    const updated = { ...couple, next_meetup: next, last_meetup: last }
    setCouple(updated)
    saveDemo({ couple: updated, nextMeetup: next, lastMeetup: last })
  }

  const nextMeetupDate = nextMeetup?.start_date || couple.next_meetup || null
  const lastMeetupDate = couple.last_meetup || null

  const unreadMessages = messages.filter(m => m.author_id !== 'me').length

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
            <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-amber-500/80">Demo mode</span>
            </div>
            <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-[#c9a87c] flex items-center justify-center text-xs font-medium text-white">{partnerName[0]?.toUpperCase()}</div>
              <span className="text-xs text-white/50">{partnerName}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </div>
            <button onClick={() => setSettingsOpen(true)}
              className="w-8 h-8 rounded-xl glass glass-hover flex items-center justify-center transition-all">
              <Settings className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* LEFT — Clock, Countdown, Verse */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <ClockWidget
                myName={myName}
                partnerName={partnerName}
                partnerTimezone="America/New_York"
                partnerLastSeen={new Date(Date.now() - 420000).toISOString()}
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
                    onSnap={(file, caption) => uploadMoment(file, caption)}
                    uploading={uploading}
                  />
                  <MomentsWidget
                    moments={moments}
                    currentUserId="me"
                    onUpload={(file, caption) => uploadMoment(file, caption)}
                    onDelete={deleteMoment}
                    uploading={uploading}
                  />
                </div>
              )}
              {centerTab === 'chat' && (
                <ChatWidget
                  messages={messages}
                  currentUserId="me"
                  partnerName={partnerName}
                  onSend={(content) => sendMessage(content, 'me')}
                  bottomRef={bottomRef}
                />
              )}
              {centerTab === 'vault' && (
                <VaultWidget
                  items={vaultItems}
                  onAdd={(label, value, category) => addVaultItem(label, value, category)}
                  onDelete={deleteVaultItem}
                />
              )}
            </div>
          </div>

          {/* RIGHT — Calendar, Todos, Journal */}
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4">
              <CalendarWidget events={events} currentUserId="me" coupleId="demo"
                onAdd={addEvent} onDelete={deleteEvent} />
            </div>
            <div className="glass rounded-2xl p-4">
              <TodosWidget todos={todos} currentUserId="me"
                onAdd={(title) => addTodo(title)} onToggle={toggleTodo} onDelete={deleteTodo} />
            </div>
            <div className="glass rounded-2xl p-4">
              <JournalWidget entries={entries} currentUserId="me" partnerName={partnerName}
                onAdd={(content, mood) => addEntry(content, mood)} />
            </div>
          </div>
        </div>

        <p className="text-center text-white/15 text-xs mt-8">
          Demo mode — everything saves to your browser. No account needed.
        </p>
      </div>

      {settingsOpen && (
        <DemoSettingsModal couple={couple} onClose={() => setSettingsOpen(false)}
          onUpdateMeetups={updateMeetupDates} />
      )}
    </div>
  )
}
