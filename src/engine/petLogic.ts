import { type LifecycleStage, stageTimings } from '../data/sprites'

export interface PetStats {
  hunger: number
  happiness: number
  energy: number
  cleanliness: number
  health: number
  discipline: number
}

export const STAT_KEYS: (keyof PetStats)[] = ['hunger', 'happiness', 'energy', 'cleanliness', 'health', 'discipline']

// Decay per minute
const DECAY_RATES: PetStats = {
  hunger: 2,
  happiness: 1.5,
  energy: 1,
  cleanliness: 1,
  health: 0.5,
  discipline: 0.5,
}

export function decayStats(stats: PetStats, isSick: boolean): PetStats {
  const next = { ...stats }
  for (const key of STAT_KEYS) {
    let rate = DECAY_RATES[key]
    if (key === 'health' && isSick) rate *= 3
    next[key] = Math.max(0, next[key] - rate)
  }
  return next
}

export function applyStatChange(stats: PetStats, changes: Partial<PetStats>): PetStats {
  const next = { ...stats }
  for (const key of STAT_KEYS) {
    if (changes[key] !== undefined) {
      next[key] = Math.min(100, Math.max(0, next[key] + changes[key]!))
    }
  }
  return next
}

export function getAverageStats(stats: PetStats): number {
  let sum = 0
  for (const key of STAT_KEYS) sum += stats[key]
  return sum / STAT_KEYS.length
}

export function checkDeath(stats: PetStats): boolean {
  return STAT_KEYS.some(key => stats[key] <= 0)
}

export function getNextStage(current: LifecycleStage): LifecycleStage | null {
  const order: LifecycleStage[] = ['egg', 'baby', 'child', 'teen', 'adult']
  const idx = order.indexOf(current)
  if (idx < order.length - 1) return order[idx + 1]
  return null
}

export function shouldEvolve(stage: LifecycleStage, stageStartTime: number): boolean {
  if (stage === 'adult') return false
  const elapsed = Date.now() - stageStartTime
  return elapsed >= stageTimings[stage]
}

export function clampStat(value: number): number {
  return Math.min(100, Math.max(0, value))
}
