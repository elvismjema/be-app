'use client'

import { useState, useEffect } from 'react'
import { getCurrentDate } from '@/lib/utils'
import { format } from 'date-fns'

interface ClockWidgetProps {
  myName?: string | null
  partnerName?: string | null
  partnerTimezone?: string | null
  partnerLastSeen?: string | null
}

function getTimeInZone(tz: string | null | undefined): { time: string; ampm: string } {
  try {
    if (!tz) throw new Error()
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true })
    const [time, ampm] = timeStr.split(' ')
    return { time, ampm }
  } catch {
    const now = new Date()
    return { time: format(now, 'h:mm'), ampm: format(now, 'a') }
  }
}

function getLastSeenText(lastSeen: string | null | undefined): string {
  if (!lastSeen) return 'offline'
  const diff = Date.now() - new Date(lastSeen).getTime()
  if (diff < 60000) return 'active now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

export function ClockWidget({ myName, partnerName, partnerTimezone, partnerLastSeen }: ClockWidgetProps) {
  const [myTime, setMyTime] = useState({ time: format(new Date(), 'h:mm'), ampm: format(new Date(), 'a') })
  const [partnerTime, setPartnerTime] = useState(getTimeInZone(partnerTimezone))
  const [date, setDate] = useState(getCurrentDate())
  const [lastSeen, setLastSeen] = useState(getLastSeenText(partnerLastSeen))

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setMyTime({ time: format(now, 'h:mm'), ampm: format(now, 'a') })
      setPartnerTime(getTimeInZone(partnerTimezone))
      setDate(getCurrentDate())
      setLastSeen(getLastSeenText(partnerLastSeen))
    }, 10000)
    return () => clearInterval(interval)
  }, [partnerTimezone, partnerLastSeen])

  const timesAreDifferent = partnerTimezone && partnerTimezone !== Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className="select-none">
      {/* My time — big */}
      {myName && (
        <p className="text-xs text-white/30 mb-1 tracking-wide">{myName}&apos;s time</p>
      )}
      <div className="flex items-end gap-2">
        <span className="text-7xl font-thin tracking-tight text-white/90 leading-none tabular-nums">
          {myTime.time}
        </span>
        <span className="text-2xl font-light text-white/40 mb-2">{myTime.ampm}</span>
      </div>
      <p className="text-white/40 text-sm font-light mt-1 tracking-wide">{date}</p>

      {/* Partner time */}
      {partnerName && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/30 mb-0.5">{partnerName}&apos;s time</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-light text-[#c9a87c]/80 tabular-nums">{partnerTime.time}</span>
              <span className="text-xs text-[#c9a87c]/50">{partnerTime.ampm}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/20">last seen</p>
            <p className={`text-xs ${lastSeen === 'active now' ? 'text-green-400' : 'text-white/30'}`}>
              {lastSeen}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
