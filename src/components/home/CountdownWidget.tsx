'use client'

import { useState, useEffect } from 'react'
import { getCountdownTo, getDaysSince } from '@/lib/utils'
import { Clock, Heart } from 'lucide-react'

interface CountdownWidgetProps {
  nextMeetup: string | null
  lastMeetup: string | null
}

export function CountdownWidget({ nextMeetup, lastMeetup }: CountdownWidgetProps) {
  const [countdown, setCountdown] = useState(getCountdownTo(nextMeetup))
  const daysSince = getDaysSince(lastMeetup)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownTo(nextMeetup))
    }, 60000)
    return () => clearInterval(interval)
  }, [nextMeetup])

  return (
    <div className="space-y-3">
      {/* Days apart */}
      {lastMeetup && (
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-white/40 uppercase tracking-wider">Days apart</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-thin text-white/90 tabular-nums">{daysSince}</span>
            <span className="text-sm text-white/30">days</span>
          </div>
          <p className="text-xs text-white/30 mt-1">since we last met</p>
        </div>
      )}

      {/* Next meetup countdown */}
      {countdown && (
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs text-white/40 uppercase tracking-wider">Next meetup</span>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="text-center">
              <span className="text-3xl font-thin text-white/90 tabular-nums block">{countdown.days}</span>
              <span className="text-xs text-white/30">d</span>
            </div>
            <span className="text-white/20 text-2xl font-thin">:</span>
            <div className="text-center">
              <span className="text-3xl font-thin text-white/90 tabular-nums block">{countdown.hours}</span>
              <span className="text-xs text-white/30">h</span>
            </div>
            <span className="text-white/20 text-2xl font-thin">:</span>
            <div className="text-center">
              <span className="text-3xl font-thin text-white/90 tabular-nums block">{countdown.minutes}</span>
              <span className="text-xs text-white/30">m</span>
            </div>
          </div>
        </div>
      )}

      {!lastMeetup && !countdown && (
        <div className="glass rounded-2xl p-4 text-center">
          <Heart className="w-5 h-5 text-blue-400/50 mx-auto mb-2" />
          <p className="text-xs text-white/30">Set your meetup dates in settings</p>
        </div>
      )}
    </div>
  )
}
