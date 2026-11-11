import { getDailyVerse } from '@/lib/verses'
import { BookOpen } from 'lucide-react'

export function VerseWidget() {
  const verse = getDailyVerse()

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-3.5 h-3.5 text-[#c9a87c]" />
        <span className="text-xs text-white/40 uppercase tracking-wider">Daily verse</span>
      </div>
      <p className="text-sm text-white/80 leading-relaxed italic mb-2">&ldquo;{verse.text}&rdquo;</p>
      <p className="text-xs text-white/30">{verse.reference}</p>
    </div>
  )
}
