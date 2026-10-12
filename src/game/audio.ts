// ============================================
// CLARK: NIGHT RUN — Bruitages & ambiances
//
// Tout est synthétisé en temps réel avec WebAudio : pas de fichier audio,
// le HTML unique reste autonome. Les navigateurs exigent un geste de
// l'utilisateur avant de jouer du son — `resumeOnFirstGesture` s'en charge.
// ============================================

let ctx: AudioContext | null = null
let musicTimer: number | null = null
let musicGain: GainNode | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

function resumeOnFirstGesture() {
  window.addEventListener(
    'pointerdown',
    () => {
      ctx?.resume().catch(() => {})
    },
    { once: true }
  )
}

export function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15) {
  const c = getCtx()
  if (!c) return
  resumeOnFirstGesture()
  if (c.state === 'suspended') c.resume().catch(() => {})
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  osc.connect(gain).connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + duration)
}

export function playClick() {
  playTone(880, 0.06, 'square', 0.06)
}

export function playShot() {
  // Bruit de coup de feu sec.
  playTone(1800, 0.04, 'square', 0.25)
  setTimeout(() => playTone(320, 0.09, 'square', 0.2), 30)
  setTimeout(() => playTone(120, 0.12, 'sawtooth', 0.15), 60)
}

export function playWin() {
  playTone(523, 0.12, 'triangle', 0.15)
  setTimeout(() => playTone(659, 0.12, 'triangle', 0.15), 120)
  setTimeout(() => playTone(784, 0.25, 'triangle', 0.15), 240)
}

export function playSiren(durationMs = 1600) {
  const c = getCtx()
  if (!c) return
  resumeOnFirstGesture()
  if (c.state === 'suspended') c.resume().catch(() => {})
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sawtooth'
  gain.gain.value = 0.08
  let hi = true
  const whoop = window.setInterval(() => {
    osc.frequency.value = hi ? 1150 : 750
    hi = !hi
  }, 320)
  osc.connect(gain).connect(c.destination)
  osc.start()
  window.setTimeout(() => {
    window.clearInterval(whoop)
    osc.stop()
    gain.disconnect()
  }, durationMs)
}

export function startMenuMusic() {
  const c = getCtx()
  if (!c || musicTimer !== null) return
  resumeOnFirstGesture()
  if (c.state === 'suspended') c.resume().catch(() => {})
  musicGain = c.createGain()
  musicGain.gain.value = 0.05
  musicGain.connect(c.destination)

  // Basses alternées sombres — le thème « night run » version rétro.
  const notes = [55, 55, 65.4, 49, 55, 82.4]
  let i = 0
  musicTimer = window.setInterval(() => {
    if (!c || !musicGain) return
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = 'sawtooth'
    osc.frequency.value = notes[i % notes.length]
    g.gain.setValueAtTime(0.5, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.4)
    osc.connect(g).connect(musicGain)
    osc.start()
    osc.stop(c.currentTime + 1.5)
    i++
  }, 750)
}

export function stopMenuMusic() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer)
    musicTimer = null
  }
  if (musicGain) {
    musicGain.disconnect()
    musicGain = null
  }
}
