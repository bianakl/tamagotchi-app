import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

const SAVE_KEY = 'tamagotchi-save'

export function usePersistence() {
  const getSerializable = useGameStore(s => s.getSerializable)
  const loadState = useGameStore(s => s.loadState)
  const pet = useGameStore(s => s.pet)

  // Load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        loadState(saved)
      }
    } catch {
      // corrupt save — ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save on every pet change
  useEffect(() => {
    try {
      const data = getSerializable()
      localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    } catch {
      // storage full — ignore
    }
  }, [pet, getSerializable])
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY)
}
