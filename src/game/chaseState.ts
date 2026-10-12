import { VehicleId, VehicleStats } from '../types'
import { vehicles } from '../data/vehicles'
import { chaseEvents, CHASE_WIN_STEP, CHASE_WIN_MAX_DAMAGE, CHASE_WIN_MAX_PURSUIT } from '../data/chase'
import { ChaseState, ChaseChoice, ChaseEvent, ChaseEffects, ChaseOutcome, ChaseDifficulty } from './chaseTypes'

// ============================================
// CLARK: NIGHT RUN — Moteur du mode POURSUITE
// ============================================

const START_SPEED = 110

export function createChaseState(vehicle: VehicleId, difficulty: ChaseDifficulty = 'difficile'): ChaseState {
  return {
    vehicle,
    difficulty,
    step: 0,
    distance: 0,
    speed: START_SPEED,
    pursuit: 8,
    damage: 0,
    fuel: difficulty === 'impossible' ? 70 : difficulty === 'difficile' ? 80 : 100,
    luckyEscapes: 0,
    grazes: 0,
    lastEventId: null,
    lastChoice: null,
    over: null,
    log: [],
    won: false,
  }
}

/** Multiplicateurs d'équilibrage par difficulté. */
const DIFF_MULT = {
  facile:    { pursuit: 0.55, fuel: 0.55, damage: 0.5, passive: 0.5 },
  difficile: { pursuit: 1.0,  fuel: 1.0,  damage: 1.0, passive: 1.0 },
  impossible:{ pursuit: 1.55, fuel: 1.6,  damage: 1.35, passive: 1.45 },
} as const

export function getChaseVehicle(state: ChaseState): VehicleStats {
  return vehicles[state.vehicle]?.stats ?? vehicles.porsche.stats
}

/**
 * Une option est jouable si la voiture possède la caractéristique requise.
 * C'est le cœur du mode : une voiture rapide ne peut pas se cacher, une voiture
 * discrète ne peut pas distancer personne en ligne droite.
 */
export function isChoiceAvailable(choice: ChaseChoice, stats: VehicleStats): boolean {
  if (!choice.requires) return true
  return stats[choice.requires.stat] >= choice.requires.min
}

/** Explication lisible quand une option est verrouillée. */
export function lockReason(choice: ChaseChoice, stats: VehicleStats): string {
  if (!choice.requires) return ''
  const stat = choice.requires.stat
  return `${stat} ${stats[stat]}/${choice.requires.min} requis`
}

// --- Réglages d'équilibrage -------------------------------------------

/** La fiabilité amortit les dégâts subis. */
const damageTaken = (amount: number, stats: VehicleStats) =>
  Math.max(0, Math.round(amount * (1 - stats.fiabilite / 26)))

/** La discrétion réduit la montée de pression de la police. */
const pursuitGain = (amount: number, stats: VehicleStats) =>
  Math.round(amount * (1 - stats.discretion / 25))

/** La vitesse convertit en distance, l'acceleration aide à reprendre. */
const distanceGain = (speed: number) => Math.max(0.4, speed / 45)

/**
 * Pression de la police qui monte toute seule, de plus en plus vite.
 * Ralentir aggrave la pression : une voiture à l'arrêt se fait rattraper.
 */
const passivePressure = (step: number, speed: number, difficulty: ChaseDifficulty) => {
  const base = (2.6 + step * 0.5) * DIFF_MULT[difficulty].passive
  const slowness = 1 + Math.max(0, (150 - speed) / 120)
  return base * slowness
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value))

export interface ChoiceResolution {
  state: ChaseState
  /** Ligne de journal générée par le choix. */
  message: string
  tone: 'good' | 'bad' | 'neutral'
}

/**
 * Applique un choix. Les effets déterministes sont toujours appliqués ; le
 * pari, s'il existe, est tiré séparément et peut tout annuler.
 */
export function resolveChoice(
  state: ChaseState,
  event: ChaseEvent,
  choice: ChaseChoice,
  random: () => number = Math.random
): ChoiceResolution {
  const stats = getChaseVehicle(state)
  const effects = { ...choice.effects }
  let message = choice.label
  let tone: 'good' | 'bad' | 'neutral' = 'neutral'
  let luckyEscape = false

  if (choice.gamble) {
    const roll = random() * 100
    const won = roll < choice.gamble.chance
    const applied = won ? choice.gamble.success : choice.gamble.fail
    for (const [key, value] of Object.entries(applied)) {
      if (value !== undefined) (effects as Record<string, number>)[key] =
        (effects as Record<string, number>)[key] ?? 0
      if (value !== undefined) (effects as Record<string, number>)[key] += value
    }
    message = won ? choice.gamble.successText : choice.gamble.failText
    tone = won ? 'good' : 'bad'
    // Une issue surviving de justesse compte comme une échappée.
    if (won && choice.gamble.chance <= 50) luckyEscape = true
  }

  const step = state.step + 1

  let speed = clamp(state.speed + (effects.speed ?? 0), 0, 260)
  let damage = clamp(state.damage + damageTaken(effects.damage ?? 0, stats) * DIFF_MULT[state.difficulty].damage, 0, 100)
  let fuel = clamp(state.fuel + (effects.fuel ?? 0) * DIFF_MULT[state.difficulty].fuel, 0, 100)
  let pursuit = clamp(
    state.pursuit + pursuitGain(effects.pursuit ?? 0, stats) * DIFF_MULT[state.difficulty].pursuit,
    0,
    100
  )

  // Une voiture abînée roule moins vite, et une voiture lente se fait
  // rattraper : c'est la spirale qui rend les dégâts coûteux au lieu
  // d'être une jauge décorative.
  speed = clamp(speed - Math.round(damage / 12), 0, 260)

  // Pression passive de la police, plus forte à chaque étape.
  pursuit = clamp(pursuit + pursuitGain(passivePressure(step, speed, state.difficulty), stats), 0, 100)

  // Consommation liée à la vitesse.
  fuel = clamp(fuel - (1.6 + speed / 55) * DIFF_MULT[state.difficulty].fuel, 0, 100)

  const distance = state.distance + distanceGain(speed)

  // Une pursuit très élevée finit toujours par se transformer en frôlement.
  let grazes = state.grazes
  if (pursuit >= 85 && random() < 0.25) grazes++

  const next: ChaseState = {
    ...state,
    step,
    distance: Math.round(distance * 10) / 10,
    speed,
    pursuit,
    damage,
    fuel,
    grazes,
    luckyEscapes: state.luckyEscapes + (luckyEscape ? 1 : 0),
    lastEventId: event.id,
    lastChoice: choice.label,
  }

  return { state: next, message, tone }
}

/** Choisit le prochain événement disponible pour l'étape donnée. */
export function pickEvent(state: ChaseState, random: () => number = Math.random): ChaseEvent {
  const step = state.step + 1
  const eligible = chaseEvents.filter((e) => e.minStep <= step)
  const fresh = eligible.filter((e) => e.id !== state.lastEventId)
  const pool = fresh.length > 0 ? fresh : eligible

  // Les événements récents (haut `minStep`) sont privilégiés : c'est ainsi que
  // la difficulté monte réellement au lieu de reboucler sur les mêmes scenes.
  const weights = pool.map((e) => 1 + e.minStep / 4)
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = random() * total

  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return pool[i]
  }
  return pool[pool.length - 1]
}

/** Petite explication contextuelle de la défaite, selon le dernier choix. */
function explainLoss(state: ChaseState, failure: 'caught' | 'wrecked' | 'empty'): string {
  const label = (state.lastChoice ?? '').toLowerCase()
  if (failure === 'caught') {
    if (/ruelle|raccourci|petite/.test(label)) return 'Pas de chances : les policiers t\'ont vu passer dans la ruelle.'
    if (/tunnel/.test(label)) return "Pas de chances : ils t'attendaient à la sortie du tunnel."
    if (/parking/.test(label)) return "Tu risques de passer quelques temps en prison j'espère que tu te feras des amis."
    if (/chemin|terre|chantier/.test(label)) return "Pas de chances : la route était bloquée derrière toi."
    return "Tu risques de passer quelques temps en prison j'espère que tu te feras des amis."
  }
  if (failure === 'wrecked') {
    if (/chantier|terre|hors/.test(label)) return "Le terrain était plus traître qu'il n'y paraissait."
    return "La voiture n'a pas tenu le coup dans la fuite."
  }
  return "Le réservoir était à sec — il n'aurait pas fallu attendre la panne."
}

/** Vérifie les conditions de fin. Retourne null si la partie continue. */
export function checkEnd(state: ChaseState): ChaseOutcome | null {
  if (state.pursuit >= 100) {
    return {
      failure: 'caught',
      success: false,
      title: 'ATTRAPÉ',
      text: "Ils t'ont eu. Les portières s'ouvrent avant même que le moteur ne Coupe. Tout ce que tu as tenu cette nuit se réduit à une plaque d'immatriculation lue à la lumière bleue.",
      hint: explainLoss(state, 'caught'),
    }
  }
  if (state.damage >= 100) {
    return {
      failure: 'wrecked',
      success: false,
      title: 'ÉPAVE',
      text: 'La voiture a fini par lâcher avant toi. Le dernier bruit que tu entends est celui de la tôle qui proteste, et tu n’entends même pas les freins.',
      hint: explainLoss(state, 'wrecked'),
    }
  }
  if (state.fuel <= 0) {
    return {
      failure: 'empty',
      success: false,
      title: 'PANNE SÈCHE',
      text: 'Plus une goutte. Tu roules au ralenti depuis deux rues, et tout le monde le voit. Le moteur s’éteint au milieu du carrefour.',
      hint: explainLoss(state, 'empty'),
    }
  }

  // La victoire : atteindre l'étape 30 quasi intact — seulement en IMPOSSIBLE.
  if (
    state.difficulty === 'impossible' &&
    state.step >= CHASE_WIN_STEP &&
    state.damage <= CHASE_WIN_MAX_DAMAGE &&
    state.pursuit <= CHASE_WIN_MAX_PURSUIT
  ) {
    return {
      failure: 'caught',
      success: true,
      title: 'RÉUSSIR L’IMPOSSIBLE',
      text: 'Personne n’y croyait. Toi, tu l’as fait. La porte du garage se referme derrière toi, le moteur refroidit enfin, et dehors les gyrophares s’éloignent sans jamais comprendre. Tu es rentré. Au prix de ta voiture, de ta nuit, et d’une chance que tu n’auras pas deux fois.',
    }
  }

  return null
}

/** Progression vers la victoire, sur 100. */
export function progressToWin(state: ChaseState): number {
  const stepPart = Math.min(1, state.step / CHASE_WIN_STEP)
  const damagePenalty = state.damage / CHASE_WIN_MAX_DAMAGE
  const pursuitPenalty = state.pursuit / CHASE_WIN_MAX_PURSUIT
  const raw = stepPart - Math.max(0, damagePenalty - 1) - Math.max(0, pursuitPenalty - 1)
  return clamp(Math.round(raw * 100), 0, 100)
}

