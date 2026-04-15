import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/gameStore'
import { useGameLoop } from './hooks/useGameLoop'
import { usePersistence } from './hooks/usePersistence'
import { playSfx } from './engine/sound'
import Shell from './components/Shell'
import Screen from './components/Screen'
import Pet from './components/Pet'
import StatsPanel from './components/StatsPanel'
import ActionBar from './components/ActionBar'
import Onboarding from './components/Onboarding'
import MiniGame from './components/MiniGame'
import Settings from './components/Settings'
import Achievements from './components/Achievements'
import HealthSync from './components/HealthSync'
import DeathScreen from './components/DeathScreen'
import AvatarUpload from './components/AvatarUpload'

function ScreenContent() {
  const screen = useGameStore(s => s.currentScreen)
  const eventMessage = useGameStore(s => s.eventMessage)
  const dismissEvent = useGameStore(s => s.dismissEvent)

  switch (screen) {
    case 'onboarding': return <Onboarding />
    case 'death': return <DeathScreen />
    case 'minigame': return <MiniGame />
    case 'settings': return <Settings />
    case 'achievements': return <Achievements />
    case 'health': return <HealthSync />
    case 'avatar': return <AvatarUpload />
    default:
      return (
        <>
          <StatsPanel />
          <Pet />

          {/* Event notification banner */}
          <AnimatePresence>
            {eventMessage && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={() => { playSfx('click'); dismissEvent() }}
                className="absolute top-1 left-2 right-2 px-3 py-2 rounded-xl cursor-pointer z-20"
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '8px',
                  backgroundColor: 'rgba(0,0,0,0.85)',
                  color: '#fff',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}
              >
                {eventMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <ActionBar />
        </>
      )
  }
}

function Toast() {
  const toast = useGameStore(s => s.toast)
  const dismissToast = useGameStore(s => s.dismissToast)

  useEffect(() => {
    if (toast) {
      playSfx('achievement')
      const t = setTimeout(dismissToast, 3500)
      return () => clearTimeout(t)
    }
  }, [toast, dismissToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.8 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '11px',
            background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(129,140,248,0.4)',
          }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  useGameLoop()
  usePersistence()

  const screen = useGameStore(s => s.currentScreen)
  const setScreen = useGameStore(s => s.setScreen)

  const onA = () => {
    if (screen === 'main') setScreen('settings')
    else setScreen('main')
  }
  const onB = () => {
    if (screen === 'main') setScreen('achievements')
    else setScreen('main')
  }
  const onC = () => {
    if (screen === 'main') setScreen('health')
    else setScreen('main')
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, #1e1b4b 0%, #0f0e17 60%, #0a0a12 100%)',
      }}
    >
      <Toast />
      <Shell onA={onA} onB={onB} onC={onC}>
        <Screen>
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full flex flex-col"
            >
              <ScreenContent />
            </motion.div>
          </AnimatePresence>
        </Screen>
      </Shell>
    </div>
  )
}
