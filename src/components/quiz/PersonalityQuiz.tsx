'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Info, RotateCcw, Share2, Check } from 'lucide-react'
import { QUIZ_ROWS, PERSONALITY_TYPES, type PersonalityType } from '@/lib/personality-data'
import { cn } from '@/lib/utils'

type Selections = Record<number, PersonalityType>

type Screen = 'intro' | 'quiz' | 'result'

const TYPE_COLORS: Record<PersonalityType, string> = {
  sanguine: 'border-amber-500/60 bg-amber-500/10 text-amber-200',
  choleric: 'border-red-500/60 bg-red-500/10 text-red-200',
  melancholy: 'border-blue-500/60 bg-blue-500/10 text-blue-200',
  phlegmatic: 'border-green-500/60 bg-green-500/10 text-green-200',
}

const TYPE_SELECTED: Record<PersonalityType, string> = {
  sanguine: 'border-amber-400 bg-amber-500/25 text-amber-100 shadow-amber-500/20 shadow-lg',
  choleric: 'border-red-400 bg-red-500/25 text-red-100 shadow-red-500/20 shadow-lg',
  melancholy: 'border-blue-400 bg-blue-500/25 text-blue-100 shadow-blue-500/20 shadow-lg',
  phlegmatic: 'border-green-400 bg-green-500/25 text-green-100 shadow-green-500/20 shadow-lg',
}

function tally(selections: Selections): Record<PersonalityType, number> {
  const counts: Record<PersonalityType, number> = { sanguine: 0, choleric: 0, melancholy: 0, phlegmatic: 0 }
  Object.values(selections).forEach(t => counts[t]++)
  return counts
}

function dominant(counts: Record<PersonalityType, number>): PersonalityType {
  return (Object.entries(counts) as [PersonalityType, number][])
    .sort(([, a], [, b]) => b - a)[0][0]
}

export function PersonalityQuiz() {
  const [screen, setScreen] = useState<Screen>('intro')
  const [current, setCurrent] = useState(0)
  const [selections, setSelections] = useState<Selections>({})
  const [tooltip, setTooltip] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const row = QUIZ_ROWS[current]
  const isStrengths = row?.section === 'strengths'
  const totalAnswered = Object.keys(selections).length
  const progress = (totalAnswered / 40) * 100

  function select(type: PersonalityType) {
    const updated = { ...selections, [row.row]: type }
    setSelections(updated)
    setTooltip(null)
    if (current < QUIZ_ROWS.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 280)
    } else {
      setTimeout(() => setScreen('result'), 350)
    }
  }

  function goBack() {
    if (current > 0) setCurrent(c => c - 1)
  }

  function reset() {
    setSelections({})
    setCurrent(0)
    setScreen('intro')
    setTooltip(null)
  }

  async function share(type: PersonalityType) {
    const info = PERSONALITY_TYPES[type]
    const text = `I took the personality quiz on be and I'm ${info.emoji} ${info.name} (${info.tagline})\n\n"${info.description}"`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (screen === 'intro') {
    return (
      <div className="min-h-screen bg-[#07080f] flex items-center justify-center px-4">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-20 -right-20 w-[460px] h-[460px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(120,60,8,0.25) 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-sm w-full text-center space-y-6">
          <div className="text-6xl mb-2">🧠</div>
          <div>
            <h1 className="text-2xl font-semibold mb-2">What's your personality?</h1>
            <p className="text-white/40 text-sm leading-relaxed">
              40 quick questions. Pick the word that feels most like you — not how you want to be, just how you actually are. No wrong answers.
            </p>
          </div>
          <div className="glass rounded-2xl p-4 grid grid-cols-2 gap-3 text-left">
            {(Object.entries(PERSONALITY_TYPES) as [PersonalityType, typeof PERSONALITY_TYPES[PersonalityType]][]).map(([, info]) => (
              <div key={info.tagline} className="space-y-0.5">
                <p className="text-sm">{info.emoji} {info.name}</p>
                <p className="text-xs text-white/35">{info.tagline}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setScreen('quiz')}
            className="w-full bg-gradient-to-r from-blue-600 to-amber-700 hover:from-blue-500 hover:to-amber-600 text-white font-medium rounded-xl py-3 text-sm transition-all">
            Start the quiz
          </button>
          <button onClick={() => window.history.back()} className="text-white/30 hover:text-white/50 text-sm transition-colors">
            ← Back
          </button>
        </div>
      </div>
    )
  }

  if (screen === 'result') {
    const counts = tally(selections)
    const type = dominant(counts)
    const info = PERSONALITY_TYPES[type]
    const sorted = (Object.entries(counts) as [PersonalityType, number][]).sort(([, a], [, b]) => b - a)

    return (
      <div className="min-h-screen bg-[#07080f] flex items-center justify-center px-4 py-10">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-sm w-full space-y-5">
          <div className={cn('glass rounded-2xl p-6 text-center bg-gradient-to-b', info.color, 'bg-opacity-10')}>
            <div className="text-5xl mb-3">{info.emoji}</div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{info.tagline}</p>
            <h2 className="text-2xl font-semibold mb-3">{info.name}</h2>
            <p className="text-sm text-white/60 leading-relaxed">{info.description}</p>
          </div>

          <div className="glass rounded-2xl p-4 space-y-3">
            <p className="text-xs text-white/40 uppercase tracking-wider">Your scores</p>
            {sorted.map(([t, count]) => {
              const ti = PERSONALITY_TYPES[t]
              return (
                <div key={t}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/60">{ti.emoji} {ti.tagline}</span>
                    <span className="text-xs text-white/40">{count}/40</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full bg-gradient-to-r transition-all', ti.color)} style={{ width: `${(count / 40) * 100}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <button onClick={() => share(type)}
            className="w-full flex items-center justify-center gap-2 glass hover:bg-white/8 rounded-xl py-3 text-sm text-white/60 hover:text-white/80 transition-all">
            {copied ? <><Check className="w-4 h-4 text-green-400" /> Copied to clipboard</> : <><Share2 className="w-4 h-4" /> Share my result</>}
          </button>

          <button onClick={reset}
            className="w-full flex items-center justify-center gap-2 text-white/30 hover:text-white/50 text-sm py-2 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Retake
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07080f] flex flex-col px-4 py-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between mb-3">
          <button onClick={goBack} disabled={current === 0}
            className="w-8 h-8 rounded-lg glass flex items-center justify-center disabled:opacity-30 transition-opacity">
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div className="text-center">
            <p className="text-xs text-white/40">{current + 1} / 40</p>
            <p className={cn('text-xs font-medium mt-0.5', isStrengths ? 'text-blue-400' : 'text-amber-400')}>
              {isStrengths ? 'Strengths' : 'Weaknesses'}
            </p>
          </div>
          <button onClick={() => window.history.back()} className="w-8 h-8 rounded-lg glass flex items-center justify-center">
            <span className="text-white/40 text-xs">✕</span>
          </button>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-amber-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="relative flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <p className="text-white/40 text-xs mb-5 text-center">
          Pick the word that fits you best
        </p>

        <div className="space-y-3">
          {row.words.map((w) => {
            const isSelected = selections[row.row] === w.type
            const showTooltip = tooltip === `${row.row}-${w.type}`
            return (
              <div key={w.type} className="relative">
                <button
                  onClick={() => select(w.type)}
                  className={cn(
                    'w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3',
                    isSelected ? TYPE_SELECTED[w.type] : cn('border-white/8 bg-white/3 text-white/70 hover:bg-white/6 hover:border-white/15', TYPE_COLORS[w.type])
                  )}
                >
                  <span className="text-sm font-medium">{w.word}</span>
                  {isSelected && <Check className="w-4 h-4 shrink-0 opacity-80" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setTooltip(showTooltip ? null : `${row.row}-${w.type}`) }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center transition-colors"
                  aria-label="See definition"
                >
                  <Info className="w-3 h-3 text-white/40" />
                </button>
                {showTooltip && (
                  <div className="mt-1.5 mx-2 glass rounded-xl px-3 py-2.5 text-xs text-white/60 leading-relaxed border border-white/8">
                    {w.definition}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {current < QUIZ_ROWS.length - 1 && selections[row.row] && (
          <button onClick={() => setCurrent(c => c + 1)}
            className="mt-6 w-full flex items-center justify-center gap-1.5 text-white/40 hover:text-white/60 text-sm transition-colors">
            Next <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
