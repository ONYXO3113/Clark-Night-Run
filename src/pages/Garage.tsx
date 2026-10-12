import React from 'react'
import { useGame } from '../game/GameContext'
import { vehicles } from '../data/vehicles'
import { StatBar } from '../components/StatBar'

export const Garage: React.FC = () => {
  const { setScreen, state } = useGame()

  return (
    <div className="garage-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => setScreen('menu')}>← RETOUR</button>
        <h1 className="page-title">GARAGE</h1>
      </div>

      <div className="garage-content">
        <div className="vehicles-grid">
          {Object.values(vehicles).map((vehicle) => {
            const isSelected = state.vehicle === vehicle.id
            const condition = Math.max(0, 100 - state.stats.damage)

            return (
              <div
                key={vehicle.id}
                className={`garage-vehicle-card ${isSelected ? 'selected' : ''}`}
              >
                <div
                  className="garage-vehicle-image"
                  style={{
                    background: `linear-gradient(135deg, ${vehicle.color}, ${vehicle.colorSecondary}22)`,
                  }}
                >
                  <img className="garage-vehicle-img" src={vehicle.image} alt={vehicle.name} />
                  {isSelected && <div className="selected-badge">SÉLECTIONNÉ</div>}
                </div>

                <div className="garage-vehicle-info">
                  <h3 className="garage-vehicle-name">{vehicle.name}</h3>
                  <p className="garage-vehicle-tagline">{vehicle.tagline}</p>
                  <p className="garage-vehicle-description">{vehicle.description}</p>

                  <div className="garage-vehicle-stats">
                    <StatBar label="VITESSE" value={vehicle.stats.vitesse} max={10} color="#e94560" compact />
                    <StatBar label="ACCÉLÉRATION" value={vehicle.stats.acceleration} max={10} color="#ff6b35" compact />
                    <StatBar label="DISCRÉTION" value={vehicle.stats.discretion} max={10} color="#7b68ee" compact />
                    <StatBar label="FIABILITÉ" value={vehicle.stats.fiabilite} max={10} color="#4ecdc4" compact />
                    <StatBar label="TOUT-TERRAIN" value={vehicle.stats.toutTerrain} max={10} color="#ffcc00" compact />
                    <StatBar label="MANIABILITÉ" value={vehicle.stats.maniabilite} max={10} color="#8b8b8b" compact />
                  </div>

                  <div className="garage-vehicle-special">
                    <h4>CAPACITÉ SPÉCIALE</h4>
                    <p className="special-name">{vehicle.specialAbility}</p>
                    <p className="special-description">{vehicle.specialDescription}</p>
                  </div>

                  {isSelected && (
                    <div className="garage-vehicle-condition">
                      <h4>ÉTAT ACTUEL</h4>
                      <div className="condition-bar">
                        <div
                          className="condition-fill"
                          style={{
                            width: `${condition}%`,
                            background: condition > 60 ? '#4ecdc4' : condition > 30 ? '#ffcc00' : '#e94560',
                          }}
                        />
                      </div>
                      <span className="condition-text">{condition}%</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
