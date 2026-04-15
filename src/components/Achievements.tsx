import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { playSfx } from '../engine/sound'

export default function Achievements() {
  const achievements = useGameStore(s => s.achievements)
  const xp = useGameStore(s => s.xp)
  const level = useGameStore(s => s.level)
  const setScreen = useGameStore(s => s.setScreen)

  const unlocked = achievements.filter(a => a.unlocked)
  const locked = achievements.filter(a => !a.unlocked)
  const xpProgress = xp % 100
  const xpToNext = 100 - xpProgress

  return (
    <div className="flex flex-col h-full px-4 py-3 overflow-y-auto scroll-area gap-3">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px' }}>
        <span>🏆 Awards</span>
        <button onClick={() => { playSfx('click'); setScreen('main') }} className="opacity-50 text-lg">✕</button>
      </div>

      {/* XP Bar */}
      <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
        <div className="flex justify-between mb-2" style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>
          <span>Level {level}</span>
          <span className="opacity-50">{xpToNext} XP to next</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #a78bfa, #818cf8)', boxShadow: '0 0 8px rgba(167,139,250,0.4)' }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', opacity: 0.5 }} className="mb-2">
            Unlocked ({unlocked.length})
          </p>
          <div className="grid grid-cols-3 gap-2">
            {unlocked.map(a => (
              <motion.div
                key={a.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              >
                <span className="text-2xl mb-1">{a.emoji}</span>
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', textAlign: 'center', lineHeight: 1.4 }}>
                  {a.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      <div>
        <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', opacity: 0.5 }} className="mb-2">
          Locked ({locked.length})
        </p>
        <div className="grid grid-cols-3 gap-2">
          {locked.map(a => (
            <div
              key={a.id}
              className="flex flex-col items-center p-3 rounded-xl opacity-35"
              style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
            >
              <span className="text-2xl mb-1">🔒</span>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '6px', textAlign: 'center', lineHeight: 1.4 }}>
                {a.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
