import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { clearSave } from '../hooks/usePersistence'
import { playSfx } from '../engine/sound'

export default function DeathScreen() {
  const pet = useGameStore(s => s.pet)
  const resetPet = useGameStore(s => s.resetPet)

  const hours = Math.floor(pet.age / 60)
  const mins = pet.age % 60

  useEffect(() => {
    playSfx('death')
  }, [])

  const handleRestart = () => {
    clearSave()
    resetPet()
    playSfx('evolve')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-5">
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl"
      >
        👼
      </motion.div>

      <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', textAlign: 'center', lineHeight: 1.8 }}>
        {pet.name || 'Your pet'} has passed away...
      </h2>

      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', opacity: 0.5, textAlign: 'center', lineHeight: 2.2 }}>
        <p>Stage: {pet.stage}</p>
        <p>Lived: {hours > 0 ? `${hours}h ` : ''}{mins}m</p>
        <p>Rest in peace 🕊️</p>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={handleRestart}
        className="btn-physical px-8 py-3 rounded-2xl mt-3"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.08)' }}
      >
        🥚 Try Again
      </motion.button>
    </div>
  )
}
