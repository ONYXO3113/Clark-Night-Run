import React from 'react'
import { ChaseState } from '../game/chaseTypes'

// ============================================
// CLARK: NIGHT RUN — Scène de conduite (mode POURSUITE)
//
// Vue depuis le siège, avec le rétroviseur en haut : la lumière de la police
// y pulse selon la pression, et les lignes de vitesse selon l'allure. Le décor
// change selon l'événement, et le ciel se réchauffe quand la nuit avance.
// ============================================

interface ChaseSceneProps {
  scene: string
  state: ChaseState
}

type Horizon = 'city' | 'rural' | 'tunnel' | 'bridge' | 'indoor' | 'underground'

interface SceneDef {
  sky: string
  horizon: Horizon
  /** Élément au premier plan, dessiné sur la route. */
  prop: string
  /** Voile coloré posé sur toute l'image. */
  tint?: string
  rain?: boolean
}

const SCENES: Record<string, SceneDef> = {
  street_start: {
    sky: 'linear-gradient(180deg, #05050c 0%, #0d1024 45%, #1b1436 75%, #2a1a3e 100%)',
    horizon: 'city',
    prop: 'none',
    rain: true,
  },
  crossroad: {
    sky: 'linear-gradient(180deg, #05050c 0%, #101228 50%, #241a3e 80%, #34204a 100%)',
    horizon: 'city',
    prop: 'sign',
  },
  tunnel: {
    sky: 'linear-gradient(180deg, #1a0f08 0%, #2b1a0d 40%, #120c08 100%)',
    horizon: 'tunnel',
    prop: 'tunnel_lights',
  },
  truck: {
    sky: 'linear-gradient(180deg, #06060e 0%, #101228 50%, #1d1636 100%)',
    horizon: 'city',
    prop: 'truck',
  },
  checkpoint: {
    sky: 'linear-gradient(180deg, #07070f 0%, #141428 50%, #2a1430 100%)',
    horizon: 'city',
    prop: 'checkpoint',
  },
  alley: {
    sky: 'linear-gradient(180deg, #030305 0%, #08080e 60%, #0c0c14 100%)',
    horizon: 'indoor',
    prop: 'alley',
  },
  narrow_pole: {
    sky: 'linear-gradient(180deg, #040407 0%, #0a0a12 60%, #101018 100%)',
    horizon: 'indoor',
    prop: 'pole',
  },
  roadblock: {
    sky: 'linear-gradient(180deg, #0a0510 0%, #1c0a1e 50%, #2a0e28 100%)',
    horizon: 'city',
    prop: 'roadblock',
    tint: 'rgba(233, 69, 96, 0.10)',
  },
  parking: {
    sky: 'linear-gradient(180deg, #04120e 0%, #072018 50%, #04100c 100%)',
    horizon: 'underground',
    prop: 'parking',
  },
  helicopter: {
    sky: 'linear-gradient(180deg, #05060f 0%, #0c1226 50%, #182040 100%)',
    horizon: 'city',
    prop: 'searchlight',
  },
  roundabout: {
    sky: 'linear-gradient(180deg, #06060e 0%, #12122a 50%, #241a3e 100%)',
    horizon: 'city',
    prop: 'roundabout',
  },
  station: {
    sky: 'linear-gradient(180deg, #0d0a14 0%, #20182c 55%, #f5e6c8 100%)',
    horizon: 'city',
    prop: 'gas_station',
  },
  bridge: {
    sky: 'linear-gradient(180deg, #05060e 0%, #0e1428 55%, #1c2440 100%)',
    horizon: 'bridge',
    prop: 'bridge_rail',
  },
  market: {
    sky: 'linear-gradient(180deg, #0a0710 0%, #1a1024 55%, #2e1a30 100%)',
    horizon: 'city',
    prop: 'market',
  },
  worksite: {
    sky: 'linear-gradient(180deg, #08070e 0%, #141220 55%, #241c26 100%)',
    horizon: 'city',
    prop: 'worksite',
  },
  rural: {
    sky: 'linear-gradient(180deg, #030309 0%, #0a0a1a 55%, #141428 100%)',
    horizon: 'rural',
    prop: 'trees',
  },
  spikes: {
    sky: 'linear-gradient(180deg, #07070f 0%, #121024 55%, #201634 100%)',
    horizon: 'city',
    prop: 'spikes',
  },
  underpass: {
    sky: 'linear-gradient(180deg, #050a10 0%, #08121c 55%, #040a12 100%)',
    horizon: 'underground',
    prop: 'water',
  },
  pursuit: {
    sky: 'linear-gradient(180deg, #08050e 0%, #180a20 50%, #2a0c22 100%)',
    horizon: 'city',
    prop: 'police_cars',
    tint: 'rgba(233, 69, 96, 0.14)',
  },
  final_crossroad: {
    sky: 'linear-gradient(180deg, #0a0714 0%, #1c1030 50%, #3a1c40 80%, #5a2a3e 100%)',
    horizon: 'city',
    prop: 'home_sign',
  },
}

// --- Décors d'horizon -------------------------------------------------

const CityHorizon: React.FC<{ warm?: boolean }> = ({ warm }) => (
  <g fill={warm ? '#2a1a2e' : '#080a18'}>
    {Array.from({ length: 26 }, (_, i) => {
      const w = 18 + ((i * 37) % 34)
      const h = 40 + ((i * 71) % 120)
      const x = i * 31 - 10
      return (
        <g key={i}>
          <rect x={x} y={250 - h} width={w} height={h} />
          {/* Fenêtres allumées, plus rares quand le ciel se réchauffe. */}
          {!warm && (i * 13) % 3 !== 0 &&
            Array.from({ length: Math.max(1, Math.floor(h / 26)) }, (_, r) => (
              <rect
                key={r}
                x={x + 5}
                y={250 - h + 8 + r * 22}
                width={5}
                height={7}
                fill={(i * 7 + r) % 5 === 0 ? '#ffcc00' : '#4a5a8a'}
                opacity={0.55}
              />
            ))}
        </g>
      )
    })}
  </g>
)

const RuralHorizon: React.FC = () => (
  <g>
    <rect x={0} y={236} width={800} height={14} fill="#060812" />
    {Array.from({ length: 16 }, (_, i) => (
      <path
        key={i}
        d={`M${i * 52 - 20} 250 L${i * 52 - 20} ${150 + ((i * 53) % 70)} L${i * 52 - 34} 250 Z`}
        fill="#05060f"
      />
    ))}
  </g>
)

const TunnelHorizon: React.FC = () => (
  <g>
    <path d="M60 250 L60 90 L740 90 L740 250 Z" fill="#241608" />
    {Array.from({ length: 6 }, (_, i) => (
      <rect
        key={i}
        x={70 + i * 115}
        y={96}
        width={54}
        height={7}
        rx={3}
        fill="#ffb347"
        opacity={0.85}
      />
    ))}
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={i} x={70 + i * 115} y={104} width={54} height={60} fill="#ffb347" opacity={0.08} />
    ))}
  </g>
)

const BridgeHorizon: React.FC = () => (
  <g>
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i}>
        <rect x={i * 100 - 20} y={150} width={9} height={100} fill="#0a0d1a" />
        <rect x={i * 100 - 30} y={142} width={30} height={9} fill="#0a0d1a" />
      </g>
    ))}
    <rect x={0} y={232} width={800} height={18} fill="#080b16" />
  </g>
)

const IndoorHorizon: React.FC = () => (
  <g>
    <rect x={0} y={0} width={230} height={260} fill="#07070c" />
    <rect x={570} y={0} width={230} height={260} fill="#07070c" />
    <rect x={0} y={0} width={800} height={40} fill="#050508" />
  </g>
)

const UndergroundHorizon: React.FC = () => (
  <g>
    {Array.from({ length: 5 }, (_, i) => (
      <rect
        key={i}
        x={120 + i * 145}
        y={70}
        width={110}
        height={8}
        fill="#7dffc0"
        opacity={0.55}
      />
    ))}
    <rect x={0} y={0} width={800} height={52} fill="#040a08" />
  </g>
)

const HorizonLayer: React.FC<{ kind: Horizon; warm: boolean }> = ({ kind, warm }) => {
  switch (kind) {
    case 'city':
      return <CityHorizon warm={warm} />
    case 'rural':
      return <RuralHorizon />
    case 'tunnel':
      return <TunnelHorizon />
    case 'bridge':
      return <BridgeHorizon />
    case 'indoor':
      return <IndoorHorizon />
    case 'underground':
      return <UndergroundHorizon />
    default:
      return null
  }
}

// --- Props de premier plan --------------------------------------------

const Prop: React.FC<{ kind: string }> = ({ kind }) => {
  switch (kind) {
    case 'sign':
      return (
        <g>
          <rect x={214} y={196} width={7} height={62} fill="#1a1a2e" />
          <rect x={186} y={176} width={62} height={26} rx={3} fill="#2a3a5e" stroke="#4a6a9e" />
          <rect x={193} y={184} width={48} height={5} fill="#8ab4f8" opacity={0.7} />
          <rect x={193} y={193} width={34} height={4} fill="#8ab4f8" opacity={0.45} />
        </g>
      )
    case 'truck':
      return (
        <g>
          <rect x={300} y={150} width={200} height={92} rx={5} fill="#0d0d18" stroke="#242438" />
          <rect x={310} y={162} width={60} height={30} fill="#1a1a2e" opacity={0.8} />
          <rect x={330} y={232} width={26} height={26} rx={4} fill="#07070c" />
          <rect x={452} y={232} width={26} height={26} rx={4} fill="#07070c" />
          <rect x={496} y={182} width={7} height={16} rx={3} fill="#ff3b30" opacity={0.95} />
          <rect x={506} y={186} width={7} height={12} rx={3} fill="#ff3b30" opacity={0.7} />
        </g>
      )
    case 'checkpoint':
      return (
        <g>
          <rect x={250} y={178} width={300} height={7} rx={3} fill="#ffcc00" opacity={0.55} />
          <rect x={250} y={214} width={300} height={7} rx={3} fill="#ffcc00" opacity={0.4} />
          <g>
            <circle cx={300} cy={196} r={13} fill="#ff2d55" opacity={0.85} />
            <circle cx={500} cy={196} r={13} fill="#2d7bff" opacity={0.85} />
          </g>
        </g>
      )
    case 'alley':
      return (
        <g>
          <rect x={0} y={40} width={210} height={220} fill="#08080e" />
          <rect x={590} y={40} width={210} height={220} fill="#08080e" />
          <rect x={250} y={236} width={70} height={30} fill="#0d1512" />
          <rect x={258} y={242} width={54} height={5} fill="#1c3a30" />
          <rect x={470} y={244} width={10} height={60} fill="#2a2a3e" />
          <circle cx={475} cy={306} r={9} fill="#ffb347" opacity={0.5} />
        </g>
      )
    case 'pole':
      return (
        <g>
          <rect x={556} y={120} width={9} height={140} fill="#1a1a2e" />
          <rect x={544} y={112} width={32} height={10} fill="#1a1a2e" />
          <rect x={520} y={118} width={22} height={7} fill="#2a2a3e" />
          <rect x={228} y={120} width={8} height={140} fill="#1a1a2e" />
        </g>
      )
    case 'roadblock':
      return (
        <g>
          {[210, 350, 490].map((x) => (
            <g key={x}>
              <rect x={x} y={196} width={86} height={9} fill="#e8e8e8" />
              <rect x={x} y={214} width={86} height={9} fill="#e94560" />
              <rect x={x + 38} y={186} width={10} height={64} fill="#9a9aa8" />
            </g>
          ))}
          <circle cx={300} cy={170} r={11} fill="#ff2d55" opacity={0.9} />
          <circle cx={420} cy={170} r={11} fill="#2d7bff" opacity={0.9} />
        </g>
      )
    case 'parking':
      return (
        <g>
          <rect x={0} y={0} width={800} height={54} fill="#061410" />
          {[90, 290, 490, 690].map((x) => (
            <rect key={x} x={x - 46} y={62} width={92} height={8} fill="#7dffc0" opacity={0.4} />
          ))}
          {[80, 300, 520].map((x) => (
            <rect key={`p${x}`} x={x} y={196} width={10} height={70} fill="#0e2a20" />
          ))}
        </g>
      )
    case 'searchlight':
      return (
        <g>
          <path d="M180 0 L470 250 L250 250 Z" fill="#e8f0ff" opacity={0.11} />
          <ellipse cx={360} cy={256} rx={120} ry={20} fill="#e8f0ff" opacity={0.14} />
          <circle cx={340} cy={40} r={5} fill="#ff3b30" opacity={0.9} />
        </g>
      )
    case 'roundabout':
      return (
        <g>
          <ellipse cx={400} cy={252} rx={210} ry={30} fill="#141428" opacity={0.75} />
          <rect x={394} y={236} width={12} height={22} fill="#2a2a3e" />
          <circle cx={400} cy={230} r={16} fill="#1c3a2a" stroke="#2a4a3a" />
          {[120, 300, 500, 680].map((x) => (
            <rect key={x} x={x} y={188} width={5} height={46} fill="#8a8aa0" opacity={0.6} />
          ))}
        </g>
      )
    case 'gas_station':
      return (
        <g>
          <rect x={0} y={78} width={800} height={64} fill="#f5e6c8" opacity={0.22} />
          <rect x={196} y={70} width={300} height={22} fill="#f5e6c8" opacity={0.32} />
          {[230, 420].map((x) => (
            <g key={x}>
              <rect x={x} y={98} width={34} height={62} rx={4} fill="#d94f4f" opacity={0.85} />
              <rect x={x + 4} y={106} width={26} height={18} fill="#1a1a1a" opacity={0.7} />
            </g>
          ))}
        </g>
      )
    case 'bridge_rail':
      return (
        <g>
          <rect x={0} y={186} width={800} height={7} fill="#2a3242" />
          <rect x={0} y={214} width={800} height={5} fill="#1c2230" />
          {Array.from({ length: 22 }, (_, i) => (
            <rect key={i} x={i * 38} y={186} width={5} height={34} fill="#232b3a" />
          ))}
        </g>
      )
    case 'market':
      return (
        <g>
          {[130, 330, 530].map((x, i) => (
            <g key={x}>
              <rect x={x} y={188} width={96} height={12} fill={['#e94560', '#ffb347', '#4ecdc4'][i]} opacity={0.55} />
              <rect x={x + 8} y={200} width={80} height={34} fill="#0d0d16" />
              <circle cx={x + 26} cy={216} r={7} fill="#3a3a4e" />
              <circle cx={x + 52} cy={214} r={7} fill="#4a3a5e" />
              <circle cx={x + 74} cy={217} r={7} fill="#2a3a4e" />
            </g>
          ))}
        </g>
      )
    case 'worksite':
      return (
        <g>
          <rect x={250} y={212} width={300} height={40} fill="#05050a" />
          <rect x={250} y={212} width={300} height={5} fill="#2a2a3e" />
          <rect x={130} y={186} width={10} height={70} fill="#ffb347" />
          <rect x={660} y={186} width={10} height={70} fill="#ffb347" />
          <rect x={120} y={180} width={560} height={9} fill="#ffb347" opacity={0.45} />
          <circle cx={300} cy={150} r={10} fill="#ff9f0a" opacity={0.9} />
        </g>
      )
    case 'trees':
      return (
        <g>
          {Array.from({ length: 12 }, (_, i) => {
            const x = i * 72 - 30
            const h = 110 + ((i * 61) % 90)
            return (
              <g key={i}>
                <rect x={x} y={250 - h} width={7} height={h} fill="#04040a" />
                <path
                  d={`M${x + 3} ${250 - h - 60} L${x + 34} ${250 - h + 10} L${x - 28} ${250 - h + 10} Z`}
                  fill="#04040a"
                />
              </g>
            )
          })}
        </g>
      )
    case 'spikes':
      return (
        <g>
          {Array.from({ length: 9 }, (_, i) => (
            <rect
              key={i}
              x={250 + i * 36}
              y={236}
              width={26}
              height={11}
              rx={2}
              fill="#6b4a2a"
              transform={`rotate(${-6 + (i % 4) * 4} ${263 + i * 36} 242)`}
            />
          ))}
        </g>
      )
    case 'water':
      return (
        <g>
          <rect x={0} y={214} width={800} height={56} fill="#0d2a3a" opacity={0.9} />
          {Array.from({ length: 10 }, (_, i) => (
            <rect
              key={i}
              x={40 + i * 78}
              y={226 + (i % 3) * 14}
              width={44}
              height={3}
              rx={2}
              fill="#4ecdc4"
              opacity={0.25}
            />
          ))}
        </g>
      )
    case 'police_cars':
      return (
        <g>
          {[
            { x: 250, c: '#ff2d55' },
            { x: 400, c: '#2d7bff' },
            { x: 550, c: '#ff2d55' },
          ].map((car, i) => (
            <g key={car.x}>
              <rect x={car.x} y={212} width={104} height={30} rx={7} fill="#0a0a12" stroke="#1e1e2e" />
              <rect x={car.x + 12} y={200} width={80} height={16} rx={5} fill="#12121c" />
              <circle cx={car.x + 30} cy={196} r={11} fill={car.c} opacity={0.95} />
              <circle cx={car.x + 74} cy={196} r={11} fill={car.c} opacity={0.75} />
              <ellipse cx={car.x + 52} cy={206} rx={70} ry={22} fill={car.c} opacity={0.09} />
              {i === 0 && <rect x={car.x} y={246} width={104} height={7} fill="#0a0a12" />}
            </g>
          ))}
        </g>
      )
    case 'home_sign':
      return (
        <g>
          <path d="M262 214 L330 160 L398 214 Z" fill="#3a2a4e" stroke="#6a4a7e" strokeWidth={2} />
          <rect x={288} y={214} width={86} height={48} fill="#2a1e38" />
          <rect x={316} y={228} width={30} height={34} rx={2} fill="#ffcc00" opacity={0.85} />
          <rect x={340} y={206} width={16} height={22} fill="#f5e6c8" opacity={0.5} />
        </g>
      )
    default:
      return null
  }
}

// --- Composant principal ---------------------------------------------

export const ChaseScene: React.FC<ChaseSceneProps> = ({ scene, state }) => {
  const def = SCENES[scene] ?? SCENES.street_start

  // Le ciel se réchauffe discrètement quand la nuit avance.
  const warm = state.step > 18
  // Intensité des lignes de vitesse, bornée pour rester lisible.
  const motion = Math.min(1, Math.max(0, state.speed / 230))
  const danger = state.pursuit / 100

  return (
    <div
      className="chase-scene"
      style={{
        background: def.sky,
        transition: 'background 900ms ease',
      }}
    >
      <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMax slice" className="chase-scene-svg">
        <HorizonLayer kind={def.horizon} warm={warm} />

        {/* Route en perspective */}
        <path d="M180 300 L300 252 L500 252 L620 300 Z" fill="#14141f" />
        <path d="M180 300 L300 252 L500 252 L620 300 Z" fill="url(#roadShine)" opacity={0.5} />
        {Array.from({ length: 7 }, (_, i) => {
          const t = i / 7
          const y = 254 + t * 46
          const w = 2 + t * 9
          return (
            <rect
              key={i}
              x={400 - w / 2}
              y={y}
              width={w}
              height={2 + t * 6}
              fill="#f8f8f2"
              opacity={0.16 + t * 0.4}
            />
          )
        })}
        {/* Bordures */}
        <rect x={299} y={252} width={3} height={48} fill="#f8f8f2" opacity={0.2} />
        <rect x={498} y={252} width={3} height={48} fill="#f8f8f2" opacity={0.2} />

        <Prop kind={def.prop} />

        <defs>
          <linearGradient id="roadShine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ab4f8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8ab4f8" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Cône des phares */}
      <div
        className="chase-headlights"
        style={{ opacity: 0.16 + Math.min(0.3, state.fuel / 320) }}
      />

      {/* Lines de vitesse proportionnelles à l'allure */}
      <div
        className="chase-speedlines"
        style={{ opacity: motion * 0.55 }}
      />

      {def.rain && <div className="chase-rain" />}

      {def.tint && <div className="chase-tint" style={{ background: def.tint }} />}

      {/* Rétroviseur : l'intensité des gyrophares suit la pression */}
      <div className="chase-mirror">
        <div className="chase-mirror-glass">
          <div
            className="chase-mirror-red"
            style={{ opacity: 0.15 + danger * 0.85 }}
          />
          <div
            className="chase-mirror-blue"
            style={{ opacity: 0.15 + danger * 0.85 }}
          />
          {danger > 0.55 && <div className="chase-mirror-hazard">RECRÉP.</div>}
        </div>
        <div className="chase-mirror-bar" />
      </div>

      {/* Saleté / dégâts sur le pare-brise */}
      {state.damage > 45 && (
        <div className="chase-windshield-damage" style={{ opacity: (state.damage - 45) / 90 }} />
      )}

      <div className="chase-vignette" />
    </div>
  )
}