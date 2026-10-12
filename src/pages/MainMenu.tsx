import React, { useState, useEffect } from 'react'
import { useGame } from '../game/GameContext'
import { hasSave, getSaveInfo } from '../game/saveSystem'
import { vehicles } from '../data/vehicles'
import { chaseModeDescription } from '../data/chase'
import { MenuBackdrop } from '../components/MenuBackdrop'
import { startMenuMusic, stopMenuMusic } from '../game/audio'

export const MainMenu: React.FC = () => {
  const { setScreen, startNewGame, continueGame } = useGame()
  const [showVehicleSelect, setShowVehicleSelect] = useState(false)
  const [hasExistingSave, setHasExistingSave] = useState(false)
  const [saveInfo, setSaveInfo] = useState<ReturnType<typeof getSaveInfo>>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const has = hasSave()
    setHasExistingSave(has)
    if (has) {
      setSaveInfo(getSaveInfo())
    }
    setIsLoaded(true)
    startMenuMusic()
    return () => stopMenuMusic()
  }, [])

  const handleNewGame = () => {
    setShowVehicleSelect(true)
  }

  const handleVehicleSelect = (vehicleId: string) => {
    startNewGame(vehicleId as any)
  }

  const handleContinue = () => {
    continueGame()
  }

  if (!isLoaded) {
    return (
      <div className="main-menu loading">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (showVehicleSelect) {
    return (
      <div className="main-menu vehicle-select">
        <div className="menu-background" />
        <div className="menu-content">
          <h2 className="vehicle-select-title">CHOISIS TON VÉHICULE</h2>
          <p className="vehicle-select-subtitle">Chaque voiture raconte une histoire différente</p>
          <div className="vehicle-cards">
            {Object.values(vehicles).map((vehicle) => (
              <div
                key={vehicle.id}
                className="vehicle-card"
                onClick={() => handleVehicleSelect(vehicle.id)}
              >
                <div className="vehicle-card-image" style={{ background: `linear-gradient(135deg, ${vehicle.color}, ${vehicle.colorSecondary}22)` }}>
                  <img className="vehicle-card-img" src={vehicle.image} alt={vehicle.name} />
                </div>
                <div className="vehicle-card-info">
                  <h3 className="vehicle-card-name">{vehicle.name}</h3>
                  <p className="vehicle-card-tagline">{vehicle.tagline}</p>
                  <div className="vehicle-card-stats">
                    <div className="stat-mini">
                      <span className="stat-mini-label">VIT</span>
                      <span className="stat-mini-value">{vehicle.stats.vitesse}/10</span>
                    </div>
                    <div className="stat-mini">
                      <span className="stat-mini-label">DIS</span>
                      <span className="stat-mini-value">{vehicle.stats.discretion}/10</span>
                    </div>
                    <div className="stat-mini">
                      <span className="stat-mini-label">FIAB</span>
                      <span className="stat-mini-value">{vehicle.stats.fiabilite}/10</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-secondary" onClick={() => setShowVehicleSelect(false)}>
            RETOUR
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="main-menu">
      <div className="menu-background" />
      <MenuBackdrop />
      <div className="menu-particles" />

      <div className="menu-content">
        <div className="menu-logo">
          <h1 className="logo-title">CLARK</h1>
          <h2 className="logo-subtitle">NIGHT RUN</h2>
          <p className="logo-tagline">"Chaque décision laisse une trace."</p>
        </div>

        <nav className="menu-nav">
          {hasExistingSave && (
            <button className="btn btn-primary" onClick={handleContinue}>
              <span className="btn-icon">▶</span>
              CONTINUER
              {saveInfo && (
                <span className="btn-subtitle">
                  {new Date(saveInfo.timestamp).toLocaleDateString('fr-FR')} — {saveInfo.chapter}
                </span>
              )}
            </button>
          )}
          <button className="btn btn-primary" onClick={handleNewGame}>
            <span className="btn-icon">✦</span>
            COMMENCER L'HISTOIRE
          </button>
          <button
            className="btn btn-chase"
            onClick={() => setScreen('chase')}
            title={chaseModeDescription}
          >
            <span className="btn-icon">🏁</span>
            MODE POURSUITE
            <span className="btn-subtitle">
              Tenir le plus longtemps possible face à la police
            </span>
          </button>
          <button className="btn btn-secondary" onClick={() => setScreen('garage')}>
            <span className="btn-icon">🔧</span>
            GARAGE
          </button>
          <button className="btn btn-secondary" onClick={() => setScreen('characters')}>
            <span className="btn-icon">👥</span>
            PERSONNAGES
          </button>
          <button className="btn btn-secondary" onClick={() => setScreen('stats')}>
            <span className="btn-icon">📊</span>
            STATISTIQUES
          </button>
          <button className="btn btn-secondary" onClick={() => setScreen('endings')}>
            <span className="btn-icon">🏆</span>
            FINS
          </button>
          <button className="btn btn-secondary" onClick={() => setScreen('options')}>
            <span className="btn-icon">⚙</span>
            OPTIONS
          </button>
        </nav>

        <div className="menu-footer">
          <p>Une expérience interactive de livre-jeu automobile</p>
          <p className="menu-version">v1.0.0</p>
        </div>
      </div>
    </div>
  )
}
