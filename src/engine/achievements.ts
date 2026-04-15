export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  category: 'care' | 'evolution' | 'health' | 'games' | 'collection'
  unlocked: boolean
  unlockedAt?: number
}

export const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Care Streaks
  { id: 'streak_3', name: '3-Day Streak', description: 'Keep your pet alive for 3 days', emoji: '🔥', category: 'care' },
  { id: 'streak_7', name: 'Week Warrior', description: 'Keep your pet alive for 7 days', emoji: '⭐', category: 'care' },
  { id: 'streak_30', name: 'Monthly Master', description: 'Keep your pet alive for 30 days', emoji: '👑', category: 'care' },

  // Evolution
  { id: 'first_evolve', name: 'First Evolution', description: 'Evolve your pet for the first time', emoji: '🦋', category: 'evolution' },
  { id: 'perfect_adult', name: 'Perfect Adult', description: 'Reach adult with all stats above 80', emoji: '💎', category: 'evolution' },

  // Health
  { id: 'steps_10k', name: '10K Steps', description: 'Log 10,000 steps in a day', emoji: '👟', category: 'health' },
  { id: 'sleep_champ', name: 'Sleep Champion', description: 'Get 7-9 hours of sleep', emoji: '😴', category: 'health' },
  { id: 'fitness_week', name: 'Fitness Week', description: '7 days of 30+ active minutes', emoji: '💪', category: 'health' },

  // Games
  { id: 'game_master', name: 'Mini-game Master', description: 'Win all 3 mini-games', emoji: '🎮', category: 'games' },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Get a perfect score in any mini-game', emoji: '💯', category: 'games' },

  // Collection
  { id: 'all_foods', name: 'Foodie', description: 'Try all food items', emoji: '🍽️', category: 'collection' },
  { id: 'all_skins', name: 'Fashionista', description: 'Unlock all skins', emoji: '🎨', category: 'collection' },
]

export function createInitialAchievements(): Achievement[] {
  return achievementDefinitions.map(def => ({ ...def, unlocked: false }))
}

export function checkStreakAchievement(daysSurvived: number): string | null {
  if (daysSurvived >= 30) return 'streak_30'
  if (daysSurvived >= 7) return 'streak_7'
  if (daysSurvived >= 3) return 'streak_3'
  return null
}
