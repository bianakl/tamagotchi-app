export interface Theme {
  id: string
  name: string
  shell: string
  shellBorder: string
  screenBg: string
  screenTint: string
  accent: string
  textColor: string
  buttonBg: string
  buttonText: string
}

export const themes: Theme[] = [
  {
    id: 'classic',
    name: 'Classic Green',
    shell: '#d4c9a8',
    shellBorder: '#b5a67e',
    screenBg: '#c8de6a',
    screenTint: 'rgba(155, 188, 15, 0.08)',
    accent: '#2d4a1e',
    textColor: '#1a2e10',
    buttonBg: '#f5f0e0',
    buttonText: '#2d4a1e',
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    shell: '#e0c8ef',
    shellBorder: '#c09ed5',
    screenBg: '#f7f0ff',
    screenTint: 'rgba(200, 160, 230, 0.08)',
    accent: '#7c3aed',
    textColor: '#3b1970',
    buttonBg: '#fff',
    buttonText: '#5b21b6',
  },
  {
    id: 'ocean',
    name: 'Ocean Wave',
    shell: '#a8cce0',
    shellBorder: '#72aac8',
    screenBg: '#eaf6ff',
    screenTint: 'rgba(100, 180, 220, 0.08)',
    accent: '#0e7490',
    textColor: '#0c4a5e',
    buttonBg: '#fff',
    buttonText: '#0e7490',
  },
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    shell: '#f0b88a',
    shellBorder: '#d99060',
    screenBg: '#fff7f0',
    screenTint: 'rgba(245, 158, 80, 0.08)',
    accent: '#c2410c',
    textColor: '#6c2710',
    buttonBg: '#fff',
    buttonText: '#c2410c',
  },
  {
    id: 'midnight',
    name: 'Midnight Mode',
    shell: '#282840',
    shellBorder: '#1a1a30',
    screenBg: '#151525',
    screenTint: 'rgba(100, 50, 200, 0.05)',
    accent: '#a78bfa',
    textColor: '#d4d0f0',
    buttonBg: '#252540',
    buttonText: '#c4b5fd',
  },
]

export const skins = [
  { id: 'classic', name: 'Classic Egg', borderRadius: '45% 45% 42% 42%' },
  { id: 'y2k', name: 'Y2K Bubble', borderRadius: '50%' },
  { id: 'cyberpunk', name: 'Cyberpunk', borderRadius: '8px' },
  { id: 'cottagecore', name: 'Cottagecore', borderRadius: '40% 40% 35% 35%' },
  { id: 'minimal', name: 'Minimal Clean', borderRadius: '24px' },
] as const

export type SkinId = typeof skins[number]['id']
