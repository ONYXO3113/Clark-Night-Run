import React, { useEffect, useRef, useState } from 'react'
import { playSiren, playWin, playShot } from '../game/audio'

interface ShootingGameProps {
  onWin: () => void
  onLose: () => void
}

interface Cop {
  id: number
  x: number
  progress: number
  speed: number
}

const SURVIVE_MS = 20000
const TICK_MS = 50

export const ShootingGame: React.FC<ShootingGameProps> = ({ onWin, onLose }) => {
  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro')
  const [cops, setCops] = useState<Cop[]>([])
  const [hits, setHits] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [shotAt, setShotAt] = useState(0)
  const [deadCops, setDeadCops] = useState<{ id: number; x: number; topPct: number; size: number }[]>([])

  const nextId = useRef(0)
  const spawnIn = useRef(1200)
  const fired = useRef(false)

  useEffect(() => {
    if (phase !== 'play') return

    const startedAt = Date.now()
    const interval = window.setInterval(() => {
      const now = Date.now() - startedAt
      setElapsed(now)

      if (now >= SURVIVE_MS) {
        window.clearInterval(interval)
        setPhase('done')
        if (!fired.current) {
          fired.current = true
          playWin()
          onWin()
        }
        return
      }

      setCops((prev) => {
        // Avancer les policiers vers le joueur
        const advanced = prev.map((c) => ({
          ...c,
          progress: c.progress + c.speed * (TICK_MS / 1000),
        }))

        // Un policier a atteint le joueur => perdu
        if (advanced.some((c) => c.progress >= 1)) {
          window.clearInterval(interval)
          setPhase('done')
          if (!fired.current) {
            fired.current = true
            playSiren()
            onLose()
          }
          return advanced
        }

        const moved = advanced

        // Faire apparaître de nouveaux policiers, de plus en plus vite
        spawnIn.current -= TICK_MS
        if (spawnIn.current <= 0) {
          const difficulty = Math.min(1, now / SURVIVE_MS)
          spawnIn.current = 1300 - difficulty * 950
          moved.push({
            id: nextId.current++,
            x: 15 + Math.random() * 70,
            progress: 0,
            speed: 0.10 + difficulty * 0.20 + Math.random() * 0.06,
          })
        }

        return moved
      })
    }, TICK_MS)

    return () => window.clearInterval(interval)
  }, [phase, onWin, onLose])

  const hit = (id: number) => {
    const cop = cops.find((c) => c.id === id)
    setCops((prev) => prev.filter((c) => c.id !== id))
    setHits((h) => h + 1)
    setShotAt(Date.now())
    playShot()
    if (cop) {
      setDeadCops((prev) => [
        ...prev.slice(-7),
        { id: cop.id, x: cop.x, topPct: 35 + cop.progress * 45, size: 34 + cop.progress * 70 },
      ])
    }
  }

  const fire = () => {
    setShotAt(Date.now())
    playShot()
  }

  if (phase === 'intro') {
    return (
      <div className="shooting-panel">
        <p className="shooting-intro">
          Clark est bloqué par la police. Panique : il sort un pistolet.
          <br />
          <strong>Clique sur la tête des policiers</strong> avant qu'ils t'atteignent,
          et tiens bon {SURVIVE_MS / 1000} secondes !
        </p>
        <button type="button" className="btn btn-primary" onClick={() => setPhase('play')}>
          🔫 OUVRIR LE FEU
        </button>
      </div>
    )
  }

  const flash = Date.now() - shotAt < 120

  return (
    <div className="shooting-stage" onClick={fire}>
      <div className="shooting-lights red" />
      <div className="shooting-lights blue" />
      <div className="shooting-hud">
        <span>NEUTRALISÉS : {hits}</span>
        <span>{Math.max(0, Math.ceil((SURVIVE_MS - elapsed) / 1000))}s</span>
      </div>
      {cops.map((cop) => {
        const size = 34 + cop.progress * 70
        return (
          <button
            key={cop.id}
            type="button"
            className="shooting-cop"
            onClick={(e) => { e.stopPropagation(); hit(cop.id) }}
            style={{
              left: `${cop.x}%`,
              top: `${35 + cop.progress * 45}%`,
              width: `${size}px`,
              height: `${size}px`,
            }}
            aria-label="Policier"
          >
            <span className="shooting-cap" />
          </button>
        )
      })}
      {deadCops.map((dead) => (
        <div
          key={dead.id}
          className="shooting-dead"
          style={{ left: `${dead.x}%`, top: `${dead.topPct}%`, width: `${dead.size * 1.3}px`, height: `${dead.size * 0.4}px` }}
        >
          <div className="shooting-dead-body" />
          <div className="shooting-dead-head">
            <span className="shooting-dead-eye">✕</span>
            <span className="shooting-dead-eye">✕</span>
            <span className="shooting-dead-tongue" />
          </div>
        </div>
      ))}
      {flash && <div className="shooting-flash" />}
      <div className="shooting-gun">
        <div className="shooting-gun-barrel" />
        <div className="shooting-gun-grip" />
      </div>
    </div>
  )
}
