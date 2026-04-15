export type LifecycleStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult'
export type AnimationState = 'idle' | 'eating' | 'playing' | 'sleeping' | 'sick' | 'happy' | 'sad' | 'pooping' | 'dead'

// CSS pixel art using box-shadow technique — each "pixel" is a 4x4px unit
// Colors: body, eyes, cheeks, mouth
export interface SpriteDefinition {
  stage: LifecycleStage
  width: number
  height: number
  pixels: string // CSS box-shadow string
  color: string
}

const P = 4 // pixel size

function px(x: number, y: number, color: string): string {
  return `${x * P}px ${y * P}px 0 0 ${color}`
}

// Egg sprite — simple oval
const eggPixels = [
  // Row 0-1: top
  px(3, 0, '#ffd'), px(4, 0, '#ffd'), px(5, 0, '#ffd'),
  // Row 1
  px(2, 1, '#ffd'), px(3, 1, '#ffe'), px(4, 1, '#ffe'), px(5, 1, '#ffe'), px(6, 1, '#ffd'),
  // Row 2
  px(1, 2, '#ffd'), px(2, 2, '#ffe'), px(3, 2, '#ffe'), px(4, 2, '#fff'), px(5, 2, '#ffe'), px(6, 2, '#ffe'), px(7, 2, '#ffd'),
  // Row 3 — crack line
  px(1, 3, '#ffd'), px(2, 3, '#ffe'), px(3, 3, '#dda'), px(4, 3, '#ffe'), px(5, 3, '#dda'), px(6, 3, '#ffe'), px(7, 3, '#ffd'),
  // Row 4
  px(1, 4, '#ffd'), px(2, 4, '#ffe'), px(3, 4, '#ffe'), px(4, 4, '#ffe'), px(5, 4, '#ffe'), px(6, 4, '#ffe'), px(7, 4, '#ffd'),
  // Row 5
  px(2, 5, '#ffd'), px(3, 5, '#ffe'), px(4, 5, '#ffe'), px(5, 5, '#ffe'), px(6, 5, '#ffd'),
  // Row 6
  px(3, 6, '#ffd'), px(4, 6, '#ffd'), px(5, 6, '#ffd'),
].join(',')

// Baby sprite — small round with eyes
const babyPixels = [
  // Head top
  px(3, 0, '#ffb7c5'), px(4, 0, '#ffb7c5'), px(5, 0, '#ffb7c5'),
  px(2, 1, '#ffb7c5'), px(3, 1, '#ffc8d6'), px(4, 1, '#ffc8d6'), px(5, 1, '#ffc8d6'), px(6, 1, '#ffb7c5'),
  // Eyes row
  px(1, 2, '#ffb7c5'), px(2, 2, '#ffc8d6'), px(3, 2, '#222'), px(4, 2, '#ffc8d6'), px(5, 2, '#222'), px(6, 2, '#ffc8d6'), px(7, 2, '#ffb7c5'),
  // Mouth
  px(1, 3, '#ffb7c5'), px(2, 3, '#ffc8d6'), px(3, 3, '#ffc8d6'), px(4, 3, '#f06'), px(5, 3, '#ffc8d6'), px(6, 3, '#ffc8d6'), px(7, 3, '#ffb7c5'),
  // Body
  px(2, 4, '#ffb7c5'), px(3, 4, '#ffc8d6'), px(4, 4, '#ffc8d6'), px(5, 4, '#ffc8d6'), px(6, 4, '#ffb7c5'),
  // Feet
  px(3, 5, '#ffb7c5'), px(5, 5, '#ffb7c5'),
].join(',')

// Child sprite — bigger body, limbs
const childPixels = [
  // Head
  px(3, 0, '#7ec8e3'), px(4, 0, '#7ec8e3'), px(5, 0, '#7ec8e3'),
  px(2, 1, '#7ec8e3'), px(3, 1, '#a8ddf0'), px(4, 1, '#a8ddf0'), px(5, 1, '#a8ddf0'), px(6, 1, '#7ec8e3'),
  // Eyes
  px(1, 2, '#7ec8e3'), px(2, 2, '#a8ddf0'), px(3, 2, '#222'), px(4, 2, '#a8ddf0'), px(5, 2, '#222'), px(6, 2, '#a8ddf0'), px(7, 2, '#7ec8e3'),
  // Cheeks + mouth
  px(1, 3, '#7ec8e3'), px(2, 3, '#ffb7c5'), px(3, 3, '#a8ddf0'), px(4, 3, '#f06'), px(5, 3, '#a8ddf0'), px(6, 3, '#ffb7c5'), px(7, 3, '#7ec8e3'),
  // Body
  px(2, 4, '#7ec8e3'), px(3, 4, '#a8ddf0'), px(4, 4, '#a8ddf0'), px(5, 4, '#a8ddf0'), px(6, 4, '#7ec8e3'),
  px(2, 5, '#7ec8e3'), px(3, 5, '#a8ddf0'), px(4, 5, '#a8ddf0'), px(5, 5, '#a8ddf0'), px(6, 5, '#7ec8e3'),
  // Arms
  px(1, 4, '#7ec8e3'), px(7, 4, '#7ec8e3'),
  // Feet
  px(2, 6, '#7ec8e3'), px(3, 6, '#7ec8e3'), px(5, 6, '#7ec8e3'), px(6, 6, '#7ec8e3'),
].join(',')

// Teen — taller, more detail
const teenPixels = [
  // Hair/head top
  px(3, 0, '#f7b731'), px(4, 0, '#f7b731'), px(5, 0, '#f7b731'),
  px(2, 0, '#f7b731'), px(6, 0, '#f7b731'),
  // Head
  px(2, 1, '#ffd5a0'), px(3, 1, '#ffe0b5'), px(4, 1, '#ffe0b5'), px(5, 1, '#ffe0b5'), px(6, 1, '#ffd5a0'),
  // Eyes
  px(1, 2, '#ffd5a0'), px(2, 2, '#ffe0b5'), px(3, 2, '#222'), px(4, 2, '#ffe0b5'), px(5, 2, '#222'), px(6, 2, '#ffe0b5'), px(7, 2, '#ffd5a0'),
  // Mouth
  px(2, 3, '#ffd5a0'), px(3, 3, '#ffe0b5'), px(4, 3, '#e55'), px(5, 3, '#ffe0b5'), px(6, 3, '#ffd5a0'),
  // Body (shirt)
  px(2, 4, '#4a9'), px(3, 4, '#5cb'), px(4, 4, '#5cb'), px(5, 4, '#5cb'), px(6, 4, '#4a9'),
  px(2, 5, '#4a9'), px(3, 5, '#5cb'), px(4, 5, '#5cb'), px(5, 5, '#5cb'), px(6, 5, '#4a9'),
  px(2, 6, '#4a9'), px(3, 6, '#5cb'), px(4, 6, '#5cb'), px(5, 6, '#5cb'), px(6, 6, '#4a9'),
  // Arms
  px(1, 4, '#ffd5a0'), px(7, 4, '#ffd5a0'), px(1, 5, '#ffd5a0'), px(7, 5, '#ffd5a0'),
  // Legs
  px(2, 7, '#445'), px(3, 7, '#445'), px(5, 7, '#445'), px(6, 7, '#445'),
  // Feet
  px(2, 8, '#333'), px(3, 8, '#333'), px(5, 8, '#333'), px(6, 8, '#333'),
].join(',')

// Adult — most detailed
const adultPixels = [
  // Crown/detail
  px(4, 0, '#f7b731'),
  px(3, 0, '#f7b731'), px(5, 0, '#f7b731'),
  // Head
  px(2, 1, '#ffd5a0'), px(3, 1, '#ffe0b5'), px(4, 1, '#ffe0b5'), px(5, 1, '#ffe0b5'), px(6, 1, '#ffd5a0'),
  // Eyes with shine
  px(1, 2, '#ffd5a0'), px(2, 2, '#ffe0b5'), px(3, 2, '#222'), px(4, 2, '#ffe0b5'), px(5, 2, '#222'), px(6, 2, '#ffe0b5'), px(7, 2, '#ffd5a0'),
  // Cheeks + smile
  px(1, 3, '#ffd5a0'), px(2, 3, '#ffb7c5'), px(3, 3, '#ffe0b5'), px(4, 3, '#e55'), px(5, 3, '#ffe0b5'), px(6, 3, '#ffb7c5'), px(7, 3, '#ffd5a0'),
  // Neck
  px(4, 4, '#ffd5a0'),
  // Body (fancy)
  px(2, 5, '#e44'), px(3, 5, '#f66'), px(4, 5, '#f66'), px(5, 5, '#f66'), px(6, 5, '#e44'),
  px(1, 6, '#e44'), px(2, 6, '#f66'), px(3, 6, '#f66'), px(4, 6, '#ff0'), px(5, 6, '#f66'), px(6, 6, '#f66'), px(7, 6, '#e44'),
  px(2, 7, '#e44'), px(3, 7, '#f66'), px(4, 7, '#f66'), px(5, 7, '#f66'), px(6, 7, '#e44'),
  // Arms
  px(0, 5, '#ffd5a0'), px(0, 6, '#ffd5a0'), px(8, 5, '#ffd5a0'), px(8, 6, '#ffd5a0'),
  // Legs
  px(2, 8, '#445'), px(3, 8, '#445'), px(5, 8, '#445'), px(6, 8, '#445'),
  px(2, 9, '#333'), px(3, 9, '#333'), px(5, 9, '#333'), px(6, 9, '#333'),
].join(',')

export const sprites: Record<LifecycleStage, SpriteDefinition> = {
  egg: { stage: 'egg', width: 9, height: 7, pixels: eggPixels, color: '#ffd' },
  baby: { stage: 'baby', width: 9, height: 6, pixels: babyPixels, color: '#ffb7c5' },
  child: { stage: 'child', width: 9, height: 7, pixels: childPixels, color: '#7ec8e3' },
  teen: { stage: 'teen', width: 9, height: 9, pixels: teenPixels, color: '#4a9' },
  adult: { stage: 'adult', width: 9, height: 10, pixels: adultPixels, color: '#e44' },
}

export const PIXEL_SIZE = P

export const stageTimings: Record<LifecycleStage, number> = {
  egg: 5 * 60 * 1000,       // 5 minutes
  baby: 30 * 60 * 1000,     // 30 minutes
  child: 2 * 60 * 60 * 1000, // 2 hours
  teen: 4 * 60 * 60 * 1000,  // 4 hours
  adult: Infinity,
}
