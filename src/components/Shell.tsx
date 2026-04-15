import { type ReactNode } from 'react'
import { useGameStore } from '../store/gameStore'
import { themes, skins } from '../data/themes'
import { playSfx } from '../engine/sound'

export default function Shell({ children, onA, onB, onC }: {
  children: ReactNode
  onA?: () => void
  onB?: () => void
  onC?: () => void
}) {
  const themeId = useGameStore(s => s.settings.themeId)
  const skinId = useGameStore(s => s.settings.skinId)
  const theme = themes.find(t => t.id === themeId) ?? themes[0]
  const skin = skins.find(s => s.id === skinId) ?? skins[0]

  const btnClick = (handler?: () => void) => () => {
    playSfx('button')
    handler?.()
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 py-2">
      {/* Lanyard ring */}
      <div className="flex justify-center mb-1">
        <div
          className="w-8 h-4 rounded-t-full border-2 border-b-0"
          style={{ borderColor: theme.shellBorder }}
        />
      </div>

      {/* Egg device body — thick bezel around a small inset screen */}
      <div
        className="relative select-none flex flex-col items-center"
        style={{
          width: '100%',
          maxWidth: 360,
          aspectRatio: '3 / 4',
          backgroundColor: theme.shell,
          borderRadius: skin.borderRadius,
          border: `4px solid ${theme.shellBorder}`,
          boxShadow: `
            0 10px 40px rgba(0,0,0,0.35),
            0 2px 8px rgba(0,0,0,0.2),
            inset 0 2px 0 rgba(255,255,255,0.2),
            inset 0 -2px 0 rgba(0,0,0,0.08)
          `,
          padding: '16px 32px 12px',
        }}
      >
        {/* Bezel shine */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: skin.borderRadius,
            background: `linear-gradient(160deg, rgba(255,255,255,0.2) 0%, transparent 30%, rgba(0,0,0,0.05) 100%)`,
          }}
        />

        {/* Brand label — sits on the bezel above the screen */}
        <div className="relative z-10 text-center mb-2 mt-1">
          <span style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '7px',
            color: theme.accent,
            opacity: 0.3,
            letterSpacing: '3px',
          }}>
            TAMAGOTCHI
          </span>
        </div>

        {/* Screen — inset into the bezel with generous margins */}
        <div
          className="relative z-10 w-full flex-1 min-h-0"
          style={{
            maxWidth: 240,
          }}
        >
          {children}
        </div>

        {/* Hardware buttons — sit below screen on the bezel */}
        <div className="relative z-10 flex justify-center gap-4 mt-3 mb-1">
          {[
            { label: '⚙️', handler: onA },
            { label: '🏆', handler: onB },
            { label: '❤️', handler: onC },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btnClick(btn.handler)}
              className="btn-physical rounded-full flex items-center justify-center text-base active:scale-95 transition-transform"
              style={{
                width: 42,
                height: 42,
                backgroundColor: theme.accent,
                color: theme.buttonBg,
                border: `2px solid rgba(255,255,255,0.1)`,
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
