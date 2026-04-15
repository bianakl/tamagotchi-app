import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { themes } from '../data/themes'
import { STAT_KEYS } from '../engine/petLogic'

const STAT_CONFIG: Record<string, { emoji: string; label: string }> = {
  hunger:      { emoji: '🍎', label: 'Food' },
  happiness:   { emoji: '😊', label: 'Joy' },
  energy:      { emoji: '⚡', label: 'Nrg' },
  cleanliness: { emoji: '✨', label: 'Cln' },
  health:      { emoji: '❤️', label: 'HP' },
  discipline:  { emoji: '💪', label: 'Dis' },
}

function barColor(value: number): string {
  if (value > 60) return '#22c55e'
  if (value > 30) return '#eab308'
  return '#ef4444'
}

export default function StatsPanel() {
  const stats = useGameStore(s => s.pet.stats)
  const stage = useGameStore(s => s.pet.stage)
  const level = useGameStore(s => s.level)
  const themeId = useGameStore(s => s.settings.themeId)
  const theme = themes.find(t => t.id === themeId) ?? themes[0]

  return (
    <div className="px-3 pt-3 pb-1">
      {/* Header row */}
      <div className="flex justify-between items-center mb-2">
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', opacity: 0.5 }}>
          Lv.{level}
        </span>
        <span
          className="px-2 py-0.5 rounded-full"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '8px',
            backgroundColor: theme.buttonBg,
            color: theme.buttonText,
          }}
        >
          {stage}
        </span>
      </div>

      {/* Stat bars */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {STAT_KEYS.map(key => {
          const value = stats[key]
          const color = barColor(value)
          const isCritical = value < 20
          const config = STAT_CONFIG[key]

          return (
            <div key={key} className="flex items-center gap-1">
              <span className="text-sm leading-none">{config.emoji}</span>
              <div className="flex-1">
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
                >
                  <motion.div
                    className={isCritical ? 'stat-critical' : ''}
                    initial={false}
                    animate={{ width: `${value}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                    style={{
                      height: '100%',
                      backgroundColor: color,
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', minWidth: 18, textAlign: 'right' }}>
                {Math.round(value)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
