// 8-bit sound synthesis using Web Audio API — no external files needed
let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.15) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, c.currentTime)
    gain.gain.setValueAtTime(volume, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    osc.connect(gain)
    gain.connect(c.destination)
    osc.start()
    osc.stop(c.currentTime + duration)
  } catch {
    // audio not available
  }
}

function playNotes(notes: [number, number][], type: OscillatorType = 'square', volume = 0.12) {
  try {
    const c = getCtx()
    notes.forEach(([freq, delay]) => {
      setTimeout(() => {
        const osc = c.createOscillator()
        const gain = c.createGain()
        osc.type = type
        osc.frequency.setValueAtTime(freq, c.currentTime)
        gain.gain.setValueAtTime(volume, c.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15)
        osc.connect(gain)
        gain.connect(c.destination)
        osc.start()
        osc.stop(c.currentTime + 0.15)
      }, delay)
    })
  } catch {
    // audio not available
  }
}

export const SFX = {
  // UI navigation click
  click: () => playTone(800, 0.06, 'square', 0.08),

  // Feed action — happy rising tones
  feed: () => playNotes([
    [523, 0], [659, 80], [784, 160],
  ], 'square', 0.1),

  // Play action — bouncy melody
  play: () => playNotes([
    [784, 0], [988, 100], [784, 200], [1175, 300],
  ], 'square', 0.1),

  // Clean — sparkle sweep
  clean: () => playNotes([
    [1200, 0], [1400, 60], [1600, 120], [1800, 180],
  ], 'sine', 0.08),

  // Sleep — gentle low descending
  sleep: () => playNotes([
    [440, 0], [392, 200], [349, 400], [330, 600],
  ], 'sine', 0.08),

  // Heal — warm ascending
  heal: () => playNotes([
    [440, 0], [554, 120], [659, 240], [880, 360],
  ], 'triangle', 0.1),

  // Achievement unlock — triumphant fanfare
  achievement: () => playNotes([
    [523, 0], [659, 100], [784, 200], [1047, 350],
    [784, 500], [1047, 600],
  ], 'square', 0.12),

  // Evolution — magical ascending
  evolve: () => playNotes([
    [262, 0], [330, 100], [392, 200], [523, 300],
    [659, 400], [784, 500], [1047, 650],
  ], 'triangle', 0.12),

  // Death — sad descending
  death: () => playNotes([
    [523, 0], [494, 200], [440, 400], [392, 600],
    [349, 800], [262, 1000],
  ], 'sine', 0.1),

  // Button press
  button: () => playTone(600, 0.04, 'square', 0.06),

  // Error / warning
  warn: () => playNotes([
    [200, 0], [180, 150],
  ], 'sawtooth', 0.08),

  // Mini-game correct
  correct: () => playNotes([
    [880, 0], [1100, 80],
  ], 'square', 0.08),

  // Mini-game wrong
  wrong: () => playTone(150, 0.3, 'sawtooth', 0.08),

  // Star catch
  catch: () => playTone(1200, 0.08, 'sine', 0.1),

  // Rhythm perfect hit
  perfect: () => playNotes([
    [1047, 0], [1319, 60],
  ], 'triangle', 0.1),
}

export function playSfx(sound: keyof typeof SFX) {
  // Check if sound is enabled via store (import lazily to avoid circular deps)
  try {
    const saved = localStorage.getItem('tamagotchi-save')
    if (saved) {
      const data = JSON.parse(saved)
      if (data.settings?.soundOn === false) return
    }
  } catch {
    // play anyway
  }
  SFX[sound]()
}
