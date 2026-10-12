import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { GameState, VehicleId, Screen, Choice, Effect } from '../types'

import { createInitialGameState, applyEffects, getAvailableChoices } from './gameState'
import { saveGame, loadGame, deleteSave } from './saveSystem'
import { chapters } from '../data/chapters'

interface GameContextType {
  state: GameState
  screen: Screen
  setScreen: (screen: Screen) => void
  startNewGame: (vehicle: VehicleId) => void
  continueGame: () => boolean
  makeChoice: (choice: Choice) => void
  goToChapter: (chapterId: string) => void
  goToMenu: () => void
  resetGame: () => void
  currentChapter: typeof chapters[string]
  availableChoices: Choice[]
}

type Action =
  | { type: 'SET_STATE'; payload: GameState & { screen?: Screen } }
  | { type: 'SET_SCREEN'; payload: Screen }
  | { type: 'START_GAME'; payload: VehicleId }
  | { type: 'MAKE_CHOICE'; payload: Choice }
  | { type: 'GO_TO_CHAPTER'; payload: string }
  | { type: 'RESET' }

function gameReducer(state: GameState & { screen: Screen }, action: Action): GameState & { screen: Screen } {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload }
    case 'SET_SCREEN':
      return { ...state, screen: action.payload }
    case 'START_GAME': {
      const newState = createInitialGameState(action.payload)
      return { ...state, ...newState, screen: 'game' }
    }
    case 'MAKE_CHOICE': {
      const choice = action.payload
      let newState = applyEffects(state, choice.effects || [])

      // Add choice to history
      newState = {
        ...newState,
        choices: [...newState.choices, choice.id],
      }

      // Move to next chapter
      const nextChapterId = choice.nextChapter
      if (chapters[nextChapterId]) {
        newState = {
          ...newState,
          currentChapter: nextChapterId,
          chaptersVisited: [...new Set([...newState.chaptersVisited, nextChapterId])],
        }

        // Apply chapter onEnter effects
        const nextChapter = chapters[nextChapterId]
        if (nextChapter.onEnter) {
          newState = applyEffects(newState, nextChapter.onEnter)
        }

        // Check for ending
        if (nextChapter.isEnding && nextChapter.endingNumber) {
          const endings = [...newState.endingsUnlocked]
          if (!endings.includes(nextChapter.endingNumber)) {
            endings.push(nextChapter.endingNumber)
          }
          newState = { ...newState, endingsUnlocked: endings }
        }
      }

      return { ...newState, screen: 'game' }
    }
    case 'GO_TO_CHAPTER': {
      let newState: GameState = { ...state }
      const nextChapterId = action.payload
      if (chapters[nextChapterId]) {
        newState = {
          ...newState,
          currentChapter: nextChapterId,
          chaptersVisited: [...new Set([...newState.chaptersVisited, nextChapterId])],
        }
        const nextChapter = chapters[nextChapterId]
        if (nextChapter.onEnter) {
          newState = applyEffects(newState, nextChapter.onEnter)
        }
        if (nextChapter.isEnding && nextChapter.endingNumber) {
          const endings = [...newState.endingsUnlocked]
          if (!endings.includes(nextChapter.endingNumber)) {
            endings.push(nextChapter.endingNumber)
          }
          newState = { ...newState, endingsUnlocked: endings }
        }
      }
      return { ...newState, screen: 'game' }
    }
    case 'RESET':
      return { ...state, screen: 'menu' }
    default:
      return state
  }
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, {
    ...createInitialGameState('porsche'),
    screen: 'menu',
  })

  // Auto-save on state change
  useEffect(() => {
    if (state.screen === 'game') {
      saveGame(state)
    }
  }, [state])

  const setScreen = useCallback((screen: Screen) => {
    dispatch({ type: 'SET_SCREEN', payload: screen })
  }, [])

  const startNewGame = useCallback((vehicle: VehicleId) => {
    deleteSave()
    dispatch({ type: 'START_GAME', payload: vehicle })
  }, [])

  const continueGame = useCallback((): boolean => {
    const saved = loadGame()
    if (saved) {
      dispatch({ type: 'SET_STATE', payload: { ...saved, screen: 'game' } })
      return true
    }
    return false
  }, [])

  const makeChoice = useCallback((choice: Choice) => {
    dispatch({ type: 'MAKE_CHOICE', payload: choice })
  }, [])

  const goToChapter = useCallback((chapterId: string) => {
    dispatch({ type: 'GO_TO_CHAPTER', payload: chapterId })
  }, [])

  const goToMenu = useCallback(() => {
    dispatch({ type: 'SET_SCREEN', payload: 'menu' })
  }, [])

  const resetGame = useCallback(() => {
    deleteSave()
    dispatch({ type: 'RESET' })
  }, [])

  const currentChapter = chapters[state.currentChapter] || chapters['ch1']
  const availableChoices = getAvailableChoices(state, currentChapter.choices)

  return (
    <GameContext.Provider
      value={{
        state,
        screen: state.screen,
        setScreen,
        startNewGame,
        continueGame,
        makeChoice,
        goToChapter,
        goToMenu,
        resetGame,
        currentChapter,
        availableChoices,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
