import React, { useState } from 'react'
import { useGame } from '../game/GameContext'

export const Options: React.FC = () => {
  const { setScreen, resetGame } = useGame()
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [rainEnabled, setRainEnabled] = useState(true)
  const [textSpeed, setTextSpeed] = useState(30)

  return (
    <div className="options-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => setScreen('menu')}>← RETOUR</button>
        <h1 className="page-title">OPTIONS</h1>
      </div>

      <div className="options-content">
        <div className="options-card">
          <h3>AUDIO</h3>
          <div className="option-item">
            <label className="option-label">
              <span>Effets sonores</span>
              <button
                className={`toggle ${soundEnabled ? 'active' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                <span className="toggle-slider" />
              </button>
            </label>
          </div>
        </div>

        <div className="options-card">
          <h3>VISUEL</h3>
          <div className="option-item">
            <label className="option-label">
              <span>Effet de pluie</span>
              <button
                className={`toggle ${rainEnabled ? 'active' : ''}`}
                onClick={() => setRainEnabled(!rainEnabled)}
              >
                <span className="toggle-slider" />
              </button>
            </label>
          </div>
        </div>

        <div className="options-card">
          <h3>TEXTE</h3>
          <div className="option-item">
            <label className="option-label">
              <span>Vitesse du texte</span>
              <select
                value={textSpeed}
                onChange={(e) => setTextSpeed(Number(e.target.value))}
                className="option-select"
              >
                <option value={10}>Rapide</option>
                <option value={30}>Normal</option>
                <option value={50}>Lent</option>
              </select>
            </label>
          </div>
        </div>

        <div className="options-card">
          <h3>PARTIE</h3>
          <div className="option-item">
            <button className="btn btn-danger" onClick={resetGame}>
              EFFACER LA SAUVEGARDE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
