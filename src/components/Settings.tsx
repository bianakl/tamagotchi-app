import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { themes, skins } from '../data/themes'
import { clearSave } from '../hooks/usePersistence'
import { playSfx } from '../engine/sound'

export default function Settings() {
  const settings = useGameStore(s => s.settings)
  const setTheme = useGameStore(s => s.setTheme)
  const setSkin = useGameStore(s => s.setSkin)
  const toggleSound = useGameStore(s => s.toggleSound)
  const resetPet = useGameStore(s => s.resetPet)
  const setScreen = useGameStore(s => s.setScreen)
  const getSerializable = useGameStore(s => s.getSerializable)
  const loadState = useGameStore(s => s.loadState)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleExport = () => {
    const data = getSerializable()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tamagotchi-save.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try { loadState(JSON.parse(reader.result as string)) } catch { /* invalid */ }
    }
    reader.readAsText(file)
  }

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); playSfx('warn'); return }
    clearSave()
    resetPet()
    setConfirmReset(false)
  }

  const heading = { fontFamily: 'var(--font-pixel)', fontSize: '11px' } as const
  const label = { fontFamily: 'var(--font-pixel)', fontSize: '9px' } as const
  const sublabel = { fontFamily: 'var(--font-pixel)', fontSize: '8px', opacity: 0.5 } as const

  return (
    <div className="flex flex-col h-full px-4 py-3 overflow-y-auto scroll-area gap-4">
      {/* Header */}
      <div className="flex justify-between items-center" style={heading}>
        <span>⚙️ Settings</span>
        <button onClick={() => { playSfx('click'); setScreen('main') }} className="opacity-50 text-lg">✕</button>
      </div>

      {/* Themes */}
      <div>
        <p style={sublabel} className="mb-2">Theme</p>
        <div className="flex flex-wrap gap-2">
          {themes.map(t => (
            <button
              key={t.id}
              onClick={() => { playSfx('click'); setTheme(t.id) }}
              className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 min-w-[56px] ${
                settings.themeId === t.id ? 'border-current' : 'border-transparent'
              }`}
              style={{ backgroundColor: t.shell }}
            >
              <div className="w-6 h-6 rounded-md" style={{ backgroundColor: t.screenBg, border: `1px solid ${t.accent}` }} />
              <span style={{ color: t.textColor, fontFamily: 'var(--font-pixel)', fontSize: '6px' }}>
                {t.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Skins */}
      <div>
        <p style={sublabel} className="mb-2">Shell</p>
        <div className="flex flex-wrap gap-2">
          {skins.map(s => (
            <button
              key={s.id}
              onClick={() => { playSfx('click'); setSkin(s.id) }}
              className={`px-3 py-2 rounded-xl ${settings.skinId === s.id ? 'ring-2 ring-current' : ''}`}
              style={{ ...label, backgroundColor: 'rgba(0,0,0,0.06)' }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sound */}
      <div className="flex items-center justify-between">
        <span style={label}>Sound</span>
        <button
          onClick={() => { toggleSound(); playSfx('click') }}
          className="px-4 py-2 rounded-xl"
          style={{ ...label, backgroundColor: 'rgba(0,0,0,0.06)' }}
        >
          {settings.soundOn ? '🔊 On' : '🔇 Off'}
        </button>
      </div>

      {/* Export / Import */}
      <div className="flex gap-3">
        <button onClick={handleExport}
          className="flex-1 btn-physical px-3 py-2.5 rounded-xl"
          style={{ ...label, backgroundColor: 'rgba(0,0,0,0.06)' }}
        >
          📤 Export
        </button>
        <label
          className="flex-1 btn-physical px-3 py-2.5 rounded-xl text-center cursor-pointer"
          style={{ ...label, backgroundColor: 'rgba(0,0,0,0.06)' }}
        >
          📥 Import
          <input type="file" accept=".json" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleImport(f) }}
          />
        </label>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="btn-physical px-4 py-3 rounded-xl"
        style={{
          ...label,
          backgroundColor: confirmReset ? '#ef4444' : 'rgba(0,0,0,0.06)',
          color: confirmReset ? '#fff' : undefined,
        }}
      >
        {confirmReset ? '⚠️ Tap again to reset' : '🔄 Reset Pet'}
      </button>
    </div>
  )
}
