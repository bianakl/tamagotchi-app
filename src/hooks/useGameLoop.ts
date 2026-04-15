import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

const TICK_INTERVAL = 60_000 // 1 minute

export function useGameLoop() {
  const tick = useGameStore(s => s.tick)
  const isAlive = useGameStore(s => s.pet.isAlive)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isAlive) return

    intervalRef.current = window.setInterval(() => {
      tick()
    }, TICK_INTERVAL)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [tick, isAlive])
}
