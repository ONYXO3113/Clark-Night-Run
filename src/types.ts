// ============================================
// CLARK: NIGHT RUN — Types TypeScript
// ============================================

export type VehicleId = 'porsche' | 'corolla' | 'ram'

export type StatType =
  | 'heat'
  | 'damage'
  | 'fuel'
  | 'reputation'
  | 'money'
  | 'trust_maya'
  | 'trust_rocco'
  | 'trust_elias'
  | 'secrets'
  | 'danger'

export type ChoiceTag = 'RISQUÉ' | 'INTELLIGENT' | 'DISCRET' | 'DANGEREUX' | 'FORCE BRUTE'

export interface VehicleStats {
  vitesse: number
  acceleration: number
  discretion: number
  fiabilite: number
  toutTerrain: number
  maniabilite: number
}

export interface Vehicle {
  id: VehicleId
  name: string
  tagline: string
  description: string
  stats: VehicleStats
  specialAbility: string
  specialDescription: string
  color: string
  colorSecondary: string
  image: string
}

export interface Character {
  id: string
  name: string
  role: string
  description: string
  personality: string[]
  avatar: string
  color: string
}

export interface Effect {
  type: StatType
  value: number
}

export interface Condition {
  type: 'heat_min' | 'heat_max' | 'damage_min' | 'damage_max' | 'reputation_min' | 'money_min' | 'trust_maya_min' | 'trust_rocco_min' | 'trust_elias_min' | 'secrets_min' | 'vehicle' | 'flag'
  value: number | string | boolean
  flag?: string
}

export interface Choice {
  id: string
  text: string
  tag?: ChoiceTag
  nextChapter: string
  effects?: Effect[]
  condition?: Condition
  vehicleLock?: VehicleId
  hidden?: boolean
}

export interface Dialogue {
  speaker: string
  text: string
  color?: string
}

export interface Chapter {
  id: string
  number: number
  title: string
  subtitle?: string
  text: string[]
  dialogue?: Dialogue[]
  image: string
  choices: Choice[]
  onEnter?: Effect[]
  isEnding?: boolean
  endingNumber?: number
  endingTitle?: string
  endingDescription?: string
  atmosphere?: 'calm' | 'tension' | 'danger' | 'paranoia' | 'revelation' | 'dawn'
  /** Si présent, ce chapitre lance un mini-jeu au lieu des choix. */
  minigame?: 'shooting'
  winChapter?: string
  loseChapter?: string
}

export interface GameState {
  currentChapter: string
  vehicle: VehicleId | null
  stats: Record<StatType, number>
  flags: Record<string, boolean>
  choices: string[]
  chaptersVisited: string[]
  charactersMet: string[]
  secretsFound: string[]
  endingsUnlocked: number[]
  playTime: number
  startTime: number
}

export interface SaveData {
  gameState: GameState
  timestamp: number
  version: string
}

export type Screen =
  | 'menu'
  | 'game'
  | 'garage'
  | 'characters'
  | 'stats'
  | 'options'
  | 'endings'
  | 'ending'
  | 'chase'
  | 'chase_result'
