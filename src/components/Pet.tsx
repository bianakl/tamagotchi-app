import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import type { LifecycleStage } from '../data/sprites'

// Cute emoji-based pet rendering per stage — much more visible and charming
const STAGE_FACES: Record<LifecycleStage, { body: string; size: number }> = {
  egg:   { body: '🥚', size: 64 },
  baby:  { body: '🐣', size: 72 },
  child: { body: '🐥', size: 80 },
  teen:  { body: '🐤', size: 88 },
  adult: { body: '🐔', size: 96 },
}

const MOOD_OVERLAYS: Record<string, string> = {
  sleeping: '😴',
  sick: '🤢',
  sad: '😢',
  happy: '🥰',
}

export default function Pet() {
  const stage = useGameStore(s => s.pet.stage)
  const isSleeping = useGameStore(s => s.pet.isSleeping)
  const isSick = useGameStore(s => s.pet.isSick)
  const isAlive = useGameStore(s => s.pet.isAlive)
  const happiness = useGameStore(s => s.pet.stats.happiness)
  const avatarUrl = useGameStore(s => s.pet.avatarUrl)
  const poopCount = useGameStore(s => s.pet.poopCount)
  const name = useGameStore(s => s.pet.name)

  const [blink, setBlink] = useState(false)

  // Blinking effect
  useEffect(() => {
    if (!isAlive || isSleeping) return
    const interval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [isAlive, isSleeping])

  const animState = !isAlive ? 'dead' : isSleeping ? 'sleeping' : isSick ? 'sick' : happiness < 20 ? 'sad' : happiness > 80 ? 'happy' : 'idle'
  const face = STAGE_FACES[stage]

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative min-h-0">

      {/* Background scene — subtle ground line */}
      <div className="absolute bottom-8 left-6 right-6 h-px opacity-15" style={{ backgroundColor: 'currentColor' }} />

      {/* Status indicators top-right */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
        {isSick && isAlive && (
          <motion.span
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-2xl"
          >
            🤒
          </motion.span>
        )}
      </div>

      {/* Sleeping ZZZ floating up */}
      <AnimatePresence>
        {isSleeping && (
          <>
            {[0, 1, 2].map(i => (
              <motion.div
                key={`z-${i}`}
                initial={{ opacity: 0, y: 10, x: 30 + i * 15 }}
                animate={{ opacity: [0, 1, 0], y: -40 - i * 20, x: 35 + i * 20 }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.7 }}
                className="absolute"
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: `${10 + i * 3}px`,
                  top: '30%',
                  opacity: 0.6,
                }}
              >
                z
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Pet name label */}
      {name && (
        <div
          className="absolute top-2 left-3"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', opacity: 0.4 }}
        >
          {name}
        </div>
      )}

      {/* Main pet character */}
      <motion.div
        className="pet-glow relative flex items-center justify-center"
        animate={
          animState === 'idle' ? { y: [0, -8, 0, -4, 0] } :
          animState === 'happy' ? { y: [0, -16, 0], rotate: [0, -3, 0, 3, 0], scale: [1, 1.05, 1] } :
          animState === 'sad' ? { y: [0, 3, 0] } :
          animState === 'sleeping' ? { y: [0, -3, 0], scale: [1, 1.02, 1] } :
          animState === 'sick' ? { x: [-3, 3, -3], rotate: [-2, 2, -2] } :
          animState === 'dead' ? { y: [0, -30], opacity: [1, 0.3, 1], scale: [1, 0.9, 1] } :
          { y: [0, -6, 0] }
        }
        transition={
          animState === 'idle' ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } :
          animState === 'happy' ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } :
          animState === 'sad' ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } :
          animState === 'sleeping' ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } :
          animState === 'sick' ? { duration: 0.3, repeat: Infinity } :
          animState === 'dead' ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } :
          { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Pet avatar"
            className="pixel-render rounded-xl"
            style={{ width: 100, height: 100, opacity: blink ? 0.7 : 1 }}
          />
        ) : (
          <span
            style={{ fontSize: face.size, lineHeight: 1, opacity: blink ? 0.85 : 1 }}
            className="transition-opacity duration-100"
          >
            {!isAlive ? '👼' : face.body}
          </span>
        )}

        {/* Mood overlay — small badge */}
        {animState !== 'idle' && animState !== 'dead' && MOOD_OVERLAYS[animState] && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 text-xl"
          >
            {MOOD_OVERLAYS[animState]}
          </motion.span>
        )}
      </motion.div>

      {/* Shadow under pet */}
      <motion.div
        className="rounded-full mt-2"
        style={{ backgroundColor: 'rgba(0,0,0,0.1)', width: 60, height: 8 }}
        animate={
          animState === 'happy' ? { scaleX: [1, 0.7, 1] } :
          animState === 'idle' ? { scaleX: [1, 0.9, 1] } :
          { scaleX: 1 }
        }
        transition={{ duration: animState === 'happy' ? 0.8 : 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Poop indicators */}
      {poopCount > 0 && (
        <div className="absolute bottom-3 right-3 flex gap-1">
          {Array.from({ length: Math.min(poopCount, 5) }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-xl"
            >
              💩
            </motion.span>
          ))}
        </div>
      )}
    </div>
  )
}
