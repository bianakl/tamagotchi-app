import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { playSfx } from '../engine/sound'

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const setNameStore = useGameStore(s => s.setName)
  const setScreen = useGameStore(s => s.setScreen)

  const finish = () => {
    playSfx('evolve')
    setNameStore(name || 'Tama')
    setScreen('main')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-5">
      {step === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -5, 0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl"
          >
            🥚
          </motion.div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', lineHeight: 1.6 }}>
            TamaGotchi 2.0
          </h2>
          <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', opacity: 0.6, lineHeight: 2 }}>
            Your AI-powered digital pet awaits!
          </p>
          <button
            onClick={() => { playSfx('click'); setStep(1) }}
            className="btn-physical px-8 py-3 rounded-2xl"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', backgroundColor: 'rgba(0,0,0,0.1)' }}
          >
            Start
          </button>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <div className="text-5xl">✨</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px' }}>
            Name your pet
          </h2>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Tama"
            maxLength={12}
            className="px-5 py-3 rounded-xl text-center bg-transparent border-2 border-current outline-none w-[220px]"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px' }}
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => { playSfx('click'); setStep(2) }}
              className="btn-physical px-5 py-3 rounded-xl"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.1)' }}
            >
              📸 Avatar
            </button>
            <button
              onClick={finish}
              className="btn-physical px-5 py-3 rounded-xl"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.1)' }}
            >
              Let's go! →
            </button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5 text-center"
        >
          <AvatarUploadInline onDone={finish} />
        </motion.div>
      )}
    </div>
  )
}

function AvatarUploadInline({ onDone }: { onDone: () => void }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const setAvatar = useGameStore(s => s.setAvatar)

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      try {
        const res = await fetch('/api/generate-avatar', { method: 'POST', body: formData })
        if (res.ok) {
          const { url } = await res.json()
          setPreview(url)
          setAvatar(url)
          setUploading(false)
          return
        }
      } catch { /* fallback */ }
      const url = await pixelateImage(file)
      setPreview(url)
      setAvatar(url)
    } catch { /* ignore */ } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="text-5xl">📸</div>
      <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px' }}>Upload a photo</h2>
      <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', opacity: 0.6, lineHeight: 2 }}>
        We'll pixelate it into your pet!
      </p>

      {preview ? (
        <img src={preview} alt="Avatar preview" className="pixel-render w-24 h-24 rounded-xl" />
      ) : (
        <label
          className="btn-physical px-6 py-3 rounded-xl cursor-pointer"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
          {uploading ? 'Processing...' : 'Choose Photo'}
          <input type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </label>
      )}

      <button
        onClick={onDone}
        className="btn-physical px-6 py-3 rounded-xl"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', backgroundColor: 'rgba(0,0,0,0.1)' }}
      >
        {preview ? 'Continue →' : 'Skip →'}
      </button>
    </>
  )
}

async function pixelateImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 32; canvas.height = 32
      const ctx = canvas.getContext('2d')!
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(img, 0, 0, 32, 32)
      const d = ctx.getImageData(0, 0, 32, 32)
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i] = Math.round(d.data[i] / 32) * 32
        d.data[i+1] = Math.round(d.data[i+1] / 32) * 32
        d.data[i+2] = Math.round(d.data[i+2] / 32) * 32
      }
      ctx.putImageData(d, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = URL.createObjectURL(file)
  })
}
