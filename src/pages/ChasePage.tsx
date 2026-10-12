import React, { useState, useCallback, useRef } from 'react'
import { useGame } from '../game/GameContext'
import { vehicles } from '../data/vehicles'
import { chaseModeDescription, CHASE_WIN_STEP, CHASE_WIN_MAX_DAMAGE, CHASE_WIN_MAX_PURSUIT } from '../data/chase'
import {
  createChaseState,
  getChaseVehicle,
  isChoiceAvailable,
  lockReason,
  pickEvent,
  resolveChoice,
  checkEnd,
  progressToWin,
} from '../game/chaseState'
import { loadRecord, saveRun } from '../game/chaseRecords'
import { ChaseEvent, ChaseState, ChaseRecord } from '../game/chaseTypes'
import { VehicleId } from '../types'
import { ChaseScene } from '../components/ChaseScene'
import { ShootingGame } from '../components/ShootingGame'
import { playSiren, playClick } from '../game/audio'

// ============================================
// CLARK: NIGHT RUN — Écran du mode POURSUITE
// ============================================

type Phase = 'difficulty' | 'intro' | 'run' | 'result'

/** Barre de jauge qui vire au rouge quand la valeur devient critique. */
const Gauge: React.FC<{
  label: string
  value: number
  dangerAt?: number
  invert?: boolean
}> = ({ label, value, dangerAt, invert }) => {
  const raw = Math.round(value)
  const critical = dangerAt !== undefined && raw >= dangerAt
  const low = invert !== undefined && invert && raw <= dangerAt!
  return (
    <div className={`chase-gauge ${critical ? 'critical' : ''} ${low ? 'low' : ''}`}>
      <div className="chase-gauge-head">
        <span className="chase-gauge-label">{label}</span>
        <span className="chase-gauge-value">{raw}</span>
      </div>
      <div className="chase-gauge-track">
        <div className="chase-gauge-fill" style={{ width: `${Math.max(2, Math.min(100, raw))}%` }} />
      </div>
    </div>
  )
}

const VehicleIntro: React.FC<{ onPick: (id: VehicleId) => void; record: ChaseRecord; onQuit: () => void }> = ({
  onPick,
  record,
  onQuit,
}) => {
  return (
    <div className="chase-intro">
      <div className="chase-intro-panel">
        <span className="chase-badge">MODE POURSUITE</span>
        <h1 className="chase-title">TENIR LE PLUS LONGTEMPS</h1>
        <p className="chase-description">{chaseModeDescription}</p>

        <div className="chase-rules">
          <div className="chase-rule">
            <strong>OBJECTIF</strong> Rouler le plus loin possible avant d’être rattrapé.
          </div>
          <div className="chase-rule">
            <strong>PIÈGE</strong> Chaque choix consomme du carburant, et la police ne lâche jamais.
          </div>
          <div className="chase-rule">
            <strong>CLÉ</strong> Les options marquées exigent une caractéristique de ta voiture. Si elle
            ne l’a pas, elles sont verrouillées.
          </div>
          <div className="chase-rule hard">
            <strong>L’IMPOSSIBLE</strong> Atteindre l’étape {CHASE_WIN_STEP} avec moins de{' '}
            {CHASE_WIN_MAX_DAMAGE} de dégâts et moins de {CHASE_WIN_MAX_PURSUIT} de pression.
            Quasiment personne n’y arrive.
          </div>
        </div>

        {record.runs > 0 && (
          <div className="chase-record">
            <div className="chase-record-item">
              <span className="chase-record-value">{record.bestDistance.toFixed(1)} km</span>
              <span className="chase-record-label">RECORD</span>
            </div>
            <div className="chase-record-item">
              <span className="chase-record-value">{record.runs}</span>
              <span className="chase-record-label">TENTATIVES</span>
            </div>
            <div className="chase-record-item">
              <span className="chase-record-value">{record.wins}</span>
              <span className="chase-record-label">IMPOSSIBLE</span>
            </div>
          </div>
        )}

        <h2 className="chase-pick-label">CHOISIS TON VÉHICULE</h2>
        <div className="chase-vehicle-grid">
          {Object.values(vehicles).map((vehicle) => (
            <button
              key={vehicle.id}
              type="button"
              className="chase-vehicle"
              style={{ borderColor: vehicle.color, background: `${vehicle.color}18` }}
              onClick={() => onPick(vehicle.id as VehicleId)}
            >
              <img className="chase-vehicle-img" src={vehicle.image} alt={vehicle.name} />
              <span className="chase-vehicle-name">{vehicle.name}</span>
              <span className="chase-vehicle-tagline">{vehicle.tagline}</span>
              <span className="chase-vehicle-ability">{vehicle.specialAbility}</span>
              <div className="chase-vehicle-stats">
                {(
                  [
                    ['VITESSE', vehicle.stats.vitesse],
                    ['ACCÉL.', vehicle.stats.acceleration],
                    ['DISCRET.', vehicle.stats.discretion],
                    ['FIABIL.', vehicle.stats.fiabilite],
                    ['TERRAIN', vehicle.stats.toutTerrain],
                    ['MANIAB.', vehicle.stats.maniabilite],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="chase-mini-stat">
                    <span className="chase-mini-label">{label}</span>
                    <span className="chase-mini-track">
                      <span className="chase-mini-fill" style={{ width: `${value * 10}%` }} />
                    </span>
                    <span className="chase-mini-value">{value}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>

        <button type="button" className="btn btn-secondary chase-back" onClick={onQuit}>
          RETOUR
        </button>
      </div>
    </div>
  )
}

const ResultScreen: React.FC<{
  state: ChaseState
  record: ChaseRecord
  isNewRecord: boolean
  onRetry: () => void
  onQuit: () => void
}> = ({ state, record, isNewRecord, onRetry, onQuit }) => {
  const vehicle = vehicles[state.vehicle]
  return (
    <div className="chase-result">
      <div className={`chase-result-panel ${state.won ? 'won' : 'lost'}`}>
        <span className="chase-result-badge">{state.won ? 'SUCCÈS' : 'ÉCHEC'}</span>
        <h1 className="chase-result-title">{state.over?.title ?? 'FIN'}</h1>
        <p className="chase-result-text">{state.over?.text}</p>
        {state.over?.hint && <p className="chase-result-hint">{state.over.hint}</p>}

        <div className="chase-result-stats">
          <div className="chase-result-stat">
            <span className="chase-result-value">{state.distance.toFixed(1)} km</span>
            <span className="chase-result-label">DISTANCE</span>
          </div>
          <div className="chase-result-stat">
            <span className="chase-result-value">{state.step}</span>
            <span className="chase-result-label">ÉTAPE</span>
          </div>
          <div className="chase-result-stat">
            <span className="chase-result-value">{vehicle?.name ?? '—'}</span>
            <span className="chase-result-label">VÉHICULE</span>
          </div>
        </div>

        {state.won && (
          <p className="chase-result-extra">
            Échappées de justesse : {state.luckyEscapes} · Frôlements : {state.grazes}
          </p>
        )}

        {isNewRecord && <p className="chase-new-record">NOUVEAU RECORD</p>}

        <p className="chase-result-best">
          RECORD : {record.bestDistance.toFixed(1)} km ({record.bestStep} étapes)
        </p>

        <div className="chase-result-actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            RECOMMENCER
          </button>
          <button type="button" className="btn btn-secondary" onClick={onQuit}>
            MENU PRINCIPAL
          </button>
        </div>
      </div>
    </div>
  )
}

export const ChasePage: React.FC = () => {
  const { setScreen } = useGame()
  const [phase, setPhase] = useState<Phase>('difficulty')
  const [difficulty, setDifficulty] = useState<'facile' | 'difficile' | 'impossible'>('difficile')
  const [state, setState] = useState<ChaseState>(() => createChaseState('porsche', 'difficile'))
  const [event, setEvent] = useState<ChaseEvent | null>(null)
  const [record, setRecord] = useState<ChaseRecord>(() => loadRecord())
  const [isNewRecord, setIsNewRecord] = useState(false)
  const [feed, setFeed] = useState<{ text: string; tone: 'good' | 'bad' | 'neutral' }[]>([])
  const [pending, setPending] = useState(false)
  const [shooting, setShooting] = useState(false)
  const [shootingResult, setShootingResult] = useState<'win' | 'lose' | null>(null)
  const shootoutDone = useRef(false)

  const start = useCallback((vehicle: VehicleId) => {
    const fresh = createChaseState(vehicle, difficulty)
    setState(fresh)
    setEvent(pickEvent(fresh))
    setFeed([])
    setIsNewRecord(false)
    setShooting(false)
    setShootingResult(null)
    shootoutDone.current = false
    setPhase('run')
  }, [difficulty])

  /** Termine la partie, enregistre le record et affiche l'écran de résultat. */
  const finish = useCallback(
    (finalState: ChaseState, won: boolean) => {
      const ended: ChaseState = { ...finalState, won }
      const previous = loadRecord()
      const updated = saveRun(ended)
      setRecord(updated)
      setIsNewRecord(
        ended.distance > previous.bestDistance || (won && previous.wins === 0)
      )
      setState(ended)
      setPhase('result')
    },
    []
  )

  const choose = useCallback(
    (choiceId: string) => {
      if (pending || !event) return
      setPending(true)
      const choice = event.choices.find((c) => c.id === choiceId)
      if (!choice) {
        setPending(false)
        return
      }

      const stats = getChaseVehicle(state)
      // Un choix verrouillé ne doit jamais passer, même si l'interface triche.
      if (!isChoiceAvailable(choice, stats)) {
        setPending(false)
        return
      }

      const { state: next, message, tone } = resolveChoice(state, event, choice)
      setFeed((prev) => [{ text: message, tone }, ...prev].slice(0, 4))
      setState(next)

      const end = checkEnd(next)
      if (end) {
        // Laisser le joueur voir le résultat de son choix avant l'écran final.
        window.setTimeout(() => {
          setState({ ...next, over: end })
          finish(next, end.success)
        }, 700)
        return
      }

      window.setTimeout(() => {
        // La police bloque la route : mini-jeu de tir (une fois par partie).
        if (next.pursuit >= 70 && next.step >= 4 && !shootoutDone.current) {
          shootoutDone.current = true
          setShooting(true)
          setPending(false)
          return
        }
        setEvent(pickEvent(next))
        setPending(false)
      }, 260)
    },
    [state, event, pending, finish]
  )

  const quit = useCallback(() => {
    setScreen('menu')
  }, [setScreen])

  // Sirène quand Clark se fait attraper.
  React.useEffect(() => {
    if (phase === 'result' && state.over?.failure === 'caught') playSiren()
  }, [phase, state.over])

  if (phase === 'intro') {
    return <VehicleIntro onPick={start} record={record} onQuit={quit} />
  }

  if (phase === 'result') {
    return (
      <ResultScreen
        state={state}
        record={record}
        isNewRecord={isNewRecord}
        onRetry={() => setPhase('difficulty')}
        onQuit={quit}
      />
    )
  }

  if (phase === 'difficulty') {
    return (
      <div className="chase-intro">
        <div className="chase-intro-panel">
          <span className="chase-badge">MODE POURSUITE</span>
          <h1 className="chase-title">CHOISIS TA DIFFICULTÉ</h1>
          <p className="chase-description">Plus c'est dur, moins tu as de chances de t'en sortir.</p>
          <div className="chase-difficulty-list">
            <button type="button" className="btn btn-secondary chase-diff" onClick={() => { playClick(); setDifficulty('facile'); setPhase('intro') }}>
              <strong>FACILE</strong>
              <span>Tout passe ou presque. Détente.</span>
            </button>
            <button type="button" className="btn btn-chase chase-diff" onClick={() => { playClick(); setDifficulty('difficile'); setPhase('intro') }}>
              <strong>DIFFICILE</strong>
              <span>Ça devient compliqué. Survit.</span>
            </button>
            <button type="button" className="btn btn-primary chase-diff" onClick={() => { playClick(); setDifficulty('impossible'); setPhase('intro') }}>
              <strong>IMPOSSIBLE</strong>
              <span>Vraiment très dur. Réussir l'impossible ne se débloque qu'ici.</span>
            </button>
          </div>
          <button type="button" className="btn btn-secondary chase-back" onClick={quit}>
            RETOUR
          </button>
        </div>
      </div>
    )
  }

  if (shooting) {
    return (
      <div className="chase-shooting">
        <p className="chase-shooting-title">BARRAGE POLICE — PANIQUE TOTALE</p>
        <ShootingGame
          onWin={() => {
            setShooting(false)
            setShootingResult('win')
          }}
          onLose={() => {
            setShooting(false)
            setShootingResult('lose')
          }}
        />
      </div>
    )
  }

  if (shootingResult === 'win') {
    return (
      <div className="chase-shooting">
        <div className="shooting-panel">
          <h2 className="shooting-result-title win">TU T'EN SORS… À PEINE</h2>
          <p className="shooting-intro">
            Vous avez repoussé les policiers, mais les coups de feu ont été entendus dans tout le
            quartier. La police déploie maintenant plus d'effectifs. La fuite ne fait que
            commencer — et chaque virage sera plus difficile qu'avant.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setShootingResult(null)
              setState((prev) => ({ ...prev, pursuit: Math.min(100, prev.pursuit + 15) }))
              setEvent(pickEvent(state))
              setFeed((prev) => [{ text: 'Des coups de feu résonnent. La police se resserre.', tone: 'bad' as const }, ...prev].slice(0, 4))
            }}
          >
            CONTINUER LA FUITE
          </button>
        </div>
      </div>
    )
  }

  if (shootingResult === 'lose') {
    return (
      <div className="chase-shooting">
        <div className="shooting-panel">
          <h2 className="shooting-result-title lose">VOUS AVEZ ÉTÉ ATTRAPPÉ</h2>
          <p className="shooting-intro">
            Les policiers encerclent Clark. Plus moyen de s'enfuir. C'est la fin de cette course.
          </p>
          <div className="shooting-actions">
            <button type="button" className="btn btn-primary" onClick={() => { setShootingResult(null); setPhase('difficulty') }}>
              RECOMMENCER
            </button>
            <button type="button" className="btn btn-secondary" onClick={quit}>
              MENU PRINCIPAL
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stats = getChaseVehicle(state)
  const progress = progressToWin(state)

  return (
    <div className="chase-page">
      <div className="chase-stage">
        {event && <ChaseScene scene={event.scene} state={state} />}

        <div className="chase-hud">
          <div className="chase-hud-block">
            <span className="chase-hud-label">DISTANCE</span>
            <span className="chase-hud-value">{state.distance.toFixed(1)} km</span>
          </div>
          <div className="chase-hud-block">
            <span className="chase-hud-label">ÉTAPE</span>
            <span className="chase-hud-value">
              {state.step}
              <span className="chase-hud-sub">/ {CHASE_WIN_STEP}</span>
            </span>
          </div>
          <div className="chase-hud-block">
            <span className="chase-hud-label">VITESSE</span>
            <span className="chase-hud-value">{Math.round(state.speed)} km/h</span>
          </div>
        </div>

        <div className="chase-gauges">
          <Gauge label="POUSSÉE POLICE" value={state.pursuit} dangerAt={70} />
          <Gauge label="DÉGÂTS" value={state.damage} dangerAt={70} />
          <Gauge label="CARBURANT" value={state.fuel} dangerAt={25} invert />
          <div className="chase-gauge">
            <div className="chase-gauge-head">
              <span className="chase-gauge-label">VERS L’IMPOSSIBLE</span>
              <span className="chase-gauge-value">{progress}%</span>
            </div>
            <div className="chase-gauge-track win">
              <div className="chase-gauge-fill win" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="chase-panel">
        {event && (
          <>
            <p className="chase-event-text">{event.text}</p>

            {feed.length > 0 && (
              <div className="chase-feed">
                {feed.map((line, index) => (
                  <p key={index} className={`chase-feed-line ${line.tone}`}>
                    {line.text}
                  </p>
                ))}
              </div>
            )}

            <div className="chase-choices">
              {event.choices.map((choice) => {
                const available = isChoiceAvailable(choice, stats)
                return (
                  <button
                    key={choice.id}
                    type="button"
                    className={`chase-choice ${available ? '' : 'locked'}`}
                    disabled={!available || pending}
                    onClick={() => { playClick(); choose(choice.id) }}
                  >
                    <span className="chase-choice-label">{choice.label}</span>
                    <span className="chase-choice-detail">
                      {available ? choice.detail : lockReason(choice, stats)}
                    </span>
                    {!available && <span className="chase-choice-lock">VERROUILLÉ</span>}
                    {choice.gamble && available && (
                      <span className="chase-choice-risk">
                        {choice.gamble.chance}% · pari
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      <button type="button" className="menu-button chase-menu-button" onClick={quit}>
        ☰
      </button>
    </div>
  )
}