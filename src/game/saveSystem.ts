import { GameState, SaveData } from '../types'

const SAVE_KEY = 'clark_night_run_save'
const VERSION = '1.0.0'

export function saveGame(state: GameState): void {
  try {
    const saveData: SaveData = {
      gameState: state,
      timestamp: Date.now(),
      version: VERSION,
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
  } catch (e) {
    console.error('Erreur de sauvegarde:', e)
  }
}

export function loadGame(): GameState | null {
  try {
    const data = localStorage.getItem(SAVE_KEY)
    if (!data) return null
    const saveData: SaveData = JSON.parse(data)
    if (saveData.version !== VERSION) return null
    return saveData.gameState
  } catch (e) {
    console.error('Erreur de chargement:', e)
    return null
  }
}

export function hasSave(): boolean {
  return loadGame() !== null
}

export function deleteSave(): void {
  // Depuis `file://` le stockage peut être refusé selon la politique du
  // navigateur : une nouvelle partie ne doit jamais planter pour autant.
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch (e) {
    console.error('Erreur de suppression de la sauvegarde:', e)
  }
}

export function getSaveInfo(): { timestamp: number; chapter: string; vehicle: string } | null {
  const state = loadGame()
  if (!state) return null
  return {
    timestamp: state.startTime,
    chapter: state.currentChapter,
    vehicle: state.vehicle || 'unknown',
  }
}
