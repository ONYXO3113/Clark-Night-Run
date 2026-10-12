import React from 'react'
import { useGame } from '../game/GameContext'

const allEndings = [
  { number: 1, title: 'LA LÉGENDE', description: 'Clark a affronté ses démons et en est sorti victorieux.' },
  { number: 2, title: 'LA LIBERTÉ', description: 'Clark a choisi ceux qu\'il aime plutôt que la gloire.' },
  { number: 3, title: 'LA VÉRITÉ', description: 'Clark a révélé la vérité et changé le système.' },
  { number: 4, title: 'LA CHUTE', description: 'Clark a été arrêté. La nuit a eu raison de lui.' },
  { number: 5, title: 'LE VEILLEUR', description: 'Clark a découvert l\'identité du Veilleur.' },
  { number: 6, title: 'LE SECRET', description: 'Clark a découvert le secret le plus sombre.' },
]

export const Endings: React.FC = () => {
  const { setScreen, state } = useGame()

  return (
    <div className="endings-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => setScreen('menu')}>← RETOUR</button>
        <h1 className="page-title">FINS DÉBLOQUÉES</h1>
      </div>

      <div className="endings-content">
        <div className="endings-progress">
          <p>Tu as découvert {Math.round((state.endingsUnlocked.length / 6) * 100)}% des fins</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(state.endingsUnlocked.length / 6) * 100}%` }}
            />
          </div>
        </div>

        <div className="endings-grid">
          {allEndings.map((ending) => {
            const isUnlocked = state.endingsUnlocked.includes(ending.number)

            return (
              <div
                key={ending.number}
                className={`ending-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="ending-number">
                  {isUnlocked ? `FIN — ${String(ending.number).padStart(2, '0')}` : '???'}
                </div>
                <h3 className="ending-title">
                  {isUnlocked ? ending.title : 'FIN VERROUILLÉE'}
                </h3>
                <p className="ending-description">
                  {isUnlocked ? ending.description : 'Continue à jouer pour débloquer cette fin.'}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
