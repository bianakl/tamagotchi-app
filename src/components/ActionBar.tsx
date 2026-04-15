import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { foods, toys, medicines } from '../data/items'
import { themes } from '../data/themes'
import { playSfx } from '../engine/sound'

type ActionCategory = 'feed' | 'play' | 'care' | null

const ACTIONS = [
  { id: 'feed' as const, emoji: '🍽️', label: 'Feed' },
  { id: 'play' as const, emoji: '🎮', label: 'Play' },
  { id: 'care' as const, emoji: '💊', label: 'Care' },
]

export default function ActionBar() {
  const [expanded, setExpanded] = useState<ActionCategory>(null)
  const feed = useGameStore(s => s.feed)
  const play = useGameStore(s => s.play)
  const clean = useGameStore(s => s.clean)
  const sleep = useGameStore(s => s.sleep)
  const wake = useGameStore(s => s.wake)
  const heal = useGameStore(s => s.heal)
  const discipline = useGameStore(s => s.discipline)
  const isSleeping = useGameStore(s => s.pet.isSleeping)
  const setScreen = useGameStore(s => s.setScreen)
  const themeId = useGameStore(s => s.settings.themeId)
  const theme = themes.find(t => t.id === themeId) ?? themes[0]

  const handleAction = (category: ActionCategory) => {
    playSfx('click')
    setExpanded(expanded === category ? null : category)
  }

  const doAction = (fn: () => void, sound: 'feed' | 'play' | 'clean' | 'sleep' | 'heal') => {
    playSfx(sound)
    fn()
    setExpanded(null)
  }

  const subBtnStyle = {
    fontFamily: 'var(--font-pixel)',
    fontSize: '9px',
    backgroundColor: theme.buttonBg,
    color: theme.buttonText,
  } as const

  const mainBtnStyle = (active: boolean) => ({
    fontFamily: 'var(--font-pixel)',
    fontSize: '9px',
    backgroundColor: active ? theme.accent : theme.buttonBg,
    color: active ? theme.buttonBg : theme.buttonText,
  })

  return (
    <div className="px-3 pb-3">
      {/* Sub-items panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-2"
          >
            <div className="flex flex-wrap gap-2 justify-center py-2">
              {expanded === 'feed' && foods.map(food => (
                <button
                  key={food.id}
                  onClick={() => doAction(() => feed(food.id), 'feed')}
                  className="btn-physical px-3 py-2 rounded-xl flex items-center gap-1.5"
                  style={subBtnStyle}
                >
                  <span className="text-lg">{food.emoji}</span> {food.name}
                </button>
              ))}

              {expanded === 'play' && (
                <>
                  {toys.map(toy => (
                    <button
                      key={toy.id}
                      onClick={() => doAction(() => play(toy.id), 'play')}
                      className="btn-physical px-3 py-2 rounded-xl flex items-center gap-1.5"
                      style={subBtnStyle}
                    >
                      <span className="text-lg">{toy.emoji}</span> {toy.name}
                    </button>
                  ))}
                  <button
                    onClick={() => { playSfx('click'); setScreen('minigame') }}
                    className="btn-physical px-3 py-2 rounded-xl flex items-center gap-1.5"
                    style={subBtnStyle}
                  >
                    <span className="text-lg">🕹️</span> Games
                  </button>
                </>
              )}

              {expanded === 'care' && (
                <>
                  <button
                    onClick={() => doAction(clean, 'clean')}
                    className="btn-physical px-3 py-2 rounded-xl flex items-center gap-1.5"
                    style={subBtnStyle}
                  >
                    <span className="text-lg">🧼</span> Bath
                  </button>
                  <button
                    onClick={() => doAction(isSleeping ? wake : sleep, 'sleep')}
                    className="btn-physical px-3 py-2 rounded-xl flex items-center gap-1.5"
                    style={subBtnStyle}
                  >
                    <span className="text-lg">{isSleeping ? '☀️' : '🌙'}</span>
                    {isSleeping ? 'Wake' : 'Sleep'}
                  </button>
                  {medicines.map(med => (
                    <button
                      key={med.id}
                      onClick={() => doAction(() => heal(med.id), 'heal')}
                      className="btn-physical px-3 py-2 rounded-xl flex items-center gap-1.5"
                      style={subBtnStyle}
                    >
                      <span className="text-lg">{med.emoji}</span> {med.name}
                    </button>
                  ))}
                  <button
                    onClick={() => { playSfx('click'); discipline(); setExpanded(null) }}
                    className="btn-physical px-3 py-2 rounded-xl flex items-center gap-1.5"
                    style={subBtnStyle}
                  >
                    <span className="text-lg">☝️</span> Train
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main action buttons */}
      <div className="flex justify-center gap-3">
        {ACTIONS.map(action => (
          <motion.button
            key={action.id}
            onClick={() => handleAction(action.id)}
            whileTap={{ scale: 0.93 }}
            className={`btn-physical px-5 py-3 rounded-2xl flex flex-col items-center gap-1 min-w-[80px]`}
            style={mainBtnStyle(expanded === action.id)}
          >
            <span className="text-2xl">{action.emoji}</span>
            <span>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
