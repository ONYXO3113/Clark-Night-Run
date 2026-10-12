import React from 'react'
import { useGame } from '../game/GameContext'
import { StatBar } from '../components/StatBar'

export const Stats: React.FC = () => {
  const { setScreen, state } = useGame()

  const heatLevel = state.stats.heat <= 20 ? 'CALME' :
    state.stats.heat <= 40 ? 'CONTRÔLES' :
    state.stats.heat <= 60 ? 'RECHERCHÉ' :
    state.stats.heat <= 80 ? 'DANGEREUX' : 'CRITIQUE'

  const heatColor = state.stats.heat <= 20 ? '#4ecdc4' :
    state.stats.heat <= 40 ? '#ffcc00' :
    state.stats.heat <= 60 ? '#ff6b35' :
    state.stats.heat <= 80 ? '#e94560' : '#ff0000'

  return (
    <div className="stats-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => setScreen('menu')}>← RETOUR</button>
        <h1 className="page-title">STATISTIQUES</h1>
      </div>

      <div className="stats-content">
        <div className="stats-grid">
          <div className="stats-card">
            <h3>ÉTAT DE LA PARTIE</h3>
            <div className="stats-list">
              <StatBar label="HEAT" value={state.stats.heat} color={heatColor} />
              <div className="heat-level" style={{ color: heatColor }}>
                {heatLevel}
              </div>
              <StatBar label="DÉGÂTS" value={state.stats.damage} color="#e94560" />
              <StatBar label="CARBURANT" value={state.stats.fuel} color="#4ecdc4" />
              <StatBar label="RÉPUTATION" value={state.stats.reputation} color="#ff6b35" />
              <StatBar label="ARGENT" value={state.stats.money} max={2000} color="#ffcc00" />
            </div>
          </div>

          <div className="stats-card">
            <h3>RELATIONS</h3>
            <div className="stats-list">
              <StatBar label="MAYA" value={state.stats.trust_maya} color="#4ecdc4" />
              <StatBar label="ROCCO" value={state.stats.trust_rocco} color="#e94560" />
              <StatBar label="ELIAS" value={state.stats.trust_elias} color="#ff6b35" />
            </div>
          </div>

          <div className="stats-card">
            <h3>PROGRESSION</h3>
            <div className="stats-list">
              <StatBar label="SECRETS" value={state.stats.secrets} max={20} color="#7b68ee" />
              <StatBar label="DANGER" value={state.stats.danger} color="#ff0000" />
            </div>
          </div>

          <div className="stats-card">
            <h3>PARTIE</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-label">Chapitres visités</span>
                <span className="stat-value">{state.chaptersVisited.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Choix effectués</span>
                <span className="stat-value">{state.choices.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Fins débloquées</span>
                <span className="stat-value">{state.endingsUnlocked.length}/6</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Véhicule</span>
                <span className="stat-value">{state.vehicle?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
