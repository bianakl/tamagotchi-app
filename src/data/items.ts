export interface FoodItem {
  id: string
  name: string
  emoji: string
  hunger: number
  happiness: number
  health: number
  energy: number
}

export interface ToyItem {
  id: string
  name: string
  emoji: string
  happiness: number
  energy: number
  discipline: number
}

export interface MedicineItem {
  id: string
  name: string
  emoji: string
  health: number
  curesSickness: boolean
}

export const foods: FoodItem[] = [
  { id: 'apple', name: 'Apple', emoji: '🍎', hunger: 15, happiness: 5, health: 10, energy: 5 },
  { id: 'burger', name: 'Burger', emoji: '🍔', hunger: 30, happiness: 15, health: -5, energy: 10 },
  { id: 'cake', name: 'Cake', emoji: '🍰', hunger: 20, happiness: 25, health: -10, energy: 15 },
  { id: 'salad', name: 'Salad', emoji: '🥗', hunger: 10, happiness: 0, health: 20, energy: 5 },
]

export const toys: ToyItem[] = [
  { id: 'ball', name: 'Ball', emoji: '⚽', happiness: 20, energy: -10, discipline: 5 },
  { id: 'music', name: 'Music', emoji: '🎵', happiness: 15, energy: 5, discipline: 0 },
  { id: 'dance', name: 'Dance', emoji: '💃', happiness: 25, energy: -15, discipline: 10 },
]

export const medicines: MedicineItem[] = [
  { id: 'pill', name: 'Pill', emoji: '💊', health: 30, curesSickness: true },
  { id: 'bandage', name: 'Bandage', emoji: '🩹', health: 15, curesSickness: false },
]
