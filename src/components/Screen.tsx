import { type ReactNode } from 'react'
import { useGameStore } from '../store/gameStore'
import { themes } from '../data/themes'

export default function Screen({ children }: { children: ReactNode }) {
  const themeId = useGameStore(s => s.settings.themeId)
  const theme = themes.find(t => t.id === themeId) ?? themes[0]

  return (
    <div
      className="relative w-full h-full rounded-xl overflow-hidden screen-curve"
      style={{
        backgroundColor: theme.screenBg,
        border: '3px solid rgba(0,0,0,0.18)',
        boxShadow: `inset 0 2px 10px rgba(0,0,0,0.12), inset 0 0 20px ${theme.screenTint}`,
      }}
    >
      {/* Pixel grid */}
      <div className="pixel-grid absolute inset-0" />

      {/* Content */}
      <div className="relative z-[5] w-full h-full flex flex-col" style={{ color: theme.textColor }}>
        {children}
      </div>

      {/* Scanlines */}
      <div className="scanlines" />
    </div>
  )
}
