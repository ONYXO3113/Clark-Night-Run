import React from 'react'

// ============================================
// CLARK: NIGHT RUN — Décor du menu principal
//
// Ville en trois plans : ciel étoilé, skyline lointaine allumée, puis la route
// mouillée qui renvoie les néons. Dessiné en SVG plutôt qu'en CSS pour garder
// le contrôle sur les détails et rester net à toutes les tailles.
// ============================================

/** Positions des étoiles : x, y, rayon, opacité. */
const STARS: [number, number, number, number][] = [
  [40, 24, 1.4, 0.55], [96, 52, 1, 0.4], [150, 18, 1.6, 0.6], [214, 66, 1, 0.3],
  [268, 34, 1.2, 0.45], [322, 80, 1.8, 0.7], [380, 22, 1, 0.35], [432, 58, 1.4, 0.5],
  [498, 30, 1.1, 0.4], [548, 74, 1.5, 0.55], [604, 20, 1, 0.3], [652, 60, 1.7, 0.6],
  [706, 38, 1.2, 0.45], [756, 78, 1.3, 0.5], [24, 92, 1, 0.28], [178, 104, 1.1, 0.3],
  [286, 96, 1.2, 0.32], [466, 104, 1, 0.26], [584, 92, 1.1, 0.3], [726, 108, 1, 0.24],
]

/** Immeubles de la skyline : x, largeur, hauteur, couleur, densité de fenêtres. */
const SKYLINE: [number, number, number, string, number][] = [
  [-20, 74, 210, '#0b0d1c', 3],
  [56, 52, 150, '#0a0c1a', 2],
  [110, 88, 268, '#0c0e20', 4],
  [200, 46, 176, '#0a0c1a', 2],
  [248, 96, 312, '#0d1024', 5],
  [346, 58, 196, '#0a0c1a', 2],
  [406, 82, 244, '#0b0d1e', 3],
  [490, 50, 158, '#0a0c1a', 2],
  [542, 104, 336, '#0c0f22', 5],
  [648, 56, 186, '#0a0c1a', 2],
  [706, 90, 262, '#0b0d1e', 4],
  [798, 60, 200, '#0a0c1a', 2],
]

export const MenuBackdrop: React.FC = () => (
  <svg
    className="menu-backdrop"
    viewBox="0 0 800 600"
    preserveAspectRatio="xMidYMax slice"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="mb-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#04040b" />
        <stop offset="45%" stopColor="#0b0a1e" />
        <stop offset="78%" stopColor="#1c1030" />
        <stop offset="100%" stopColor="#2c1436" />
      </linearGradient>

      <linearGradient id="mb-haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e94560" stopOpacity="0.16" />
        <stop offset="60%" stopColor="#7b68ee" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#7b68ee" stopOpacity="0" />
      </linearGradient>

      <linearGradient id="mb-road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#14121f" />
        <stop offset="100%" stopColor="#08070d" />
      </linearGradient>

      <linearGradient id="mb-refl-red" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e94560" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#e94560" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="mb-refl-blue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4a6aff" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#4a6aff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="mb-refl-teal" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4ecdc4" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#4ecdc4" stopOpacity="0" />
      </linearGradient>

      <filter id="mb-blur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>

    <rect x="0" y="0" width="800" height="600" fill="url(#mb-sky)" />

    {/* Étoiles */}
    <g className="mb-stars">
      {STARS.map(([x, y, r, o], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" opacity={o} />
      ))}
    </g>

    {/* Lueur d'horizon */}
    <rect x="0" y="240" width="800" height="220" fill="url(#mb-haze)" />

    {/* Gyrophares lointains, à peine perceptibles */}
    <g filter="url(#mb-blur)" opacity="0.75">
      <ellipse className="mb-glow-red" cx="612" cy="330" rx="62" ry="40" fill="#e94560" />
      <ellipse className="mb-glow-blue" cx="668" cy="336" rx="62" ry="40" fill="#3d6bff" />
    </g>

    {/* Skyline lointaine */}
    <g>
      {SKYLINE.map(([x, w, h, fill, density], i) => (
        <g key={i}>
          <rect x={x} y={430 - h} width={w} height={h} fill={fill} />
          {/* Toit */}
          {i % 3 === 0 && (
            <rect x={x + w / 2 - 2} y={430 - h - 26} width="4" height="26" fill={fill} />
          )}
          {Array.from({ length: Math.ceil(h / 34) }, (_, r) => (
            <g key={r}>
              {Array.from({ length: Math.max(1, Math.floor(w / 26)) }, (_, c) => {
                // Un third des fenêtres est éteinte : la ville n'est pas pleine.
                if ((i * 7 + r * 3 + c) % 4 === 0) return null
                const warm = (i + r + c) % 5 === 0
                return (
                  <rect
                    key={c}
                    x={x + 10 + c * 24}
                    y={430 - h + 16 + r * 32}
                    width="9"
                    height="13"
                    fill={warm ? '#ffcc66' : '#6f86c4'}
                    opacity={warm ? 0.72 : 0.4}
                  />
                )
              })}
            </g>
          ))}
        </g>
      ))}
    </g>

    {/* Route mouillée */}
    <rect x="0" y="430" width="800" height="170" fill="url(#mb-road)" />

    {/* Reflets de néons sur l'asphalte */}
    <g filter="url(#mb-blur)">
      <rect className="mb-refl-red" x="596" y="432" width="44" height="150" fill="url(#mb-refl-red)" />
      <rect className="mb-refl-blue" x="652" y="432" width="44" height="150" fill="url(#mb-refl-blue)" />
      <rect x="120" y="432" width="30" height="120" fill="url(#mb-refl-teal)" />
      <rect x="292" y="432" width="26" height="110" fill="url(#mb-refl-red)" opacity="0.5" />
      <rect x="486" y="432" width="30" height="130" fill="url(#mb-refl-teal)" opacity="0.45" />
    </g>

    {/* Ligne de fuite de la route */}
    <g opacity="0.3">
      <rect x="392" y="446" width="16" height="6" fill="#f8f8f2" />
      <rect x="386" y="466" width="28" height="8" fill="#f8f8f2" opacity="0.7" />
      <rect x="378" y="492" width="44" height="11" fill="#f8f8f2" opacity="0.45" />
    </g>

    {/* Brume basse */}
    <rect x="0" y="400" width="800" height="80" fill="#2c1436" opacity="0.35" />
  </svg>
)