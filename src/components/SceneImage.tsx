import React from 'react'

interface SceneImageProps {
  scene: string
  className?: string
}

const sceneConfigs: Record<string, { gradient: string; elements: string[] }> = {
  garage: {
    gradient: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 70%, #0f0f1a 100%)',
    elements: ['car_silhouette', 'neon_strip', 'hanging_light'],
  },
  meeting: {
    gradient: 'linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 30%, #2d1b4e 60%, #0f0f1a 100%)',
    elements: ['street_lamp', 'car_silhouette', 'smoke'],
  },
  race_start: {
    gradient: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 40%, #2d1b4e 70%, #0a0a1a 100%)',
    elements: ['speed_lines', 'car_silhouette', 'neon_strip'],
  },
  police: {
    gradient: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 30%, #4a0a2e 50%, #0a1a2e 70%, #0a0a1a 100%)',
    elements: ['police_lights', 'car_silhouette', 'rain'],
  },
  night_streets: {
    gradient: 'linear-gradient(180deg, #0a0a1a 0%, #0f1a2e 40%, #1a2a3e 70%, #0a0a1a 100%)',
    elements: ['street_lamp', 'building_silhouette', 'wet_road'],
  },
  alleys: {
    gradient: 'linear-gradient(180deg, #050508 0%, #0a0a12 40%, #12121a 70%, #050508 100%)',
    elements: ['narrow_walls', 'dumpster', 'single_light'],
  },
  mechanic: {
    gradient: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a1a 40%, #2a2a2a 70%, #0a0a0f 100%)',
    elements: ['tool_wall', 'car_lift', 'hanging_bulb'],
  },
  phone: {
    gradient: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0a0a1a 100%)',
    elements: ['phone_glow', 'message_bubbles'],
  },
  betrayal: {
    gradient: 'linear-gradient(180deg, #0a0508 0%, #1a0a12 40%, #2a0a1a 70%, #0a0508 100%)',
    elements: ['warehouse', 'single_figure', 'dramatic_light'],
  },
  truth: {
    gradient: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 30%, #2a2a4e 60%, #0a0a1a 100%)',
    elements: ['desk_light', 'papers', 'shadow_figure'],
  },
  confrontation: {
    gradient: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 30%, #2a1a3e 50%, #0a1a2e 70%, #0a0a1a 100%)',
    elements: ['group_figures', 'dawn_light', 'cars'],
  },
  dawn_fight: {
    gradient: 'linear-gradient(180deg, #1a0a2e 0%, #2a1a3e 30%, #4a2a4e 50%, #6a3a4e 70%, #8a4a4e 100%)',
    elements: ['sunrise', 'silhouettes', 'destroyed_car'],
  },
  dawn_escape: {
    gradient: 'linear-gradient(180deg, #1a1a3e 0%, #2a2a4e 30%, #4a3a5e 50%, #6a4a5e 70%, #8a5a5e 100%)',
    elements: ['open_road', 'sunrise', 'car_silhouette'],
  },
  dawn_truth: {
    gradient: 'linear-gradient(180deg, #1a1a3e 0%, #2a3a5e 30%, #4a4a6e 50%, #6a5a7e 70%, #8a6a8e 100%)',
    elements: ['city_skyline', 'sunrise', 'media_lights'],
  },
  ending_legend: {
    gradient: 'linear-gradient(180deg, #1a0a2e 0%, #2a1a4e 30%, #4a2a5e 50%, #6a3a6e 70%, #8a4a7e 100%)',
    elements: ['city_night', 'neon_signs', 'car_silhouette'],
  },
  ending_freedom: {
    gradient: 'linear-gradient(180deg, #1a1a3e 0%, #2a2a4e 30%, #4a3a5e 50%, #6a4a5e 70%, #8a5a5e 100%)',
    elements: ['open_road', 'sunrise', 'mountains'],
  },
  ending_truth: {
    gradient: 'linear-gradient(180deg, #1a1a3e 0%, #2a3a5e 30%, #4a4a6e 50%, #6a5a7e 70%, #8a6a8e 100%)',
    elements: ['courthouse', 'sunrise', 'microphones'],
  },
  ending_caught: {
    gradient: 'linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 30%, #2a0a3e 50%, #1a0a2e 70%, #0a0a1a 100%)',
    elements: ['police_lights', 'handcuffs', 'night'],
  },
  ending_veilleur: {
    gradient: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 30%, #2a2a3e 50%, #1a1a2e 70%, #0a0a1a 100%)',
    elements: ['shadow_figure', 'city_night', 'phone_glow'],
  },
  ending_secret: {
    gradient: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a1a 30%, #2a2a2a 50%, #1a1a1a 70%, #0a0a0f 100%)',
    elements: ['locked_door', 'shadow_figure', 'single_light'],
  },
}

/**
 * Toutes les clés d'élément qu'un `sceneConfigs` a le droit d'utiliser.
 *
 * Sans cette liste, une faute de frappe dans une config passe inaperçue : le
 * rendu fait un `includes('…')` qui ne trouve rien et l'élément disparaît
 * silencieusement de la scène. C'est arrivé deux fois (`neon_glow`, `shadow`).
 */
const KNOWN_ELEMENTS = new Set([
  'car_silhouette', 'neon_strip', 'street_lamp', 'police_lights', 'speed_lines',
  'rain', 'sunrise', 'phone_glow', 'shadow_figure', 'open_road', 'city_skyline',
  'building_silhouette', 'narrow_walls', 'warehouse', 'desk_light', 'group_figures',
  'destroyed_car', 'mountains', 'courthouse', 'handcuffs', 'locked_door',
  'hanging_light', 'smoke', 'wet_road', 'dumpster', 'single_light', 'tool_wall',
  'car_lift', 'hanging_bulb', 'message_bubbles', 'single_figure', 'dramatic_light',
  'papers', 'dawn_light', 'cars', 'silhouettes', 'neon_signs', 'city_night',
  'media_lights', 'microphones', 'night',
])

const warnedElements = new Set<string>()

export const SceneImage: React.FC<SceneImageProps> = ({ scene, className = '' }) => {
  const config = sceneConfigs[scene] || sceneConfigs['garage']

  for (const element of config.elements) {
    if (!KNOWN_ELEMENTS.has(element) && !warnedElements.has(element)) {
      warnedElements.add(element)
      console.warn(`[SceneImage] élément inconnu dans la scène "${scene}" : "${element}"`)
    }
  }

  return (
    <div
      className={`scene-image ${className}`}
      style={{
        background: config.gradient,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric overlay */}
      <div className="scene-overlay" />

      {/* Animated elements based on scene */}
      {config.elements.includes('car_silhouette') && <CarSilhouette />}
      {config.elements.includes('neon_strip') && <NeonStrip />}
      {config.elements.includes('street_lamp') && <StreetLamp />}
      {config.elements.includes('police_lights') && <PoliceLights />}
      {config.elements.includes('speed_lines') && <SpeedLines />}
      {config.elements.includes('rain') && <RainOverlay />}
      {config.elements.includes('sunrise') && <Sunrise />}
      {config.elements.includes('phone_glow') && <PhoneGlow />}
      {config.elements.includes('shadow_figure') && <ShadowFigure />}
      {config.elements.includes('open_road') && <OpenRoad />}
      {config.elements.includes('city_skyline') && <CitySkyline />}
      {config.elements.includes('building_silhouette') && <BuildingSilhouette />}
      {config.elements.includes('narrow_walls') && <NarrowWalls />}
      {config.elements.includes('warehouse') && <Warehouse />}
      {config.elements.includes('desk_light') && <DeskLight />}
      {config.elements.includes('group_figures') && <GroupFigures />}
      {config.elements.includes('destroyed_car') && <DestroyedCar />}
      {config.elements.includes('mountains') && <Mountains />}
      {config.elements.includes('courthouse') && <Courthouse />}
      {config.elements.includes('handcuffs') && <Handcuffs />}
      {config.elements.includes('locked_door') && <LockedDoor />}
      {config.elements.includes('hanging_light') && <HangingLight />}
      {config.elements.includes('smoke') && <Smoke />}
      {config.elements.includes('wet_road') && <WetRoad />}
      {config.elements.includes('dumpster') && <Dumpster />}
      {config.elements.includes('single_light') && <SingleLight />}
      {config.elements.includes('tool_wall') && <ToolWall />}
      {config.elements.includes('car_lift') && <CarLift />}
      {config.elements.includes('hanging_bulb') && <HangingBulb />}
      {config.elements.includes('message_bubbles') && <MessageBubbles />}
      {config.elements.includes('single_figure') && <SingleFigure />}
      {config.elements.includes('dramatic_light') && <DramaticLight />}
      {config.elements.includes('papers') && <Papers />}
      {config.elements.includes('dawn_light') && <DawnLight />}
      {config.elements.includes('cars') && <Cars />}
      {config.elements.includes('silhouettes') && <Silhouettes />}
      {config.elements.includes('neon_signs') && <NeonSigns />}
      {config.elements.includes('city_night') && <CityNight />}
      {config.elements.includes('media_lights') && <MediaLights />}
      {config.elements.includes('microphones') && <Microphones />}
      {config.elements.includes('night') && <NightOverlay />}

      {/* Vignette */}
      <div className="scene-vignette" />
    </div>
  )
}

// SVG Components for scene elements
const CarSilhouette: React.FC = () => (
  <svg className="scene-element car-silhouette" viewBox="0 0 400 200" style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '60%', opacity: 0.6 }}>
    <path d="M50 150 L80 100 L120 80 L280 80 L320 100 L350 150 L350 160 L50 160 Z" fill="#0a0a0f" stroke="#1a1a2e" strokeWidth="2" />
    <circle cx="100" cy="160" r="20" fill="#0a0a0f" stroke="#1a1a2e" strokeWidth="2" />
    <circle cx="300" cy="160" r="20" fill="#0a0a0f" stroke="#1a1a2e" strokeWidth="2" />
    <rect x="130" y="90" width="60" height="30" fill="#0a0a0f" stroke="#1a1a2e" strokeWidth="1" />
    <rect x="210" y="90" width="60" height="30" fill="#0a0a0f" stroke="#1a1a2e" strokeWidth="1" />
  </svg>
)

const NeonStrip: React.FC = () => (
  <div className="scene-element neon-strip" style={{ position: 'absolute', top: '20%', left: '10%', right: '10%', height: '2px', background: 'linear-gradient(90deg, transparent, #e94560, #7b68ee, #4ecdc4, transparent)', boxShadow: '0 0 20px #e94560, 0 0 40px #7b68ee' }} />
)

const StreetLamp: React.FC = () => (
  <div className="scene-element street-lamp" style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)' }}>
    <div style={{ width: '4px', height: '80px', background: '#2a2a3e', margin: '0 auto' }} />
    <div style={{ width: '40px', height: '20px', background: '#1a1a2e', borderRadius: '50% 50% 0 0', margin: '0 auto', boxShadow: '0 0 30px rgba(255, 200, 100, 0.3)' }} />
    <div style={{ width: '60px', height: '100px', background: 'radial-gradient(ellipse at top, rgba(255, 200, 100, 0.15), transparent)', margin: '0 auto' }} />
  </div>
)

const PoliceLights: React.FC = () => (
  <>
    <div className="scene-element police-light-red" style={{ position: 'absolute', top: '30%', left: '20%', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 0, 0, 0.4), transparent)', animation: 'pulse-red 1s infinite' }} />
    <div className="scene-element police-light-blue" style={{ position: 'absolute', top: '30%', right: '20%', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 100, 255, 0.4), transparent)', animation: 'pulse-blue 1s infinite' }} />
  </>
)

const SpeedLines: React.FC = () => (
  <div className="scene-element speed-lines" style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 52px)', animation: 'speed-lines 0.5s linear infinite' }} />
)

const RainOverlay: React.FC = () => (
  <div className="scene-element rain-overlay" style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)', animation: 'rain-fall 0.3s linear infinite' }} />
)

const Sunrise: React.FC = () => (
  <div className="scene-element sunrise" style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: 'radial-gradient(ellipse at center, rgba(255, 150, 100, 0.4), rgba(255, 100, 50, 0.2), transparent)', borderRadius: '50%' }} />
)

const PhoneGlow: React.FC = () => (
  <div className="scene-element phone-glow" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80px', height: '120px', background: 'linear-gradient(180deg, #1a1a2e, #0a0a1a)', borderRadius: '10px', border: '2px solid #2a2a3e', boxShadow: '0 0 30px rgba(123, 104, 238, 0.3)' }}>
    <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', height: '2px', background: '#7b68ee', boxShadow: '0 0 10px #7b68ee' }} />
  </div>
)

const ShadowFigure: React.FC = () => (
  <div className="scene-element shadow-figure" style={{ position: 'absolute', bottom: '20%', right: '20%', width: '60px', height: '120px', background: 'linear-gradient(180deg, #0a0a0f, transparent)', borderRadius: '50% 50% 0 0', opacity: 0.7 }} />
)

const OpenRoad: React.FC = () => (
  <div className="scene-element open-road" style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100px', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.05))', clipPath: 'polygon(40% 0%, 60% 0%, 80% 100%, 20% 100%)' }} />
)

const CitySkyline: React.FC = () => (
  <div className="scene-element city-skyline" style={{ position: 'absolute', bottom: '20%', left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, transparent, rgba(10, 10, 20, 0.8))' }}>
    <svg viewBox="0 0 800 200" style={{ width: '100%', height: '100%' }}>
      <rect x="50" y="80" width="40" height="120" fill="#0a0a1a" />
      <rect x="100" y="60" width="30" height="140" fill="#0a0a1a" />
      <rect x="140" y="100" width="50" height="100" fill="#0a0a1a" />
      <rect x="200" y="40" width="35" height="160" fill="#0a0a1a" />
      <rect x="250" y="70" width="45" height="130" fill="#0a0a1a" />
      <rect x="310" y="90" width="30" height="110" fill="#0a0a1a" />
      <rect x="350" y="50" width="40" height="150" fill="#0a0a1a" />
      <rect x="400" y="80" width="50" height="120" fill="#0a0a1a" />
      <rect x="460" y="60" width="35" height="140" fill="#0a0a1a" />
      <rect x="510" y="100" width="40" height="100" fill="#0a0a1a" />
      <rect x="560" y="70" width="45" height="130" fill="#0a0a1a" />
      <rect x="620" y="90" width="30" height="110" fill="#0a0a1a" />
      <rect x="660" y="50" width="40" height="150" fill="#0a0a1a" />
      <rect x="710" y="80" width="50" height="120" fill="#0a0a1a" />
    </svg>
  </div>
)

const BuildingSilhouette: React.FC = () => (
  <div className="scene-element building-silhouette" style={{ position: 'absolute', bottom: '20%', left: 0, right: 0, height: '50%', background: 'linear-gradient(180deg, transparent, rgba(10, 10, 20, 0.6))' }}>
    <svg viewBox="0 0 800 200" style={{ width: '100%', height: '100%' }}>
      <rect x="0" y="100" width="100" height="100" fill="#0a0a1a" />
      <rect x="120" y="60" width="80" height="140" fill="#0a0a1a" />
      <rect x="220" y="80" width="120" height="120" fill="#0a0a1a" />
      <rect x="360" y="40" width="100" height="160" fill="#0a0a1a" />
      <rect x="480" y="70" width="80" height="130" fill="#0a0a1a" />
      <rect x="580" y="90" width="100" height="110" fill="#0a0a1a" />
      <rect x="700" y="50" width="100" height="150" fill="#0a0a1a" />
    </svg>
  </div>
)

const NarrowWalls: React.FC = () => (
  <>
    <div className="scene-element narrow-wall-left" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '20%', background: 'linear-gradient(90deg, #0a0a0f, transparent)' }} />
    <div className="scene-element narrow-wall-right" style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '20%', background: 'linear-gradient(-90deg, #0a0a0f, transparent)' }} />
  </>
)

const Warehouse: React.FC = () => (
  <div className="scene-element warehouse" style={{ position: 'absolute', top: '20%', left: '10%', right: '10%', height: '60%', background: 'linear-gradient(180deg, #0a0a0f, #12121a)', border: '1px solid #1a1a2e' }}>
    <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', height: '2px', background: '#1a1a2e' }} />
    <div style={{ position: 'absolute', top: '30%', left: '10%', right: '10%', height: '2px', background: '#1a1a2e' }} />
    <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', background: '#1a1a2e' }} />
  </div>
)

const DeskLight: React.FC = () => (
  <div className="scene-element desk-light" style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '60px', background: 'radial-gradient(ellipse at center, rgba(255, 200, 100, 0.2), transparent)' }} />
)

const GroupFigures: React.FC = () => (
  <div className="scene-element group-figures" style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '20px' }}>
    {[0, 1, 2, 3].map(i => (
      <div key={i} style={{ width: '30px', height: '80px', background: 'linear-gradient(180deg, #0a0a0f, transparent)', borderRadius: '50% 50% 0 0', opacity: 0.6 }} />
    ))}
  </div>
)

const DestroyedCar: React.FC = () => (
  <div className="scene-element destroyed-car" style={{ position: 'absolute', bottom: '15%', left: '50%', width: '120px', height: '40px', background: '#0a0a0f', borderRadius: '10px', opacity: 0.5, transform: 'translateX(-50%) rotate(-5deg)' }} />
)

const Mountains: React.FC = () => (
  <div className="scene-element mountains" style={{ position: 'absolute', bottom: '20%', left: 0, right: 0, height: '30%', background: 'linear-gradient(180deg, transparent, rgba(10, 10, 20, 0.4))' }}>
    <svg viewBox="0 0 800 100" style={{ width: '100%', height: '100%' }}>
      <polygon points="0,100 100,40 200,80 300,20 400,60 500,30 600,70 700,40 800,80 800,100" fill="#0a0a1a" />
    </svg>
  </div>
)

const Courthouse: React.FC = () => (
  <div className="scene-element courthouse" style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', width: '150px', height: '100px', background: 'linear-gradient(180deg, #1a1a2e, #0a0a1a)', border: '1px solid #2a2a3e' }}>
    <div style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', width: '0', height: '0', borderLeft: '60px solid transparent', borderRight: '60px solid transparent', borderBottom: '20px solid #1a1a2e' }} />
  </div>
)

const Handcuffs: React.FC = () => (
  <div className="scene-element handcuffs" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60px', height: '30px', border: '3px solid #2a2a3e', borderRadius: '15px', opacity: 0.5 }} />
)

const LockedDoor: React.FC = () => (
  <div className="scene-element locked-door" style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '80px', height: '120px', background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)', border: '2px solid #2a2a2a', borderRadius: '5px' }}>
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', background: '#2a2a2a', borderRadius: '50%' }} />
  </div>
)

const HangingLight: React.FC = () => (
  <div className="scene-element hanging-light" style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
    <div style={{ width: '2px', height: '40px', background: '#2a2a3e', margin: '0 auto' }} />
    <div style={{ width: '30px', height: '15px', background: '#1a1a2e', borderRadius: '50%', margin: '0 auto', boxShadow: '0 0 20px rgba(255, 200, 100, 0.2)' }} />
  </div>
)

const Smoke: React.FC = () => (
  <div className="scene-element smoke" style={{ position: 'absolute', bottom: '30%', left: '30%', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent)', borderRadius: '50%', animation: 'smoke 3s ease-in-out infinite' }} />
)

const WetRoad: React.FC = () => (
  <div className="scene-element wet-road" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%', background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.03))' }} />
)

const Dumpster: React.FC = () => (
  <div className="scene-element dumpster" style={{ position: 'absolute', bottom: '25%', left: '15%', width: '60px', height: '40px', background: '#0a0a0f', border: '1px solid #1a1a2e', borderRadius: '3px' }} />
)

const SingleLight: React.FC = () => (
  <div className="scene-element single-light" style={{ position: 'absolute', top: '20%', right: '20%', width: '40px', height: '40px', background: 'radial-gradient(circle, rgba(255, 200, 100, 0.3), transparent)', borderRadius: '50%' }} />
)

const ToolWall: React.FC = () => (
  <div className="scene-element tool-wall" style={{ position: 'absolute', top: '10%', left: '5%', right: '5%', height: '30%', background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)', border: '1px solid #2a2a2a' }}>
    <div style={{ position: 'absolute', top: '20%', left: '10%', right: '10%', height: '2px', background: '#2a2a2a' }} />
    <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '2px', background: '#2a2a2a' }} />
  </div>
)

const CarLift: React.FC = () => (
  <div className="scene-element car-lift" style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '60px', background: '#0a0a0f', border: '1px solid #1a1a2e' }}>
    <div style={{ position: 'absolute', bottom: '-20px', left: '20%', width: '10px', height: '20px', background: '#1a1a2e' }} />
    <div style={{ position: 'absolute', bottom: '-20px', right: '20%', width: '10px', height: '20px', background: '#1a1a2e' }} />
  </div>
)

const HangingBulb: React.FC = () => (
  <div className="scene-element hanging-bulb" style={{ position: 'absolute', top: 0, left: '30%' }}>
    <div style={{ width: '1px', height: '30px', background: '#2a2a2a', margin: '0 auto' }} />
    <div style={{ width: '15px', height: '15px', background: '#ffcc00', borderRadius: '50%', margin: '0 auto', boxShadow: '0 0 20px rgba(255, 200, 0, 0.4)' }} />
  </div>
)

const MessageBubbles: React.FC = () => (
  <div className="scene-element message-bubbles" style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div style={{ background: '#1a1a2e', padding: '8px 12px', borderRadius: '10px', fontSize: '10px', color: '#7b68ee', maxWidth: '120px' }}>Message 1</div>
    <div style={{ background: '#1a1a2e', padding: '8px 12px', borderRadius: '10px', fontSize: '10px', color: '#7b68ee', maxWidth: '120px', alignSelf: 'flex-end' }}>Message 2</div>
  </div>
)

const SingleFigure: React.FC = () => (
  <div className="scene-element single-figure" style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '100px', background: 'linear-gradient(180deg, #0a0a0f, transparent)', borderRadius: '50% 50% 0 0', opacity: 0.8 }} />
)

const DramaticLight: React.FC = () => (
  <div className="scene-element dramatic-light" style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent)', borderRadius: '50%' }} />
)

const Papers: React.FC = () => (
  <div className="scene-element papers" style={{ position: 'absolute', bottom: '30%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{ width: '30px', height: '40px', background: '#1a1a2e', opacity: 0.5, transform: `rotate(${(i - 1) * 10}deg)` }} />
    ))}
  </div>
)

const DawnLight: React.FC = () => (
  <div className="scene-element dawn-light" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(180deg, rgba(255, 150, 100, 0.1), transparent)' }} />
)

const Cars: React.FC = () => (
  <div className="scene-element cars" style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '30px' }}>
    {[0, 1].map(i => (
      <div key={i} style={{ width: '80px', height: '30px', background: '#0a0a0f', borderRadius: '5px', opacity: 0.6 }} />
    ))}
  </div>
)

const Silhouettes: React.FC = () => (
  <div className="scene-element silhouettes" style={{ position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '15px' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{ width: '25px', height: '60px', background: 'linear-gradient(180deg, #0a0a0f, transparent)', borderRadius: '50% 50% 0 0', opacity: 0.7 }} />
    ))}
  </div>
)

const NeonSigns: React.FC = () => (
  <div className="scene-element neon-signs" style={{ position: 'absolute', top: '15%', left: '10%', right: '10%', display: 'flex', justifyContent: 'space-around' }}>
    <div style={{ width: '40px', height: '40px', background: '#e94560', borderRadius: '50%', boxShadow: '0 0 20px #e94560', opacity: 0.6 }} />
    <div style={{ width: '30px', height: '30px', background: '#4ecdc4', borderRadius: '50%', boxShadow: '0 0 20px #4ecdc4', opacity: 0.6 }} />
    <div style={{ width: '35px', height: '35px', background: '#7b68ee', borderRadius: '50%', boxShadow: '0 0 20px #7b68ee', opacity: 0.6 }} />
  </div>
)

const CityNight: React.FC = () => (
  <div className="scene-element city-night" style={{ position: 'absolute', bottom: '20%', left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, transparent, rgba(10, 10, 20, 0.8))' }}>
    <svg viewBox="0 0 800 200" style={{ width: '100%', height: '100%' }}>
      <rect x="50" y="100" width="40" height="100" fill="#0a0a1a" />
      <rect x="100" y="80" width="30" height="120" fill="#0a0a1a" />
      <rect x="140" y="110" width="50" height="90" fill="#0a0a1a" />
      <rect x="200" y="70" width="35" height="130" fill="#0a0a1a" />
      <rect x="250" y="90" width="45" height="110" fill="#0a0a1a" />
      <rect x="310" y="100" width="30" height="100" fill="#0a0a1a" />
      <rect x="350" y="80" width="40" height="120" fill="#0a0a1a" />
      <rect x="400" y="100" width="50" height="100" fill="#0a0a1a" />
      <rect x="460" y="90" width="35" height="110" fill="#0a0a1a" />
      <rect x="510" y="110" width="40" height="90" fill="#0a0a1a" />
      <rect x="560" y="80" width="45" height="120" fill="#0a0a1a" />
      <rect x="620" y="100" width="30" height="100" fill="#0a0a1a" />
      <rect x="660" y="70" width="40" height="130" fill="#0a0a1a" />
      <rect x="710" y="90" width="50" height="110" fill="#0a0a1a" />
    </svg>
  </div>
)

const MediaLights: React.FC = () => (
  <div className="scene-element media-lights" style={{ position: 'absolute', top: '20%', left: '20%', right: '20%', display: 'flex', justifyContent: 'space-around' }}>
    {[0, 1, 2, 3].map(i => (
      <div key={i} style={{ width: '30px', height: '30px', background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent)', borderRadius: '50%', animation: `pulse-red ${1 + i * 0.2}s infinite` }} />
    ))}
  </div>
)

const Microphones: React.FC = () => (
  <div className="scene-element microphones" style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{ width: '8px', height: '40px', background: '#2a2a3e', borderRadius: '4px', transform: `rotate(${(i - 1) * 15}deg)` }} />
    ))}
  </div>
)

const NightOverlay: React.FC = () => (
  <div className="scene-element night-overlay" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />
)

































































































































































