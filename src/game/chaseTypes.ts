import { VehicleId, VehicleStats } from '../types'

// ============================================
// CLARK: NIGHT RUN — Mode POURSUITE
// Survie sans fin face à la police.
// ============================================

/** Les six caractéristiques qui conditionnent les choix. */
export type CarStat = keyof VehicleStats

export interface ChaseRequirement {
  stat: CarStat
  min: number
}

export interface ChaseEffects {
  /** Variation de la vitesse (km/h). */
  speed?: number
  /** Variation de la pursuit (0-100). 100 = rattrapé. */
  pursuit?: number
  /** Dégâts subis. 100 = épave. */
  damage?: number
  /** Carburant. 0 = panne sèche. */
  fuel?: number
}

/**
 * Un pari. `chance` est le pourcentage de réussite ; en cas d'échec les
 * effets `fail` s'appliquent. C'est ce qui rend les dilemmes genuinely
 * risqués : en fin de partie, les choix sûrs sont verrouillés par les
 * statistiques de la voiture et il ne reste que des paris.
 */
export interface ChaseGamble {
  chance: number
  successText: string
  failText: string
  success: ChaseEffects
  fail: ChaseEffects
}

export interface ChaseChoice {
  id: string
  label: string
  detail: string
  /** Verrouillé si la caractéristique de la voiture est trop faible. */
  requires?: ChaseRequirement
  effects: ChaseEffects
  gamble?: ChaseGamble
}

export interface ChaseEvent {
  id: string
  text: string
  /** Clé de scène pour `ChaseScene`. */
  scene: string
  /** Numéro d'étape minimum pour que l'événement apparaisse. */
  minStep: number
  choices: ChaseChoice[]
}

/**
 * Comment la nuit s'est terminée.
 *
 * Il n'y a volontairement pas de « à l'arrêt » : ralentir ou se cacher est une
 * tactique légitime. Ralentir fait perdre de la distance, consommer du
 * carburant et surtout augmenter la pression de la police via `slowness` dans
 * le moteur — la police rattrape une voiture à l'arrêt, mais le joueur n'est
 * pas puni immédiatement pour avoir joué prudent.
 */
export type ChaseFailure = 'caught' | 'wrecked' | 'empty'

export interface ChaseOutcome {
  failure: ChaseFailure
  /**
   * Vrai uniquement pour « Réussir l'impossible ». Le moteur le positionne
   * lui-même : l'interface ne doit pas le deviner en comparant le titre, sinon
   * le prochain écran de fin casserait la détection silencieusement.
   */
  success: boolean
  title: string
  text: string
  /** Petite explication contextuelle affichée dans l'écran final. */
  hint?: string
}

export interface ChaseLogEntry {
  step: number
  text: string
  tone: 'good' | 'bad' | 'neutral'
}

export type ChaseDifficulty = 'facile' | 'difficile' | 'impossible'

export interface ChaseState {
  vehicle: VehicleId
  difficulty: ChaseDifficulty
  /** Étape courante, commence à 1. */
  step: number
  /** Distance parcourue en km. C'est le score. */
  distance: number
  speed: number
  pursuit: number
  damage: number
  fuel: number
  /** Nombre d'échappées réussies de justesse. */
  luckyEscapes: number
  /** Nombre de fois où la police a frôlé la collision. */
  grazes: number
  /** Numéro d'étape du dernier événement déjà joué, pour éviter les répétitions. */
  lastEventId: string | null
  /** Libellé du dernier choix, pour expliquer la fin de partie. */
  lastChoice: string | null
  over: ChaseOutcome | null
  log: ChaseLogEntry[]
  /** Vrai si le joueur a atteint la fin « Réussir l'impossible ». */
  won: boolean
}

export interface ChaseRecord {
  bestDistance: number
  bestStep: number
  runs: number
  /** Nombre de victoires « Réussir l'impossible ». */
  wins: number
  /** Meilleure distance par véhicule. */
  perVehicle: Record<string, number>
}