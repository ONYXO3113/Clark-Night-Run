import React, { useState, useEffect } from 'react'
import { useGame } from '../game/GameContext'
import { SceneImage } from '../components/SceneImage'
import { ChoiceButton } from '../components/ChoiceButton'
import { TypewriterText } from '../components/TypewriterText'
import { PhoneNotification } from '../components/PhoneNotification'
import { RainEffect } from '../components/RainEffect'
import { ShootingGame } from '../components/ShootingGame'
import { vehicles } from '../data/vehicles'
import { stopMenuMusic } from '../game/audio'

export const GameScreen: React.FC = () => {
  const { currentChapter, availableChoices, makeChoice, goToMenu, state, goToChapter } = useGame()
  const [textIndex, setTextIndex] = useState(0)
  const [showChoices, setShowChoices] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  const chapter = currentChapter
  const vehicle = state.vehicle ? vehicles[state.vehicle] : null
  const [shootingResult, setShootingResult] = useState<'win' | 'lose' | null>(null)
  const [shootingRetry, setShootingRetry] = useState(0)

  useEffect(() => {
    setTextIndex(0)
    setShowChoices(false)
    setIsTransitioning(false)
    setShootingResult(null)
    setShootingRetry(0)

    // Stoppe la musique du menu dès que l'histoire démarre.
    stopMenuMusic()

    // Show phone notification if chapter has dialogue from phone
    if (chapter.dialogue?.some(d => d.speaker === 'TÉLÉPHONE')) {
      setTimeout(() => setShowPhone(true), 2000)
    }
  }, [chapter.id])

  const handleTextComplete = () => {
    if (textIndex < chapter.text.length - 1) {
      setTextIndex(textIndex + 1)
    } else {
      setShowChoices(true)
    }
  }

  const handleChoice = (choice: any) => {
    setIsTransitioning(true)
    setTimeout(() => {
      makeChoice(choice)
    }, 500)
  }

  const isEnding = chapter.isEnding

  return (
    <div className={`game-screen ${isTransitioning ? 'transitioning' : ''}`}>
      <RainEffect intensity={chapter.atmosphere === 'danger' ? 80 : 40} />

      {/* Scene Image */}
      <div className="game-scene">
        <SceneImage scene={chapter.image} />
        <div className="scene-overlay-gradient" />
      </div>

      {/* Phone Notification */}
      {showPhone && chapter.dialogue?.find(d => d.speaker === 'TÉLÉPHONE') && (
        <PhoneNotification
          message={chapter.dialogue.find(d => d.speaker === 'TÉLÉPHONE')!.text}
          sender="TÉLÉPHONE"
          color="#7b68ee"
          onDismiss={() => setShowPhone(false)}
        />
      )}

      {/* Game Content */}
      <div className="game-content">
        {/* Chapter Header */}
        <div className="chapter-header">
          <div className="chapter-number">
            {isEnding ? 'FIN' : `CHAPITRE ${chapter.number}`}
          </div>
          <h2 className="chapter-title">{chapter.title}</h2>
          {chapter.subtitle && <p className="chapter-subtitle">{chapter.subtitle}</p>}
        </div>

        {/* Vehicle Indicator */}
        {vehicle && (
          <div className="vehicle-indicator">
            <span className="vehicle-name">{vehicle.name}</span>
            <span className="vehicle-condition">
              État: {Math.max(0, 100 - state.stats.damage)}%
            </span>
          </div>
        )}

        {/* Narrative Text */}
        <div className="narrative-text">
          {chapter.text.slice(0, textIndex + 1).map((paragraph, index) => (
            <p
              key={index}
              className={`narrative-paragraph ${index === textIndex ? 'current' : 'previous'}`}
            >
              {index === textIndex ? (
                <TypewriterText
                  text={paragraph}
                  speed={20}
                  onComplete={handleTextComplete}
                />
              ) : (
                paragraph
              )}
            </p>
          ))}
        </div>

        {/* Dialogue */}
        {showChoices && chapter.dialogue && (
          <div className="dialogue-section">
            {chapter.dialogue.map((dialogue, index) => (
              <div key={index} className="dialogue-bubble" style={{ borderColor: dialogue.color }}>
                <span className="dialogue-speaker" style={{ color: dialogue.color }}>
                  {dialogue.speaker}
                </span>
                <p className="dialogue-text">{dialogue.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Mini-jeu de tir si le chapitre le demande */}
        {showChoices && chapter.minigame === 'shooting' && shootingResult === null && (
          <ShootingGame
            key={shootingRetry}
            onWin={() => setShootingResult('win')}
            onLose={() => setShootingResult('lose')}
          />
        )}

        {showChoices && chapter.minigame === 'shooting' && shootingResult === 'win' && (
          <div className="shooting-panel">
            <h3 className="shooting-result-title win">VOUS AVEZ SURVÉCU !</h3>
            <p className="shooting-intro">
              Clark repousse la police et prend la fuite. Moins d'une minute plus tard, le barrage
              n'est plus qu'un lointain souvenir dans le rétroviseur. La nuit continue…
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => goToChapter(chapter.winChapter || 'ch5')}
            >
              CONTINUER
            </button>
          </div>
        )}

        {showChoices && chapter.minigame === 'shooting' && shootingResult === 'lose' && (
          <div className="shooting-panel">
            <h3 className="shooting-result-title lose">VOUS AVEZ ÉTÉ ATTRAPPÉ</h3>
            <p className="shooting-intro">
              Vous avez eu peur. Les policiers encerclent Clark devant le parking, gyrophares
              allumés. Avant même de comprendre ce qui se passe, les menottes se referment sur
              ses poignets. C'est fini… pour cette nuit.
            </p>
            <div className="shooting-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setShootingResult(null)
                  setShootingRetry((r) => r + 1)
                }}
              >
                RECOMMENCER
              </button>
              <button type="button" className="btn btn-secondary" onClick={goToMenu}>
                MENU PRINCIPAL
              </button>
            </div>
          </div>
        )}

        {/* Choices */}
        {showChoices && !isEnding && chapter.minigame !== 'shooting' && (
          <div className="choices-section">
            <h3 className="choices-title">QUE FAIS-TU ?</h3>
            <div className="choices-list">
              {availableChoices.map((choice, index) => (
                <ChoiceButton
                  key={choice.id}
                  choice={choice}
                  onClick={() => handleChoice(choice)}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ending Content */}
        {isEnding && showChoices && (
          <div className="ending-section">
            <div className="ending-header">
              <div className="ending-number">FIN — {String(chapter.endingNumber).padStart(2, '0')}</div>
              <h3 className="ending-title">{chapter.endingTitle}</h3>
              <p className="ending-description">{chapter.endingDescription}</p>
            </div>

            <div className="ending-stats">
              <h4>STATISTIQUES DE LA PARTIE</h4>
              <div className="ending-stats-grid">
                <div className="ending-stat">
                  <span className="ending-stat-label">Véhicule</span>
                  <span className="ending-stat-value">{vehicle?.name}</span>
                </div>
                <div className="ending-stat">
                  <span className="ending-stat-label">Heat</span>
                  <span className="ending-stat-value">{state.stats.heat}/100</span>
                </div>
                <div className="ending-stat">
                  <span className="ending-stat-label">Réputation</span>
                  <span className="ending-stat-value">{state.stats.reputation}/100</span>
                </div>
                <div className="ending-stat">
                  <span className="ending-stat-label">Secrets</span>
                  <span className="ending-stat-value">{state.stats.secrets}</span>
                </div>
                <div className="ending-stat">
                  <span className="ending-stat-label">Chapitres</span>
                  <span className="ending-stat-value">{state.chaptersVisited.length}</span>
                </div>
                <div className="ending-stat">
                  <span className="ending-stat-label">Fins débloquées</span>
                  <span className="ending-stat-value">{state.endingsUnlocked.length}/6</span>
                </div>
              </div>
            </div>

            <div className="ending-actions">
              <button className="btn btn-primary" onClick={() => {
                // Rejouer avec le même véhicule
                if (state.vehicle) {
                  makeChoice({ id: 'restart', text: '', nextChapter: 'ch1', effects: [] })
                }
              }}>
                REJOUER
              </button>
              <button className="btn btn-secondary" onClick={goToMenu}>
                MENU PRINCIPAL
              </button>
            </div>
          </div>
        )}

        {/* Continue button for non-ending chapters */}
        {showChoices && !isEnding && chapter.minigame !== 'shooting' && availableChoices.length === 0 && (
          <div className="continue-section">
            <button className="btn btn-primary" onClick={handleTextComplete}>
              CONTINUER
            </button>
          </div>
        )}
      </div>

      {/* Menu button */}
      <button className="menu-button" onClick={goToMenu}>
        ☰
      </button>
    </div>
  )
}
