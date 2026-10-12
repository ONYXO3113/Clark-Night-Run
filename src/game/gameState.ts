import { GameState, VehicleId, StatType, Effect } from '../types'
import { startChapter } from '../data/chapters'

export const initialStats: Record<StatType, number> = {
  heat: 0,
  damage: 0,
  fuel: 100,
  reputation: 0,
  money: 1000,
  trust_maya: 50,
  trust_rocco: 50,
  trust_elias: 50,
  secrets: 0,
  danger: 0,
}

export function createInitialGameState(vehicle: VehicleId): GameState {
  return {
    currentChapter: startChapter,
    vehicle,
    stats: { ...initialStats },
    flags: {},
    choices: [],
    chaptersVisited: [startChapter],
    charactersMet: [],
    secretsFound: [],
    endingsUnlocked: [],
    playTime: 0,
    startTime: Date.now(),
  }
}

export function applyEffects(state: GameState, effects: Effect[]): GameState {
  const newStats = { ...state.stats }
  const newFlags = { ...state.flags }
  const newSecrets = [...state.secretsFound]

  for (const effect of effects) {
    if (effect.type === 'secrets') {
      newStats.secrets = Math.max(0, newStats.secrets + effect.value)
      if (effect.value > 0) {
        for (let i = 0; i < effect.value; i++) {
          const secretId = `secret_${Date.now()}_${i}`
          if (!newSecrets.includes(secretId)) {
            newSecrets.push(secretId)
          }
        }
      }
    } else {
      newStats[effect.type] = Math.max(0, Math.min(100, newStats[effect.type] + effect.value))
    }
  }

  return {
    ...state,
    stats: newStats,
    flags: newFlags,
    secretsFound: newSecrets,
  }
}

export function checkCondition(state: GameState, condition: any): boolean {
  if (!condition) return true

  switch (condition.type) {
    case 'heat_min':
      return state.stats.heat >= condition.value
    case 'heat_max':
      return state.stats.heat <= condition.value
    case 'damage_min':
      return state.stats.damage >= condition.value
    case 'damage_max':
      return state.stats.damage <= condition.value
    case 'reputation_min':
      return state.stats.reputation >= condition.value
    case 'money_min':
      return state.stats.money >= condition.value
    case 'trust_maya_min':
      return state.stats.trust_maya >= condition.value
    case 'trust_rocco_min':
      return state.stats.trust_rocco >= condition.value
    case 'trust_elias_min':
      return state.stats.trust_elias >= condition.value
    case 'secrets_min':
      return state.stats.secrets >= condition.value
    case 'vehicle':
      return state.vehicle === condition.value
    case 'flag':
      return state.flags[condition.flag] === condition.value
    default:
      return true
  }
}

export function getAvailableChoices(state: GameState, choices: any[]) {
  return choices.filter(choice => {
    if (choice.vehicleLock && state.vehicle !== choice.vehicleLock) return false
    if (choice.condition && !checkCondition(state, choice.condition)) return false
    return true
  })
}
