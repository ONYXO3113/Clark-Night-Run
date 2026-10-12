import React from 'react'
import { useGame } from '../game/GameContext'
import { characters } from '../data/characters'

export const Characters: React.FC = () => {
  const { setScreen, state } = useGame()

  return (
    <div className="characters-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => setScreen('menu')}>← RETOUR</button>
        <h1 className="page-title">PERSONNAGES</h1>
      </div>

      <div className="characters-content">
        <div className="characters-grid">
          {Object.values(characters).map((character) => {
            const isMet = state.charactersMet.includes(character.id)
            const trustValue = character.id === 'maya' ? state.stats.trust_maya :
              character.id === 'rocco' ? state.stats.trust_rocco :
              character.id === 'elias' ? state.stats.trust_elias : null

            return (
              <div
                key={character.id}
                className={`character-card ${isMet ? 'met' : 'unknown'}`}
              >
                <div
                  className="character-avatar"
                  style={{
                    background: `linear-gradient(135deg, ${character.color}22, ${character.color}44)`,
                    borderColor: character.color,
                  }}
                >
                  <img
                    className="character-avatar-img"
                    src={character.avatar}
                    alt={character.name}
                    style={{ opacity: isMet ? 1 : 0.25, filter: isMet ? 'none' : 'grayscale(1) brightness(0.4)' }}
                  />
                </div>

                <div className="character-info">
                  <h3 className="character-name" style={{ color: character.color }}>
                    {isMet ? character.name : '???'}
                  </h3>
                  <p className="character-role">{character.role}</p>
                  <p className="character-description">
                    {isMet ? character.description : 'Personnage non rencontré'}
                  </p>

                  {isMet && (
                    <>
                      <div className="character-traits">
                        {character.personality.map((trait, index) => (
                          <span key={index} className="trait-tag">{trait}</span>
                        ))}
                      </div>

                      {trustValue !== null && (
                        <div className="character-trust">
                          <span className="trust-label">CONFIANCE</span>
                          <div className="trust-bar">
                            <div
                              className="trust-fill"
                              style={{
                                width: `${trustValue}%`,
                                background: character.color,
                              }}
                            />
                          </div>
                          <span className="trust-value">{trustValue}/100</span>
                        </div>
                      )}
                    </>
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
