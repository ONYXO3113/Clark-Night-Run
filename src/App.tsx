import React from 'react'
import { GameProvider, useGame } from './game/GameContext'
import { MainMenu } from './pages/MainMenu'
import { GameScreen } from './pages/GameScreen'
import { Garage } from './pages/Garage'
import { Characters } from './pages/Characters'
import { Stats } from './pages/Stats'
import { Options } from './pages/Options'
import { Endings } from './pages/Endings'
import { ChasePage } from './pages/ChasePage'

const AppContent: React.FC = () => {
  const { screen } = useGame()

  return (
    <div className="app">
      {screen === 'menu' && <MainMenu />}
      {screen === 'game' && <GameScreen />}
      {screen === 'garage' && <Garage />}
      {screen === 'characters' && <Characters />}
      {screen === 'stats' && <Stats />}
      {screen === 'options' && <Options />}
      {screen === 'endings' && <Endings />}
      {screen === 'chase' && <ChasePage />}
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  )
}
