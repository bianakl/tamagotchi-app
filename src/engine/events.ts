export type GameEvent = 'poop' | 'sickness' | 'visitor' | 'tantrum' | null

interface EventConfig {
  chance: number // probability per tick (0-1)
  message: string
}

const EVENT_CONFIG: Record<Exclude<GameEvent, null>, EventConfig> = {
  poop: { chance: 0.10, message: 'Your pet made a mess! Clean it up!' },
  sickness: { chance: 0.03, message: 'Oh no! Your pet is feeling sick!' },
  visitor: { chance: 0.05, message: 'A friend came to visit! +5 happiness' },
  tantrum: { chance: 0.04, message: 'Your pet is throwing a tantrum!' },
}

export function rollRandomEvent(): { event: GameEvent; message: string } | null {
  for (const [event, config] of Object.entries(EVENT_CONFIG)) {
    if (Math.random() < config.chance) {
      return { event: event as GameEvent, message: config.message }
    }
  }
  return null
}

export function getEventEffects(event: GameEvent): Record<string, number> {
  switch (event) {
    case 'poop':
      return { cleanliness: -15 }
    case 'sickness':
      return {} // handled by isSick flag
    case 'visitor':
      return { happiness: 5 }
    case 'tantrum':
      return { happiness: -10, discipline: -5 }
    default:
      return {}
  }
}
