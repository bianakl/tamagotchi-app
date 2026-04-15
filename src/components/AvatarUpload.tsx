import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { playSfx } from '../engine/sound'

export default function AvatarUpload() {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const setAvatar = useGameStore(s => s.setAvatar)
  const setScreen = useGameStore(s => s.setScreen)

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
          playSfx('achievement')
          setUploading(false)
          return
        }
      } catch { /* fallback */ }
      const url = await pixelate(file)
      setPreview(url)
      setAvatar(url)
      playSfx('correct')
    } catch { /* ignore */ } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-5">
      <div className="text-5xl">📸</div>
      <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px' }}>Change Avatar</h2>

      {preview && (
        <img src={preview} alt="Avatar" className="pixel-render w-24 h-24 rounded-xl" />
      )}

      <label
        className="btn-physical px-6 py-3 rounded-xl cursor-pointer"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.08)' }}
      >
        {uploading ? 'Processing...' : '📁 Choose Photo'}
        <input type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </label>

      <button
        onClick={() => { playSfx('click'); setScreen('main') }}
        className="btn-physical px-6 py-3 rounded-xl"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.08)' }}
      >
        ← Back
      </button>
    </div>
  )
}

function pixelate(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = 32; c.height = 32
      const ctx = c.getContext('2d')!
      ctx.imageSmoothingEnabled = false
      ctx.drawImage(img, 0, 0, 32, 32)
      const d = ctx.getImageData(0, 0, 32, 32)
      for (let i = 0; i < d.data.length; i += 4) {
        d.data[i] = Math.round(d.data[i] / 32) * 32
        d.data[i+1] = Math.round(d.data[i+1] / 32) * 32
        d.data[i+2] = Math.round(d.data[i+2] / 32) * 32
      }
      ctx.putImageData(d, 0, 0)
      resolve(c.toDataURL('image/png'))
    }
    img.src = URL.createObjectURL(file)
  })
}
