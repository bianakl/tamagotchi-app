import type { PetStats } from './petLogic'

export interface FitData {
  steps: number
  sleepHours: number
  activeMinutes: number
  heartPoints: number
}

export function mapFitDataToBoosts(data: FitData): Partial<PetStats> {
  const boosts: Partial<PetStats> = {}

  // Steps
  if (data.steps >= 10000) {
    boosts.health = (boosts.health ?? 0) + 20
    boosts.energy = (boosts.energy ?? 0) + 10
  } else if (data.steps >= 5000) {
    boosts.health = (boosts.health ?? 0) + 10
    boosts.energy = (boosts.energy ?? 0) + 5
  }

  // Sleep
  if (data.sleepHours >= 7 && data.sleepHours <= 9) {
    boosts.energy = (boosts.energy ?? 0) + 15
    boosts.health = (boosts.health ?? 0) + 5
  } else if (data.sleepHours < 5) {
    boosts.energy = (boosts.energy ?? 0) - 10
  }

  // Active minutes
  if (data.activeMinutes >= 30) {
    boosts.happiness = (boosts.happiness ?? 0) + 10
    boosts.health = (boosts.health ?? 0) + 5
  }

  // Heart points
  if (data.heartPoints >= 20) {
    boosts.hunger = (boosts.hunger ?? 0) + 5
    boosts.happiness = (boosts.happiness ?? 0) + 5
    boosts.energy = (boosts.energy ?? 0) + 5
    boosts.cleanliness = (boosts.cleanliness ?? 0) + 5
    boosts.health = (boosts.health ?? 0) + 5
    boosts.discipline = (boosts.discipline ?? 0) + 5
  }

  return boosts
}
