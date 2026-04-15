import { useGameStore } from '../store/gameStore'
import { useGoogleFit } from '../hooks/useGoogleFit'
import { playSfx } from '../engine/sound'

export default function HealthSync() {
  const { connect, loading, error, connected } = useGoogleFit()
  const healthSync = useGameStore(s => s.healthSync)
  const setScreen = useGameStore(s => s.setScreen)

  return (
    <div className="flex flex-col h-full px-4 py-3 gap-4">
      {/* Header */}
      <div className="flex justify-between items-center" style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px' }}>
        <span>❤️ Health</span>
        <button onClick={() => { playSfx('click'); setScreen('main') }} className="opacity-50 text-lg">✕</button>
      </div>

      {!connected ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <div className="text-5xl">🏃</div>
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', textAlign: 'center', lineHeight: 2 }}>
            Connect Google Fit to boost your pet!
          </p>
          <div className="rounded-xl p-3 w-full" style={{ backgroundColor: 'rgba(0,0,0,0.04)', fontFamily: 'var(--font-pixel)', fontSize: '8px', lineHeight: 2.2 }}>
            <p>👟 Steps → Health & Energy</p>
            <p>😴 Sleep → Energy</p>
            <p>🏃 Activity → Happiness</p>
            <p>❤️ Heart pts → All stats</p>
          </div>
          <button
            onClick={() => { playSfx('click'); connect() }}
            disabled={loading}
            className="btn-physical px-6 py-3 rounded-xl w-full"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.08)' }}
          >
            {loading ? 'Connecting...' : '🔗 Connect Google Fit'}
          </button>
          {error && <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', color: '#f87171' }}>{error}</p>}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}>
            <span className="text-green-500 text-lg">●</span> Connected
          </div>
          {healthSync.fitData && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Steps', value: healthSync.fitData.steps.toLocaleString(), emoji: '👟' },
                { label: 'Sleep', value: `${healthSync.fitData.sleepHours}h`, emoji: '😴' },
                { label: 'Active', value: `${healthSync.fitData.activeMinutes}m`, emoji: '🏃' },
                { label: 'Heart Pts', value: String(healthSync.fitData.heartPoints), emoji: '❤️' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl flex items-center gap-2"
                  style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', opacity: 0.5 }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {healthSync.lastSync && (
            <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '7px', opacity: 0.4, textAlign: 'center' }}>
              Synced: {new Date(healthSync.lastSync).toLocaleTimeString()}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
