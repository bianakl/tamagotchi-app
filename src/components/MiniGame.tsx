import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { playSfx } from '../engine/sound'

type GameType = 'memory' | 'catch' | 'rhythm' | null

export default function MiniGame() {
  const [game, setGame] = useState<GameType>(null)
  const setScreen = useGameStore(s => s.setScreen)

  if (game === 'memory') return <MemoryMatch onBack={() => setGame(null)} />
  if (game === 'catch') return <CatchStars onBack={() => setGame(null)} />
  if (game === 'rhythm') return <RhythmTap onBack={() => setGame(null)} />

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-5">
      <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px' }}>Mini-Games</h2>
      <div className="flex flex-col gap-3 w-full max-w-[260px]">
        {[
          { id: 'memory' as const, emoji: '🃏', name: 'Memory Match' },
          { id: 'catch' as const, emoji: '⭐', name: 'Catch Stars' },
          { id: 'rhythm' as const, emoji: '🎵', name: 'Rhythm Tap' },
        ].map(g => (
          <button
            key={g.id}
            onClick={() => { playSfx('click'); setGame(g.id) }}
            className="btn-physical px-5 py-4 rounded-2xl flex items-center gap-3"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', backgroundColor: 'rgba(0,0,0,0.06)' }}
          >
            <span className="text-2xl">{g.emoji}</span> {g.name}
          </button>
        ))}
      </div>
      <button
        onClick={() => { playSfx('click'); setScreen('main') }}
        className="btn-physical px-5 py-2 rounded-xl mt-1"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', backgroundColor: 'rgba(0,0,0,0.06)' }}
      >
        ← Back
      </button>
    </div>
  )
}

// --- MEMORY MATCH ---
const CARD_EMOJIS = ['🌟', '🎈', '🍕', '🌈', '🦄', '🎸', '🍦', '🌺']

function MemoryMatch({ onBack }: { onBack: () => void }) {
  const addScore = useGameStore(s => s.addMiniGameScore)
  const [cards, setCards] = useState<{ emoji: string; flipped: boolean; matched: boolean }[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const deck = [...CARD_EMOJIS, ...CARD_EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map(emoji => ({ emoji, flipped: false, matched: false }))
    setCards(deck)
  }, [])

  const handleFlip = (index: number) => {
    if (selected.length >= 2 || cards[index].flipped || cards[index].matched) return
    playSfx('click')

    const next = [...cards]
    next[index].flipped = true
    setCards(next)
    const newSel = [...selected, index]
    setSelected(newSel)

    if (newSel.length === 2) {
      setMoves(m => m + 1)
      const [a, b] = newSel
      if (next[a].emoji === next[b].emoji) {
        playSfx('correct')
        next[a].matched = true
        next[b].matched = true
        setCards([...next])
        setSelected([])
        if (next.every(c => c.matched)) {
          const score = Math.max(10, 100 - moves * 5)
          addScore('memory', score)
          playSfx('achievement')
          setDone(true)
        }
      } else {
        playSfx('wrong')
        setTimeout(() => {
          next[a].flipped = false
          next[b].flipped = false
          setCards([...next])
          setSelected([])
        }, 700)
      }
    }
  }

  if (done) return <GameOverScreen title="Memory Match" score={Math.max(10, 100 - moves * 5)} onBack={onBack} />

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-3">
      <div className="flex justify-between w-full px-1" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}>
        <span>🃏 Memory</span>
        <span>Moves: {moves}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, i) => (
          <motion.button
            key={i}
            onClick={() => handleFlip(i)}
            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl"
            style={{
              backgroundColor: card.matched ? 'rgba(52,211,153,0.2)' : card.flipped ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.12)',
            }}
            whileTap={{ scale: 0.9 }}
            animate={card.matched ? { scale: [1, 1.1, 1] } : {}}
          >
            {card.flipped || card.matched ? card.emoji : '❓'}
          </motion.button>
        ))}
      </div>
      <button onClick={onBack} style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px' }} className="mt-1 opacity-50">
        ← Quit
      </button>
    </div>
  )
}

// --- CATCH THE STARS ---
function CatchStars({ onBack }: { onBack: () => void }) {
  const addScore = useGameStore(s => s.addMiniGameScore)
  const [stars, setStars] = useState<{ id: number; x: number; y: number }[]>([])
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [done, setDone] = useState(false)
  const nextId = useRef(0)

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => {
      setStars(prev => {
        const updated = prev
          .map(s => ({ ...s, y: s.y + 2.5 }))
          .filter(s => {
            if (s.y > 95) {
              setMisses(m => { const n = m + 1; if (n >= 3) setDone(true); return n })
              return false
            }
            return true
          })
        if (Math.random() < 0.25) {
          updated.push({ id: nextId.current++, x: Math.random() * 75 + 10, y: 0 })
        }
        return updated
      })
    }, 100)
    return () => clearInterval(interval)
  }, [done])

  useEffect(() => {
    if (done && score > 0) addScore('catch', score)
  }, [done, score, addScore])

  const catchStar = (id: number) => {
    playSfx('catch')
    setStars(prev => prev.filter(s => s.id !== id))
    setScore(s => s + 10)
  }

  if (done) return <GameOverScreen title="Catch Stars" score={score} onBack={onBack} />

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between px-4 py-2" style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px' }}>
        <span>⭐ {score}</span>
        <span style={{ color: misses >= 2 ? '#f87171' : undefined }}>❌ {misses}/3</span>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {stars.map(star => (
          <motion.button
            key={star.id}
            onClick={() => catchStar(star.id)}
            className="absolute text-2xl"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            whileTap={{ scale: 1.5 }}
          >
            ⭐
          </motion.button>
        ))}
      </div>
      <button onClick={() => setDone(true)} className="text-center py-2 opacity-50" style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>
        ← Quit
      </button>
    </div>
  )
}

// --- RHYTHM TAP ---
function RhythmTap({ onBack }: { onBack: () => void }) {
  const addScore = useGameStore(s => s.addMiniGameScore)
  const [circles, setCircles] = useState<{ id: number; scale: number; active: boolean }[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [round, setRound] = useState(0)
  const [done, setDone] = useState(false)
  const nextId = useRef(0)
  const MAX_ROUNDS = 16

  useEffect(() => {
    if (done || round >= MAX_ROUNDS) {
      if (!done) { setDone(true); addScore('rhythm', score) }
      return
    }
    const timeout = setTimeout(() => {
      const id = nextId.current++
      setCircles([{ id, scale: 0, active: true }])
      setTimeout(() => {
        setCircles(prev => {
          const c = prev.find(x => x.id === id)
          if (c?.active) { setCombo(0); setRound(r => r + 1) }
          return prev.filter(x => x.id !== id)
        })
      }, 1200)
    }, 800 + Math.random() * 400)
    return () => clearTimeout(timeout)
  }, [round, done, score, addScore])

  useEffect(() => {
    if (circles.length === 0) return
    const interval = setInterval(() => {
      setCircles(prev => prev.map(c => ({ ...c, scale: Math.min(c.scale + 0.05, 1) })))
    }, 30)
    return () => clearInterval(interval)
  }, [circles.length])

  const tap = (id: number) => {
    const circle = circles.find(c => c.id === id)
    if (!circle?.active) return
    const perfect = circle.scale >= 0.7 && circle.scale <= 0.95
    playSfx(perfect ? 'perfect' : 'correct')
    setScore(s => s + (perfect ? 10 * (combo + 1) : 5))
    setCombo(c => c + 1)
    setCircles(prev => prev.filter(c => c.id !== id))
    setRound(r => r + 1)
  }

  if (done) return <GameOverScreen title="Rhythm Tap" score={score} onBack={onBack} />

  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="flex justify-between w-full px-4" style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px' }}>
        <span>🎵 {score}</span>
        <span className={combo > 2 ? 'text-amber-500' : ''}>🔥 x{combo}</span>
        <span>{round}/{MAX_ROUNDS}</span>
      </div>
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute w-28 h-28 rounded-full border-3 border-current opacity-15" />
        {circles.map(c => (
          <motion.button
            key={c.id}
            onClick={() => tap(c.id)}
            className="absolute rounded-full"
            style={{
              width: c.scale * 112,
              height: c.scale * 112,
              backgroundColor: c.scale >= 0.7 && c.scale <= 0.95 ? 'rgba(52,211,153,0.35)' : 'rgba(0,0,0,0.1)',
              border: '3px solid currentColor',
            }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
      <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '8px', opacity: 0.5 }}>
        Tap when green!
      </p>
      <button onClick={() => { setDone(true); addScore('rhythm', score) }} className="opacity-50" style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>
        ← Quit
      </button>
    </div>
  )
}

// --- GAME OVER ---
function GameOverScreen({ title, score, onBack }: { title: string; score: number; onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center h-full gap-4"
    >
      <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="text-5xl">
        🎉
      </motion.div>
      <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px' }}>{title}</h3>
      <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '22px' }}>{score} pts</p>
      <p style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px', opacity: 0.5 }}>
        +{Math.floor(score / 2)} happiness
      </p>
      <button
        onClick={() => { playSfx('click'); onBack() }}
        className="btn-physical px-6 py-3 rounded-xl"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', backgroundColor: 'rgba(0,0,0,0.08)' }}
      >
        Done
      </button>
    </motion.div>
  )
}
