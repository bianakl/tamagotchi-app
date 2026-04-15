import { create } from 'zustand'
import type { LifecycleStage } from '../data/sprites'
import type { PetStats } from '../engine/petLogic'
import { decayStats, applyStatChange, checkDeath, getNextStage, shouldEvolve, getAverageStats } from '../engine/petLogic'
import { rollRandomEvent, getEventEffects } from '../engine/events'
import { createInitialAchievements, type Achievement } from '../engine/achievements'
import type { FitData } from '../engine/healthMapping'
import { mapFitDataToBoosts } from '../engine/healthMapping'
import { foods, toys, medicines } from '../data/items'

export type Screen = 'main' | 'stats' | 'feed' | 'play' | 'settings' | 'achievements' | 'minigame' | 'health' | 'onboarding' | 'avatar' | 'death'

export interface GameState {
  // Pet
  pet: {
    name: string
    stage: LifecycleStage
    stats: PetStats
    age: number // minutes alive
    birthTime: number
    stageStartTime: number
    avatarUrl: string | null
    isAlive: boolean
    isSick: boolean
    poopCount: number
    isSleeping: boolean
    deathTimer: number // minutes with a stat at 0
  }

  // UI
  currentScreen: Screen
  eventMessage: string | null

  // Settings
  settings: {
    themeId: string
    skinId: string
    soundOn: boolean
    notifications: boolean
  }

  // Achievements
  achievements: Achievement[]
  xp: number
  level: number
  toast: string | null

  // Health Sync
  healthSync: {
    connected: boolean
    lastSync: number | null
    fitData: FitData | null
  }

  // Tracking
  foodsUsed: Set<string>
  gamesWon: Set<string>

  // Actions
  setScreen: (screen: Screen) => void
  dismissEvent: () => void
  dismissToast: () => void
  tick: () => void
  feed: (foodId: string) => void
  play: (toyId: string) => void
  clean: () => void
  sleep: () => void
  wake: () => void
  heal: (medicineId: string) => void
  discipline: () => void
  setName: (name: string) => void
  setAvatar: (url: string) => void
  setTheme: (themeId: string) => void
  setSkin: (skinId: string) => void
  toggleSound: () => void
  unlockAchievement: (id: string) => void
  addXp: (amount: number) => void
  applyFitData: (data: FitData) => void
  addMiniGameScore: (gameId: string, score: number) => void
  resetPet: () => void
  loadState: (state: Partial<SerializedState>) => void
  getSerializable: () => SerializedState
}

export interface SerializedState {
  pet: GameState['pet']
  settings: GameState['settings']
  achievements: Achievement[]
  xp: number
  level: number
  healthSync: GameState['healthSync']
  foodsUsed: string[]
  gamesWon: string[]
}

function defaultPet(): GameState['pet'] {
  return {
    name: '',
    stage: 'egg',
    stats: { hunger: 80, happiness: 80, energy: 80, cleanliness: 80, health: 80, discipline: 80 },
    age: 0,
    birthTime: Date.now(),
    stageStartTime: Date.now(),
    avatarUrl: null,
    isAlive: true,
    isSick: false,
    poopCount: 0,
    isSleeping: false,
    deathTimer: 0,
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  pet: defaultPet(),
  currentScreen: 'onboarding',
  eventMessage: null,

  settings: {
    themeId: 'classic',
    skinId: 'classic',
    soundOn: true,
    notifications: true,
  },

  achievements: createInitialAchievements(),
  xp: 0,
  level: 1,
  toast: null,

  healthSync: {
    connected: false,
    lastSync: null,
    fitData: null,
  },

  foodsUsed: new Set<string>(),
  gamesWon: new Set<string>(),

  setScreen: (screen) => set({ currentScreen: screen }),
  dismissEvent: () => set({ eventMessage: null }),
  dismissToast: () => set({ toast: null }),

  tick: () => {
    const state = get()
    if (!state.pet.isAlive) return

    let stats = state.pet.isSleeping
      ? { ...state.pet.stats, energy: Math.min(100, state.pet.stats.energy + 3) }
      : decayStats(state.pet.stats, state.pet.isSick)

    // Random events (not while sleeping)
    let eventMessage = state.eventMessage
    let isSick = state.pet.isSick
    let poopCount = state.pet.poopCount

    if (!state.pet.isSleeping) {
      const event = rollRandomEvent()
      if (event) {
        eventMessage = event.message
        const effects = getEventEffects(event.event)
        stats = applyStatChange(stats, effects)
        if (event.event === 'sickness') isSick = true
        if (event.event === 'poop') poopCount += 1
      }
    }

    // Check evolution
    let stage = state.pet.stage
    let stageStartTime = state.pet.stageStartTime
    if (shouldEvolve(stage, stageStartTime)) {
      const next = getNextStage(stage)
      if (next) {
        stage = next
        stageStartTime = Date.now()
        eventMessage = `Your pet evolved into a ${next}!`

        // Check perfect adult achievement
        if (next === 'adult' && getAverageStats(stats) >= 80) {
          get().unlockAchievement('perfect_adult')
        }
        if (!state.achievements.find(a => a.id === 'first_evolve')?.unlocked) {
          get().unlockAchievement('first_evolve')
        }
      }
    }

    // Death check
    let deathTimer = state.pet.deathTimer
    let isAlive = true
    if (checkDeath(stats)) {
      deathTimer += 1
      if (deathTimer >= 5) {
        isAlive = false
      }
    } else {
      deathTimer = 0
    }

    // Streak achievements
    const daysSurvived = Math.floor((Date.now() - state.pet.birthTime) / (1000 * 60 * 60 * 24))
    if (daysSurvived >= 3) get().unlockAchievement('streak_3')
    if (daysSurvived >= 7) get().unlockAchievement('streak_7')
    if (daysSurvived >= 30) get().unlockAchievement('streak_30')

    set({
      pet: {
        ...state.pet,
        stats,
        age: state.pet.age + 1,
        stage,
        stageStartTime,
        isSick,
        poopCount,
        isAlive,
        deathTimer,
      },
      eventMessage,
      currentScreen: !isAlive ? 'death' : state.currentScreen,
    })
  },

  feed: (foodId) => {
    const food = foods.find(f => f.id === foodId)
    if (!food) return
    const state = get()
    const stats = applyStatChange(state.pet.stats, {
      hunger: food.hunger,
      happiness: food.happiness,
      health: food.health,
      energy: food.energy,
    })
    const newFoodsUsed = new Set(state.foodsUsed)
    newFoodsUsed.add(foodId)
    if (newFoodsUsed.size >= foods.length) {
      get().unlockAchievement('all_foods')
    }
    get().addXp(5)
    set({ pet: { ...state.pet, stats }, foodsUsed: newFoodsUsed })
  },

  play: (toyId) => {
    const toy = toys.find(t => t.id === toyId)
    if (!toy) return
    const state = get()
    const stats = applyStatChange(state.pet.stats, {
      happiness: toy.happiness,
      energy: toy.energy,
      discipline: toy.discipline,
    })
    get().addXp(5)
    set({ pet: { ...state.pet, stats } })
  },

  clean: () => {
    const state = get()
    const stats = applyStatChange(state.pet.stats, { cleanliness: 30 })
    get().addXp(3)
    set({ pet: { ...state.pet, stats, poopCount: 0 } })
  },

  sleep: () => {
    const state = get()
    set({ pet: { ...state.pet, isSleeping: true }, currentScreen: 'main' })
  },

  wake: () => {
    const state = get()
    set({ pet: { ...state.pet, isSleeping: false } })
  },

  heal: (medicineId) => {
    const med = medicines.find(m => m.id === medicineId)
    if (!med) return
    const state = get()
    const stats = applyStatChange(state.pet.stats, { health: med.health })
    get().addXp(5)
    set({
      pet: {
        ...state.pet,
        stats,
        isSick: med.curesSickness ? false : state.pet.isSick,
      },
    })
  },

  discipline: () => {
    const state = get()
    const stats = applyStatChange(state.pet.stats, { discipline: 15, happiness: -5 })
    get().addXp(3)
    set({ pet: { ...state.pet, stats } })
  },

  setName: (name) => set(s => ({ pet: { ...s.pet, name } })),
  setAvatar: (url) => set(s => ({ pet: { ...s.pet, avatarUrl: url } })),
  setTheme: (themeId) => set(s => ({ settings: { ...s.settings, themeId } })),
  setSkin: (skinId) => set(s => ({ settings: { ...s.settings, skinId } })),
  toggleSound: () => set(s => ({ settings: { ...s.settings, soundOn: !s.settings.soundOn } })),

  unlockAchievement: (id) => {
    set(s => {
      const achievements = s.achievements.map(a =>
        a.id === id && !a.unlocked ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
      )
      const justUnlocked = achievements.find(a => a.id === id && a.unlockedAt === Date.now())
      return {
        achievements,
        toast: justUnlocked ? `${justUnlocked.emoji} ${justUnlocked.name} unlocked!` : s.toast,
      }
    })
  },

  addXp: (amount) => {
    set(s => {
      const xp = s.xp + amount
      const level = Math.floor(xp / 100) + 1
      return { xp, level }
    })
  },

  applyFitData: (data) => {
    const boosts = mapFitDataToBoosts(data)
    const state = get()
    const stats = applyStatChange(state.pet.stats, boosts)
    set({
      pet: { ...state.pet, stats },
      healthSync: { connected: true, lastSync: Date.now(), fitData: data },
    })
    if (data.steps >= 10000) get().unlockAchievement('steps_10k')
    if (data.sleepHours >= 7 && data.sleepHours <= 9) get().unlockAchievement('sleep_champ')
  },

  addMiniGameScore: (gameId, score) => {
    const state = get()
    const happiness = Math.floor(score / 2)
    const stats = applyStatChange(state.pet.stats, { happiness })
    const newGamesWon = new Set(state.gamesWon)
    newGamesWon.add(gameId)
    if (newGamesWon.size >= 3) get().unlockAchievement('game_master')
    if (score >= 100) get().unlockAchievement('perfect_score')
    get().addXp(score)
    set({ pet: { ...state.pet, stats }, gamesWon: newGamesWon })
  },

  resetPet: () => {
    set({
      pet: defaultPet(),
      currentScreen: 'onboarding',
      eventMessage: null,
      achievements: createInitialAchievements(),
      xp: 0,
      level: 1,
      toast: null,
      healthSync: { connected: false, lastSync: null, fitData: null },
      foodsUsed: new Set(),
      gamesWon: new Set(),
    })
  },

  loadState: (saved) => {
    set(s => ({
      ...s,
      ...saved,
      pet: saved.pet ? { ...s.pet, ...saved.pet } : s.pet,
      settings: saved.settings ? { ...s.settings, ...saved.settings } : s.settings,
      foodsUsed: saved.foodsUsed ? new Set(saved.foodsUsed) : s.foodsUsed,
      gamesWon: saved.gamesWon ? new Set(saved.gamesWon) : s.gamesWon,
      currentScreen: saved.pet?.isAlive === false ? 'death' : (saved.pet?.name ? 'main' : 'onboarding'),
    }))
  },

  getSerializable: () => {
    const s = get()
    return {
      pet: s.pet,
      settings: s.settings,
      achievements: s.achievements,
      xp: s.xp,
      level: s.level,
      healthSync: s.healthSync,
      foodsUsed: Array.from(s.foodsUsed),
      gamesWon: Array.from(s.gamesWon),
    }
  },
}))
