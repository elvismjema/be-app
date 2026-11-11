import { cn } from '@/lib/utils'

interface BeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizes = {
  sm:  { w: 28,  h: 36,  font: 11, rx: 8  },
  md:  { w: 40,  h: 52,  font: 16, rx: 11 },
  lg:  { w: 60,  h: 76,  font: 24, rx: 16 },
  xl:  { w: 80, h: 100,  font: 32, rx: 20 },
}

export function BeLogo({ size = 'md', className }: BeLogoProps) {
  const s = sizes[size]
  return (
    <svg
      width={s.w}
      height={s.h}
      viewBox={`0 0 ${s.w} ${s.h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id={`bg-${size}`} x1="0" y1="0" x2={s.w} y2={s.h} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1c0f06" />
        </linearGradient>
        <linearGradient id={`text-${size}`} x1="0" y1="0" x2={s.w} y2={s.h} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={`border-${size}`} x1="0" y1="0" x2={s.w} y2={s.h} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#92400e" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Locket body */}
      <rect
        x="1" y="1"
        width={s.w - 2}
        height={s.h - 2}
        rx={s.rx}
        fill={`url(#bg-${size})`}
        stroke={`url(#border-${size})`}
        strokeWidth="1.5"
      />

      {/* Subtle inner glow */}
      <rect
        x="2.5" y="2.5"
        width={s.w - 5}
        height={s.h - 5}
        rx={s.rx - 1}
        fill="none"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="1"
      />

      {/* "be" text */}
      <text
        x={s.w / 2}
        y={s.h / 2 + s.font * 0.35}
        textAnchor="middle"
        fontSize={s.font}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontWeight="400"
        fill={`url(#text-${size})`}
        letterSpacing="-0.5"
      >
        be
      </text>

      {/* Small cream heart at bottom */}
      <path
        transform={`translate(${s.w / 2 - s.font * 0.18}, ${s.h - s.font * 0.95}) scale(${s.font * 0.014})`}
        d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"
        fill="#c9a87c"
        opacity="0.95"
      />
    </svg>
  )
}
