import { ChaseRecord, ChaseState } from './chaseTypes'
import { VehicleId } from '../types'

// ============================================
// CLARK: NIGHT RUN — Records du mode POURSUITE
// ============================================

const RECORD_KEY = 'clark_night_run_chase_record'
const VERSION = '1.0.0'

const emptyRecord = (): ChaseRecord => ({
  bestDistance: 0,
  bestStep: 0,
  runs: 0,
  wins: 0,
  perVehicle: {},
})

export function loadRecord(): ChaseRecord {
  try {
    const raw = localStorage.getItem(RECORD_KEY)
    if (!raw) return emptyRecord()
    const parsed = JSON.parse(raw)
    if (parsed.version !== VERSION) return emptyRecord()
    return { ...emptyRecord(), ...parsed.record }
  } catch {
    return emptyRecord()
  }
}

function write(record: ChaseRecord): void {
  try {
    localStorage.setItem(RECORD_KEY, JSON.stringify({ version: VERSION, record }))
  } catch (error) {
    // Depuis `file://` le stockage peut être refusé : le jeu continue, seul le
    // record ne sera pas conservé.
    console.error('Record non enregistré:', error)
  }
}

/** Enregistre une partie terminée et retourne le record mis à jour. */
export function saveRun(state: ChaseState): ChaseRecord {
  const record = loadRecord()
  record.runs += 1
  if (state.won && state.over?.title.includes('IMPOSSIBLE')) record.wins += 1

  if (state.distance > record.bestDistance) {
    record.bestDistance = state.distance
    record.bestStep = state.step
  }

  const vehicle = state.vehicle as VehicleId
  const previous = record.perVehicle[vehicle] ?? 0
  if (state.distance > previous) record.perVehicle[vehicle] = state.distance

  write(record)
  return record
}

/** Remet tous les records à zéro. */
export function resetRecord(): ChaseRecord {
  const fresh = emptyRecord()
  write(fresh)
  return fresh
}