/*
 * Ressources du livre-jeu statique : illustrations SVG, feuille de style et
 * script de jeu.
 *
 * Toutes les images produites ici sont des dessins vectoriels originaux
 * écrits pour ce livre. Elles sont donc libres de droit par construction :
 * aucune banque d'images, aucun retraitement, aucune dépendance externe.
 */

const W = 800
const H = 450
const px = (pct) => Math.round((pct / 100) * W)
const py = (pct) => Math.round((pct / 100) * H)

// ============================================
// Dessins
// ============================================

/** Bloc d'immeubles en silhouette. */
function skyline(bottomPct, heightPct, fill, bars) {
  const top = H - py(heightPct)
  const ground = H - py(bottomPct)
  let out = ''
  bars.forEach(([x, w, h]) => {
    out += `<rect x="${x}" y="${ground - h}" width="${w}" height="${h + 40}" fill="${fill}"/>`
  })
  void top
  return out
}

const SKYLINE_CITY = [
  [40, 42, 118], [96, 30, 96], [140, 52, 130], [206, 34, 100], [252, 46, 142],
  [312, 28, 88], [352, 40, 124], [404, 50, 106], [466, 34, 136], [512, 42, 92],
  [566, 44, 126], [622, 30, 104], [664, 40, 132], [716, 48, 112],
]

const SKYLINE_WIDE = [
  [0, 104, 126], [120, 82, 168], [220, 124, 138], [360, 104, 190],
  [482, 82, 156], [584, 102, 134], [702, 98, 176],
]

function mountainRange(bottomPct, fill) {
  const y = H - py(bottomPct)
  return `<polygon points="0,${y + 40} 100,${y - 34} 200,${y + 4} 300,${y - 58} 400,${y - 6} 500,${y - 44} 600,${y - 2} 700,${y - 36} 800,${y - 10} 800,${y + 40}" fill="${fill}"/>`
}

/** Voiture de profil, centrée sur cxPct, posée sur la ligne basse. */
function carSilhouette(cxPct, bottomPct, scale, bodyFill, edge) {
  const x = px(cxPct)
  const y = H - py(bottomPct)
  // Le décalage de -180 garantit que la roue la plus basse touche la ligne.
  return `<g transform="translate(${x} ${y}) scale(${scale}) translate(-200 -180)">
    <path d="M50 150 L80 100 L120 80 L280 80 L320 100 L350 150 L350 160 L50 160 Z" fill="${bodyFill}" stroke="${edge}" stroke-width="2"/>
    <path d="M126 92 L188 92 L188 120 L118 120 Z" fill="${edge}" opacity="0.55"/>
    <path d="M200 92 L272 92 L292 120 L200 120 Z" fill="${edge}" opacity="0.55"/>
    <circle cx="100" cy="160" r="20" fill="${bodyFill}" stroke="${edge}" stroke-width="2"/>
    <circle cx="300" cy="160" r="20" fill="${bodyFill}" stroke="${edge}" stroke-width="2"/>
  </g>`
}

function streetLamp(xPct, tint) {
  const x = px(xPct)
  const y = py(10)
  return `<g>
    <rect x="${x - 2}" y="${y}" width="4" height="86" fill="#2a2a3e"/>
    <path d="M${x - 20} ${y + 6} q20 -22 40 0 z" fill="#1a1a2e"/>
    <ellipse cx="${x}" cy="${y + 88}" rx="66" ry="52" fill="url(#glow${tint})"/>
  </g>`
}

function policeLights(yPct) {
  const y = py(yPct)
  return `<g>
    <circle cx="${px(18)}" cy="${y}" r="86" fill="url(#glowred)">
      <animate attributeName="opacity" values="0.15;0.95;0.15" dur="1.3s" repeatCount="indefinite"/>
    </circle>
    <circle cx="${px(82)}" cy="${y}" r="86" fill="url(#glowblue)">
      <animate attributeName="opacity" values="0.15;0.95;0.15" dur="1.3s" begin="0.65s" repeatCount="indefinite"/>
    </circle>
    <rect x="0" y="${y - 2}" width="${W}" height="4" fill="#e94560" opacity="0.18">
      <animate attributeName="opacity" values="0.06;0.4;0.06" dur="1.3s" repeatCount="indefinite"/>
    </rect>
  </g>`
}

function rain() {
  let out = ''
  for (let i = 0; i < 46; i++) {
    const x = (i * 37) % W
    const dur = (0.55 + ((i * 13) % 7) / 20).toFixed(2)
    const off = (((i * 29) % 100) / 100).toFixed(2)
    out += `<line x1="${x}" y1="-40" x2="${x - 14}" y2="0" stroke="#cfe8ff" stroke-width="1.2" opacity="0.4">
      <animateTransform attributeName="transform" type="translate" values="0 -40;40 ${H + 40}" dur="${dur}s" begin="-${off}s" repeatCount="indefinite"/>
    </line>`
  }
  return `<g>${out}</g>`
}

function speedLines() {
  let out = ''
  for (let i = 0; i < 16; i++) {
    const y = 18 + i * 14
    const w = 60 + ((i * 53) % 150)
    out += `<rect x="${-w}" y="${y}" width="${w}" height="2" fill="#ffffff" opacity="0.08">
      <animate attributeName="x" values="-${w};${W}" dur="${(0.8 + (i % 5) * 0.16).toFixed(2)}s" repeatCount="indefinite"/>
    </rect>`
  }
  return `<g>${out}</g>`
}

function sunrise(bottomPct) {
  const y = H - py(bottomPct)
  return `<g>
    <ellipse cx="${W / 2}" cy="${y}" rx="230" ry="120" fill="url(#glowdawn)">
      <animate attributeName="rx" values="200;250;200" dur="9s" repeatCount="indefinite"/>
    </ellipse>
    <circle cx="${W / 2}" cy="${y}" r="52" fill="#ffb27a" opacity="0.55"/>
  </g>`
}

function dawnGlow(heightPct) {
  return `<rect x="0" y="0" width="${W}" height="${py(heightPct)}" fill="url(#glowhorizon)"/>`
}

function phoneGlow(cxPct, cyPct) {
  const x = px(cxPct)
  const y = py(cyPct)
  return `<g>
    <ellipse cx="${x}" cy="${y}" rx="130" ry="160" fill="url(#glowviolet)"/>
    <rect x="${x - 40}" y="${y - 60}" width="80" height="120" rx="12" fill="#16162a" stroke="#7b68ee" stroke-width="2"/>
    <rect x="${x - 28}" y="${y - 48}" width="56" height="3" fill="#7b68ee">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.6s" repeatCount="indefinite"/>
    </rect>
    <rect x="${x - 28}" y="${y - 34}" width="38" height="3" fill="#5a4fa0"/>
    <rect x="${x - 28}" y="${y - 20}" width="48" height="3" fill="#5a4fa0"/>
  </g>`
}

function shadowFigure(xPct, bottomPct, opacity) {
  const x = px(xPct)
  const y = H - py(bottomPct)
  return `<g opacity="${opacity}">
    <ellipse cx="${x}" cy="${y - 62}" rx="17" ry="20" fill="#07070c"/>
    <path d="M${x - 28} ${y} q0 -74 28 -74 q28 0 28 74 z" fill="#07070c"/>
  </g>`
}

function figures(count, cxPct, bottomPct, gap, scale) {
  const x0 = px(cxPct)
  const y = H - py(bottomPct)
  let out = ''
  for (let i = 0; i < count; i++) {
    const x = x0 + (i - (count - 1) / 2) * gap
    out += `<g transform="translate(${x} ${y}) scale(${scale})" opacity="0.82">
      <ellipse cx="0" cy="-62" rx="14" ry="17" fill="#07070c"/>
      <path d="M-22 0 q0 -62 22 -62 q22 0 22 62 z" fill="#07070c"/>
    </g>`
  }
  return out
}

function openRoad(bottomPct) {
  const y = H - py(bottomPct)
  return `<g>
    <path d="M${W / 2 - 40} ${y - 90} L${W / 2 + 40} ${y - 90} L${W / 2 + 240} ${y + 30} L${W / 2 - 240} ${y + 30} Z" fill="#ffffff" opacity="0.05"/>
    <path d="M${W / 2 - 26} ${y - 90} L${W / 2 + 26} ${y - 90} L${W / 2 + 110} ${y + 30} L${W / 2 - 110} ${y + 30} Z" fill="#2a2a3e" opacity="0.5"/>
    <rect x="${W / 2 - 3}" y="${y - 70}" width="6" height="34" fill="#ffcc00" opacity="0.7"/>
  </g>`
}

function wetRoad(heightPct) {
  const y = H - py(heightPct)
  return `<rect x="0" y="${y}" width="${W}" height="${py(heightPct)}" fill="url(#glowroad)"/>`
}

function narrowWalls() {
  return `<g>
    <polygon points="0,0 170,120 170,${H - 70} 0,${H}" fill="#07070c"/>
    <polygon points="${W},0 ${W - 170},120 ${W - 170},${H - 70} ${W},${H}" fill="#07070c"/>
  </g>`
}

function warehouse() {
  return `<g>
    <rect x="${px(8)}" y="${py(22)}" width="${px(84)}" height="${py(56)}" fill="#0b0b12" stroke="#1e1e33" stroke-width="2"/>
    ${[30, 48, 66].map((p) => `<rect x="${px(16)}" y="${py(p)}" width="${px(68)}" height="3" fill="#1e1e33"/>`).join('')}
  </g>`
}

function deskLight() {
  return `<g>
    <ellipse cx="${W / 2}" cy="${py(55)}" rx="150" ry="90" fill="url(#glowwarm)"/>
    <rect x="${W / 2 - 52}" y="${py(52)}" width="104" height="10" rx="5" fill="#1a1a2e"/>
  </g>`
}

function papers() {
  return `<g opacity="0.75">${[0, 1, 2]
    .map(
      (i) =>
        `<rect x="${W / 2 - 62 + i * 22}" y="${py(62) + i * 4}" width="46" height="60" fill="#1e1e33" transform="rotate(${(i - 1) * 11} ${W / 2} ${py(62)})"/>`
    )
    .join('')}</g>`
}

function brokenCar() {
  const y = H - py(28)
  return `<g opacity="0.8">
    <path d="M${W / 2 - 120} ${y} L${W / 2 - 96} ${y - 34} L${W / 2 + 20} ${y - 40} L${W / 2 + 66} ${y - 12} L${W / 2 + 118} ${y - 20} L${W / 2 + 126} ${y + 6} L${W / 2 - 124} ${y + 6} Z" fill="#07070c" stroke="#22223a" stroke-width="2" transform="rotate(-5 ${W / 2} ${y})"/>
    <circle cx="${W / 2 - 76}" cy="${y + 8}" r="17" fill="#07070c" stroke="#22223a" stroke-width="2"/>
    <circle cx="${W / 2 + 78}" cy="${y + 8}" r="17" fill="#07070c" stroke="#22223a" stroke-width="2"/>
  </g>`
}

function courthouse() {
  const y = H - py(34)
  return `<g>
    <rect x="${W / 2 - 90}" y="${y - 70}" width="180" height="120" fill="#16162a" stroke="#2a2a3e" stroke-width="2"/>
    <polygon points="${W / 2 - 118},${y - 70} ${W / 2 + 118},${y - 70} ${W / 2},${y - 122}" fill="#1e1e33" stroke="#2a2a3e" stroke-width="2"/>
    ${[-60, -20, 20, 60].map((d) => `<rect x="${W / 2 + d - 6}" y="${y - 52}" width="12" height="102" fill="#0d0d18"/>`).join('')}
  </g>`
}

function handcuffs() {
  return `<g opacity="0.75" fill="none" stroke="#2f2f4a" stroke-width="7">
    <circle cx="${W / 2 - 30}" cy="${H / 2}" r="26"/>
    <circle cx="${W / 2 + 30}" cy="${H / 2}" r="26"/>
    <path d="M${W / 2 - 6} ${H / 2 - 8} L${W / 2 + 6} ${H / 2 - 8}"/>
  </g>`
}

function lockedDoor() {
  const x = px(50)
  return `<g>
    <rect x="${x - 48}" y="${py(24)}" width="96" height="160" fill="#141414" stroke="#2a2a2a" stroke-width="3" rx="5"/>
    <circle cx="${x}" cy="${py(24) + 80}" r="11" fill="#2a2a2a"/>
    <rect x="${x - 34}" y="${py(32)}" width="68" height="8" fill="#202020"/>
  </g>`
}

function hangingLight(cxPct, color) {
  const x = px(cxPct)
  return `<g>
    <rect x="${x - 1}" y="0" width="2" height="${py(14)}" fill="#2a2a3e"/>
    <ellipse cx="${x}" cy="${py(15)}" rx="24" ry="11" fill="#1a1a2e"/>
    <ellipse cx="${x}" cy="${py(16)}" rx="60" ry="46" fill="url(#glowwarm)"/>
    <circle cx="${x}" cy="${py(14)}" r="6" fill="${color}"/>
  </g>`
}

function smoke(xPct, yPct) {
  const x = px(xPct)
  const y = py(yPct)
  return `<g>
    ${[0, 1, 2]
      .map(
        (i) =>
          `<circle cx="${x + i * 26}" cy="${y - i * 18}" r="${34 - i * 6}" fill="#ffffff" opacity="0.05">
            <animate attributeName="cy" values="${y};${y - 46}" dur="${(3 + i).toFixed(1)}s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.06;0" dur="${(3 + i).toFixed(1)}s" repeatCount="indefinite"/>
          </circle>`
      )
      .join('')}
  </g>`
}

function dumpster() {
  const x = px(14)
  const y = H - py(30)
  return `<g>
    <rect x="${x}" y="${y}" width="84" height="52" fill="#07070c" stroke="#1e1e33" stroke-width="2" rx="4"/>
    <rect x="${x + 4}" y="${y - 12}" width="76" height="14" fill="#0b0b12" stroke="#1e1e33" stroke-width="2"/>
  </g>`
}

function singleLight(xPct, yPct, color) {
  return `<g>
    <circle cx="${px(xPct)}" cy="${py(yPct)}" r="70" fill="url(#glow${color})"/>
    <circle cx="${px(xPct)}" cy="${py(yPct)}" r="7" fill="${color === 'blue' ? '#4ecdc4' : '#ffcc00'}"/>
  </g>`
}

function toolWall() {
  return `<g>
    <rect x="${px(4)}" y="${py(10)}" width="${px(92)}" height="${py(32)}" fill="#141414" stroke="#26262a" stroke-width="2"/>
    ${[22, 44, 66].map((p) => `<rect x="${px(9)}" y="${py(p)}" width="${px(82)}" height="3" fill="#26262a"/>`).join('')}
    ${[14, 20, 26, 32, 38, 44, 50, 56, 62, 68, 74, 80]
      .map((p) => `<rect x="${px(p)}" y="${py(24)}" width="6" height="${py(16)}" fill="#202024"/>`)
      .join('')}
  </g>`
}

function carLift() {
  const y = H - py(34)
  return `<g>
    <rect x="${W / 2 - 80}" y="${y - 70}" width="160" height="60" fill="#07070c" stroke="#1e1e33" stroke-width="2" rx="8"/>
    <rect x="${W / 2 - 58}" y="${y + 4}" width="16" height="26" fill="#1e1e33"/>
    <rect x="${W / 2 + 42}" y="${y + 4}" width="16" height="26" fill="#1e1e33"/>
  </g>`
}

function messageBubbles() {
  const x = W / 2
  return `<g font-size="11" font-family="monospace">
    <rect x="${x - 150}" y="${py(34)}" width="130" height="30" rx="10" fill="#1a1a2e" stroke="#7b68ee" stroke-width="1"/>
    <rect x="${x - 132}" y="${py(34) + 13}" width="80" height="4" fill="#7b68ee" opacity="0.7">
      <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2.4s" repeatCount="indefinite"/>
    </rect>
    <rect x="${x + 20}" y="${py(42)}" width="130" height="30" rx="10" fill="#1a1a2e" stroke="#4ecdc4" stroke-width="1"/>
    <rect x="${x + 40}" y="${py(42) + 13}" width="80" height="4" fill="#4ecdc4" opacity="0.7">
      <animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.4s" begin="1.2s" repeatCount="indefinite"/>
    </rect>
  </g>`
}

function dramaticLight(cxPct, cyPct) {
  return `<ellipse cx="${px(cxPct)}" cy="${py(cyPct)}" rx="180" ry="180" fill="url(#glowwarm)"/>`
}

function neonSigns() {
  return `<g>${[
    [20, 46, '#e94560'],
    [42, 34, '#4ecdc4'],
    [64, 40, '#7b68ee'],
    [84, 30, '#ffcc00'],
  ]
    .map(
      ([p, r, c]) =>
        `<circle cx="${px(p)}" cy="${py(20)}" r="${r}" fill="${c}" opacity="0.45">
          <animate attributeName="opacity" values="0.15;0.6;0.15" dur="${(2 + p / 20).toFixed(1)}s" repeatCount="indefinite"/>
        </circle>`
    )
    .join('')}</g>`
}

function mediaLights(count) {
  return `<g>${Array.from({ length: count }, (_, i) => {
    const p = 50 + (i - (count - 1) / 2) * 14
    return `<circle cx="${px(p)}" cy="${py(26)}" r="34" fill="url(#glowwhite)">
      <animate attributeName="opacity" values="0.1;0.8;0.1" dur="${(1 + i * 0.25).toFixed(2)}s" repeatCount="indefinite"/>
    </circle>`
  }).join('')}</g>`
}

function microphones(count) {
  const x = W / 2
  return `<g>${Array.from({ length: count }, (_, i) => {
    const d = (i - (count - 1) / 2) * 26
    return `<g transform="translate(${x + d} ${H - py(28)}) rotate(${(i - 1) * 16})">
      <rect x="-4" y="-52" width="8" height="52" rx="4" fill="#2a2a3e"/>
      <circle cx="0" cy="-54" r="7" fill="#3a3a52"/>
    </g>`
  }).join('')}</g>`
}

function neonStrip() {
  return `<rect x="${px(8)}" y="${py(22)}" width="${px(84)}" height="3" fill="url(#glowneon)">
    <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite"/>
  </rect>`
}

function groundGlow() {
  return `<rect x="0" y="${H - 26}" width="${W}" height="26" fill="url(#glowroad)"/>`
}

function vignette() {
  return `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#vig)"/>`
}

// ============================================
// Dégradés
// ============================================

function defs(extra = '') {
  return `<defs>
    <radialGradient id="glowred"><stop offset="0%" stop-color="#ff2d2d" stop-opacity="0.85"/><stop offset="100%" stop-color="#ff2d2d" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowblue"><stop offset="0%" stop-color="#2d6bff" stop-opacity="0.85"/><stop offset="100%" stop-color="#2d6bff" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowwarm"><stop offset="0%" stop-color="#ffcc00" stop-opacity="0.45"/><stop offset="100%" stop-color="#ffcc00" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowwhite"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowviolet"><stop offset="0%" stop-color="#7b68ee" stop-opacity="0.45"/><stop offset="100%" stop-color="#7b68ee" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowdawn"><stop offset="0%" stop-color="#ffb27a" stop-opacity="0.7"/><stop offset="60%" stop-color="#ff6b35" stop-opacity="0.25"/><stop offset="100%" stop-color="#ff6b35" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowroad"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.09"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
    <linearGradient id="glowhorizon" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff9a6b" stop-opacity="0.32"/><stop offset="100%" stop-color="#ff9a6b" stop-opacity="0"/></linearGradient>
    <linearGradient id="glowneon" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#e94560" stop-opacity="0"/><stop offset="35%" stop-color="#e94560"/><stop offset="65%" stop-color="#7b68ee"/><stop offset="85%" stop-color="#4ecdc4"/><stop offset="100%" stop-color="#4ecdc4" stop-opacity="0"/></linearGradient>
    <radialGradient id="vig" cx="0.5" cy="0.5" r="0.72"><stop offset="55%" stop-color="#000000" stop-opacity="0"/><stop offset="100%" stop-color="#000000" stop-opacity="0.72"/></radialGradient>
    ${extra}
  </defs>`
}

const BACKDROPS = {
  garage: ['#0a0a0f', '#1a1a2e', '#16213e', '#0f0f1a'],
  meeting: ['#0d0d1a', '#1a1a2e', '#2d1b4e', '#0f0f1a'],
  race_start: ['#0a0a1a', '#1a0a2e', '#2d1b4e', '#0a0a1a'],
  police: ['#0a0a1a', '#1a0a2e', '#4a0a2e', '#0a1a2e', '#0a0a1a'],
  night_streets: ['#0a0a1a', '#0f1a2e', '#1a2a3e', '#0a0a1a'],
  alleys: ['#050508', '#0a0a12', '#12121a', '#050508'],
  mechanic: ['#0a0a0f', '#1a1a1a', '#2a2a2a', '#0a0a0f'],
  phone: ['#0a0a1a', '#1a1a2e', '#0a0a1a'],
  betrayal: ['#0a0508', '#1a0a12', '#2a0a1a', '#0a0508'],
  truth: ['#0a0a1a', '#1a1a2e', '#2a2a4e', '#0a0a1a'],
  confrontation: ['#0a0a1a', '#1a0a2e', '#2a1a3e', '#0a1a2e', '#0a0a1a'],
  dawn_fight: ['#1a0a2e', '#2a1a3e', '#4a2a4e', '#6a3a4e', '#8a4a4e'],
  dawn_escape: ['#1a1a3e', '#2a2a4e', '#4a3a5e', '#6a4a5e', '#8a5a5e'],
  dawn_truth: ['#1a1a3e', '#2a3a5e', '#4a4a6e', '#6a5a7e', '#8a6a8e'],
  ending_legend: ['#1a0a2e', '#2a1a4e', '#4a2a5e', '#6a3a6e', '#8a4a7e'],
  ending_freedom: ['#1a1a3e', '#2a2a4e', '#4a3a5e', '#6a4a5e', '#8a5a5e'],
  ending_truth: ['#1a1a3e', '#2a3a5e', '#4a4a6e', '#6a5a7e', '#8a6a8e'],
  ending_caught: ['#0a0a1a', '#1a0a2e', '#2a0a3e', '#1a0a2e', '#0a0a1a'],
  ending_veilleur: ['#0a0a1a', '#1a1a2e', '#2a2a3e', '#1a1a2e', '#0a0a1a'],
  ending_secret: ['#0a0a0f', '#1a1a1a', '#2a2a2a', '#1a1a1a', '#0a0a0f'],
}

function background(name) {
  const stops = BACKDROPS[name] || BACKDROPS.garage
  const step = 100 / (stops.length - 1)
  const list = stops
    .map((c, i) => `<stop offset="${(i * step).toFixed(1)}%" stop-color="${c}"/>`)
    .join('')
  return `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">${list}</linearGradient>`
}

// ============================================
// Scènes
// ============================================

const SCENES = {
  garage: () => toolWall() + hangingLight(30, '#ffcc00') + carLift() + carSilhouette(50, 49, 0.82, '#0d0d0d', '#2a2a3e') + groundGlow(),
  meeting: () => streetLamp(24, 'warm') + carSilhouette(60, 26, 1.1, '#07070c', '#1e1e33') + smoke(34, 58) + figures(3, 22, 30, 34, 0.8) + wetRoad(18),
  race_start: () => speedLines() + neonStrip() + carSilhouette(50, 24, 1.35, '#07070c', '#e94560') + wetRoad(16),
  police: () => policeLights(32) + carSilhouette(50, 22, 1.25, '#07070c', '#e94560') + rain() + wetRoad(26),
  night_streets: () => skyline(24, 44, '#07070c', SKYLINE_WIDE) + streetLamp(62, 'warm') + wetRoad(22),
  alleys: () => narrowWalls() + dumpster() + singleLight(74, 24, 'warm') + wetRoad(14),
  mechanic: () => toolWall() + hangingBulb() + carLift() + carSilhouette(50, 49, 0.82, '#0d0d0d', '#2a2a2a'),
  phone: () => skyline(20, 30, '#07070c', SKYLINE_CITY) + phoneGlow(50, 46),
  betrayal: () => warehouse() + dramaticLight(50, 38) + shadowFigure(50, 30, 0.9),
  truth: () => deskLight() + papers() + shadowFigure(74, 26, 0.85),
  confrontation: () => dawnGlow(26) + figures(5, 50, 30, 52, 1) + carSilhouette(24, 20, 0.7, '#07070c', '#2a2a3e') + carSilhouette(78, 20, 0.7, '#07070c', '#2a2a3e'),
  dawn_fight: () => sunrise(26) + figures(3, 34, 26, 56, 0.95) + brokenCar() + groundGlow(),
  dawn_escape: () => sunrise(24) + openRoad(20) + carSilhouette(50, 26, 1.15, '#07070c', '#ffb27a'),
  dawn_truth: () => dawnGlow(34) + skyline(20, 34, '#0d0d1c', SKYLINE_CITY) + mediaLights(4) + figures(4, 50, 28, 46, 0.8),
  ending_legend: () => neonSigns() + skyline(20, 40, '#07070c', SKYLINE_CITY) + carSilhouette(50, 22, 1.2, '#07070c', '#e94560'),
  ending_freedom: () => sunrise(24) + mountainRange(26, '#0d0d1c') + openRoad(18) + carSilhouette(50, 26, 1.1, '#07070c', '#ffb27a'),
  ending_truth: () => dawnGlow(32) + courthouse() + microphones(3),
  ending_caught: () => policeLights(30) + handcuffs() + skyline(20, 26, '#07070c', SKYLINE_CITY) + wetRoad(24),
  ending_veilleur: () => shadowFigure(30, 28, 0.9) + skyline(20, 40, '#07070c', SKYLINE_CITY) + phoneGlow(76, 52),
  ending_secret: () => lockedDoor() + shadowFigure(66, 26, 0.85) + singleLight(30, 20, 'warm'),
}

/** Dessin secondaire utilisé quand la scène est trop vide sur une page de choix. */
function hangingBulb() {
  return `<g>
    <rect x="${px(30) - 1}" y="0" width="2" height="${py(12)}" fill="#26262a"/>
    <circle cx="${px(30)}" cy="${py(13)}" r="8" fill="#ffcc00">
      <animate attributeName="opacity" values="1;0.55;1" dur="2.2s" repeatCount="indefinite"/>
    </circle>
    <ellipse cx="${px(30)}" cy="${py(14)}" rx="54" ry="44" fill="url(#glowwarm)"/>
  </g>`
}

/** Toutes les scènes disponibles, nom -> fonction de dessin. */
export const SCENE_NAMES = Object.keys(BACKDROPS)

/**
 * Renvoie le contenu d'un fichier SVG pour la scène demandée.
 * Le dégradé de fond est injecté dans <defs> avant d'être utilisé.
 */
export function buildSceneFile(scene) {
  const name = SCENE_NAMES.includes(scene) ? scene : 'garage'
  const draw = SCENES[name] || SCENES.garage
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
${defs(background(name).replace('<linearGradient id="bg"', '<linearGradient id="bg"'))}
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${draw()}
  ${vignette()}
</svg>`
}

// ============================================
// Portraits et véhicules
// ============================================

const PERSONNAGES = [
  { id: 'clark', name: 'CLARK', couleur: '#e94560' },
  { id: 'maya', name: 'MAYA', couleur: '#4ecdc4' },
  { id: 'rocco', name: 'ROCCO', couleur: '#ffcc00' },
  { id: 'elias', name: 'ELIAS', couleur: '#7b68ee' },
  { id: 'veilleur', name: 'LE VEILLEUR', couleur: '#b8b8c8' },
]

export function buildPortraitSvg(id, couleur, name) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300" width="240" height="300">
${defs()}
  <rect width="240" height="300" fill="#101020"/>
  <circle cx="120" cy="120" r="96" fill="url(#glowwarm)" opacity="0.35"/>
  <path d="M120 250 q-72 0 -72 -66 q0 -40 72 -40 q72 0 72 40 q0 66 -72 66 z" fill="${couleur}" opacity="0.22"/>
  <ellipse cx="120" cy="118" rx="46" ry="54" fill="#14141f"/>
  <path d="M74 112 q6 -58 46 -58 q40 0 46 58 q-14 -26 -46 -26 q-32 0 -46 26 z" fill="#0a0a12"/>
  <path d="M120 176 q-14 0 -14 14 q0 14 14 14 q14 0 14 -14 q0 -14 -14 -14 z" fill="#14141f"/>
  <path d="M40 300 q0 -74 80 -74 q80 0 80 74 z" fill="#14141f"/>
  <path d="M104 200 l16 22 l16 -22 l-8 44 l-8 -18 l-8 18 z" fill="${couleur}" opacity="0.8"/>
  <circle cx="120" cy="112" r="5" fill="${couleur}" opacity="0.9"/>
  <text x="120" y="288" text-anchor="middle" font-family="monospace" font-size="15" letter-spacing="3" fill="${couleur}">${name}</text>
</svg>`
}

const VOITURES = [
  { id: 'porsche', couleur: '#e94560', forme: 'sport' },
  { id: 'corolla', couleur: '#b8b8c8', forme: 'berline' },
  { id: 'ram', couleur: '#ffcc00', forme: 'pickup' },
]

function silhouetteVoiture(forme, couleur) {
  if (forme === 'sport') {
    return `<path d="M40 150 L74 108 L124 88 L236 84 L292 110 L330 132 L346 150 L346 162 L40 162 Z" fill="#0a0a0f" stroke="${couleur}" stroke-width="3"/>
      <path d="M116 96 L182 94 L182 118 L96 120 Z" fill="${couleur}" opacity="0.35"/>
      <path d="M192 94 L250 92 L284 116 L192 118 Z" fill="${couleur}" opacity="0.35"/>`
  }
  if (forme === 'berline') {
    return `<path d="M34 152 L60 116 L108 102 L138 76 L242 76 L272 104 L318 118 L336 152 L336 162 L34 162 Z" fill="#0a0a0f" stroke="${couleur}" stroke-width="3"/>
      <path d="M146 84 L196 84 L196 106 L132 108 Z" fill="${couleur}" opacity="0.3"/>
      <path d="M204 84 L240 84 L262 106 L204 106 Z" fill="${couleur}" opacity="0.3"/>`
  }
  return `<path d="M30 156 L52 120 L96 112 L120 84 L232 84 L258 112 L330 118 L348 156 L348 166 L30 166 Z" fill="#0a0a0f" stroke="${couleur}" stroke-width="3"/>
    <rect x="30" y="128" width="90" height="22" fill="${couleur}" opacity="0.22"/>
    <path d="M128 92 L224 92 L224 108 L128 108 Z" fill="${couleur}" opacity="0.3"/>`
}

export function buildVoitureSvg(id, couleur) {
  const v = VOITURES.find((x) => x.id === id) || VOITURES[0]
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 210" width="380" height="210">
${defs()}
  <rect width="380" height="210" fill="#0d0d18"/>
  <ellipse cx="190" cy="120" rx="170" ry="90" fill="url(#glowwarm)" opacity="0.3"/>
  ${silhouetteVoiture(v.forme, couleur)}
  <circle cx="96" cy="164" r="22" fill="#0a0a0f" stroke="${couleur}" stroke-width="3"/>
  <circle cx="286" cy="164" r="22" fill="#0a0a0f" stroke="${couleur}" stroke-width="3"/>
</svg>`
}

export const PERSONNAGE_LIST = PERSONNAGES
export const VOITURE_LIST = VOITURES

export function buildIconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#0a0a0f"/>
  <path d="M8 40h48l-5 12H13z" fill="#e94560"/>
  <path d="M14 40l6-13h24l6 13z" fill="#4ecdc4"/>
  <circle cx="20" cy="52" r="5" fill="#12121a" stroke="#b8b8c8" stroke-width="2"/>
  <circle cx="44" cy="52" r="5" fill="#12121a" stroke="#b8b8c8" stroke-width="2"/>
</svg>`
}

/** Vignette décorative de la page de couverture. */
export function buildCoverSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
${defs(background('police').replace('id="bg"', 'id="bgcover"'))}
  <rect width="${W}" height="${H}" fill="url(#bgcover)"/>
  ${skyline(34, 42, '#05050a', SKYLINE_WIDE)}
  ${policeLights(26)}
  ${rain()}
  ${carSilhouette(50, 26, 1.6, '#04040a', '#e94560')}
  ${wetRoad(20)}
  ${groundGlow()}
  ${vignette()}
</svg>`
}

export function buildLogoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 220" width="520" height="220">
${defs()}
  <text x="260" y="110" text-anchor="middle" font-family="monospace" font-size="96" font-weight="bold" letter-spacing="14" fill="#f8f8f2">CLARK</text>
  <text x="260" y="176" text-anchor="middle" font-family="monospace" font-size="40" letter-spacing="12" fill="#e94560">NIGHT RUN</text>
  <rect x="90" y="130" width="340" height="2" fill="url(#glowneon)"/>
</svg>`
}

// ============================================
// Feuille de style
// ============================================

/**
 * Le CSS est volontairement autonome : polices système, aucune requête
 * réseau, aucune police distante. Le livre doit s'ouvrir en double-cliquant
 * sur index.html, hors ligne.
 */
export function buildCss(fontFace = '') {
  return `/* ============================================================
   CLARK: NIGHT RUN — feuille de style du livre-jeu
   Structure de chaque page :
     .page        conteneur principal
       .zone-image  conteneur image   (toujours présent)
       .zone-texte  conteneur texte   (toujours présent)
       .zone-liens  conteneur liens   (toujours présent)
   ============================================================ */

${fontFace}

:root {
  --noir: #05050a;
  --fond: #0a0a12;
  --fond2: #11111d;
  --pave: #16162a;
  --bord: #24243d;
  --texte: #eceaf2;
  --texte2: #a9a6bd;
  --rouge: #e94560;
  --rouge-clair: #ff6b7f;
  --orange: #ff6b35;
  --ambre: #ffcc00;
  --cyan: #4ecdc4;
  --violet: #7b68ee;
  --vert: #5fd39a;
  --rayon: 14px;
  --ombre: 0 18px 44px rgba(0, 0, 0, 0.55);
  --police-titre: "Trebuchet MS", "Segoe UI", Arial, sans-serif;
  --police-texte: "Segoe UI", Roboto, system-ui, sans-serif;
  --police-mono: Consolas, "Courier New", monospace;
}

* , *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background:
    radial-gradient(ellipse 90% 60% at 20% 0%, rgba(123, 104, 238, 0.16), transparent 60%),
    radial-gradient(ellipse 80% 60% at 85% 10%, rgba(233, 69, 96, 0.14), transparent 60%),
    var(--noir);
  color: var(--texte);
  font-family: var(--police-texte);
  line-height: 1.75;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--cyan); }

/* ---------- En-tête et pied ---------- */

.entete, .pied {
  width: min(980px, 92vw);
  margin: 0 auto;
  padding: 18px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.marque {
  font-family: var(--police-mono);
  font-size: 0.82rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--texte2);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.marque::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--rouge);
  box-shadow: 0 0 12px var(--rouge);
}

.entete-nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.entete-nav a {
  font-family: var(--police-mono);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--texte2);
  text-decoration: none;
  padding: 6px 12px;
  border: 1px solid var(--bord);
  border-radius: 999px;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.entete-nav a:hover,
.entete-nav a:focus-visible {
  color: var(--texte);
  border-color: var(--cyan);
  background: rgba(78, 205, 196, 0.08);
}

.pied {
  border-top: 1px solid var(--bord);
  margin-top: 48px;
  color: var(--texte2);
  font-size: 0.82rem;
}

/* ---------- Conteneur principal ---------- */

.page {
  width: min(980px, 92vw);
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(22, 22, 42, 0.72), rgba(10, 10, 18, 0.9));
  border: 1px solid var(--bord);
  border-radius: var(--rayon);
  box-shadow: var(--ombre);
  overflow: hidden;
}

/* ---------- Conteneur image ---------- */

.zone-image {
  position: relative;
  margin: 0;
  background: var(--noir);
  border-bottom: 1px solid var(--bord);
  overflow: hidden;
}

.zone-image img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 800 / 450;
  object-fit: cover;
}

.zone-image figcaption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 28px 24px 14px;
  background: linear-gradient(180deg, transparent, rgba(5, 5, 10, 0.92));
  font-family: var(--police-mono);
  font-size: 0.74rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--texte2);
}

/* ---------- Conteneur texte ---------- */

.zone-texte { padding: 30px clamp(20px, 4vw, 46px) 10px; }

.etiquette {
  font-family: var(--police-mono);
  font-size: 0.74rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 10px;
}

.titre-page {
  font-family: var(--police-titre);
  font-size: clamp(1.9rem, 4.6vw, 3rem);
  line-height: 1.12;
  letter-spacing: -0.01em;
  margin-bottom: 6px;
  background: linear-gradient(100deg, #fff 10%, var(--rouge-clair) 55%, var(--violet) 95%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sous-titre {
  font-family: var(--police-mono);
  font-size: 0.82rem;
  letter-spacing: 0.1em;
  color: var(--texte2);
  margin-bottom: 22px;
}

.zone-texte p { margin-bottom: 16px; max-width: 68ch; }
.zone-texte p:last-child { margin-bottom: 0; }

.chapo {
  font-size: 1.08rem;
  color: var(--texte);
  border-left: 3px solid var(--rouge);
  padding-left: 16px;
}

.replique {
  margin: 22px 0;
  padding: 14px 18px;
  background: var(--pave);
  border-left: 3px solid var(--violet);
  border-radius: 0 10px 10px 0;
}

.replique .qui {
  display: block;
  font-family: var(--police-mono);
  font-size: 0.76rem;
  letter-spacing: 0.18em;
  margin-bottom: 4px;
}

.consigne {
  font-family: var(--police-mono);
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ambre);
  margin: 26px 0 6px;
}

/* ---------- Conteneur liens ---------- */

.zone-liens {
  padding: 18px clamp(20px, 4vw, 46px) 34px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lien {
  display: block;
  text-decoration: none;
  color: var(--texte);
  background: var(--pave);
  border: 1px solid var(--bord);
  border-left: 4px solid var(--cyan);
  border-radius: 10px;
  padding: 14px 18px;
  font-weight: 600;
  transition: transform 0.16s ease, border-color 0.16s, background 0.16s;
}

.lien:hover, .lien:focus-visible {
  transform: translateX(6px);
  background: #1d1d34;
  border-left-color: var(--rouge);
}

.lien .detail {
  display: block;
  font-weight: 400;
  font-size: 0.86rem;
  color: var(--texte2);
  margin-top: 4px;
}

.lien .marque-choix {
  float: right;
  font-family: var(--police-mono);
  font-size: 0.66rem;
  letter-spacing: 0.14em;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid currentColor;
  margin-left: 12px;
}

.m-risque { color: var(--rouge-clair); }
.m-intelligent { color: var(--cyan); }
.m-discret { color: var(--vert); }
.m-dangereux { color: var(--orange); }
.m-forcebrute { color: var(--ambre); }

.lien--suivant { border-left-color: var(--rouge); }
.lien--secondaire {
  border-left-color: var(--bord);
  background: transparent;
  font-weight: 500;
  font-size: 0.92rem;
  color: var(--texte2);
}

.lien--secondaire:hover, .lien--secondaire:focus-visible { color: var(--texte); }

.groupe-liens { display: flex; gap: 10px; flex-wrap: wrap; }

.groupe-liens .lien { flex: 1 1 200px; }

/* Choix verrouillé par une condition */
.lien--bloque {
  opacity: 0.5;
  cursor: not-allowed;
  border-left-color: var(--bord);
  border-left-style: dashed;
}

.lien--bloque:hover { transform: none; background: var(--pave); }

.raison-blocage {
  display: block;
  font-family: var(--police-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  color: var(--ambre);
  margin-top: 6px;
}

.grille {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

/* ---------- Tableau des statistiques ---------- */

.panneau-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 22px 0 4px;
  padding: 0;
  list-style: none;
}

.panneau-stats li {
  font-family: var(--police-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--texte2);
  background: rgba(36, 36, 61, 0.55);
  border: 1px solid var(--bord);
  border-radius: 999px;
  padding: 5px 12px;
  white-space: nowrap;
}

.panneau-stats li b { color: var(--texte); font-size: 0.88rem; }

/* ---------- Fiches véhicules et personnages ---------- */

.fiche {
  background: var(--pave);
  border: 1px solid var(--bord);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s, border-color 0.18s;
}

.fiche:hover, .fiche:focus-visible { transform: translateY(-4px); border-color: var(--cyan); }

.fiche img { width: 100%; height: auto; display: block; }

.fiche-corps { padding: 14px 16px 18px; }

.fiche h3 {
  font-family: var(--police-titre);
  font-size: 1.05rem;
  letter-spacing: 0.04em;
  margin-bottom: 4px;
}

.fiche p { font-size: 0.88rem; color: var(--texte2); }

.fiche .stats-mini {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  font-family: var(--police-mono);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  color: var(--texte2);
}

.fiche .stats-mini b { color: var(--cyan); }

/* ---------- Page de couverture (différente des autres) ---------- */

.couverture { padding: 0; border: none; box-shadow: none; background: none; }

.zone-image--couverture { border: none; }

.zone-texte--couverture { text-align: center; padding-top: 10px; }

.zone-texte--couverture .titre-page { font-size: clamp(2.4rem, 7vw, 4.4rem); }

.sous-titre--couverture {
  font-size: 0.92rem;
  letter-spacing: 0.2em;
  color: var(--cyan);
}

.avatar-logo {
  width: min(340px, 74vw);
  height: auto;
  margin: 0 auto 6px;
  display: block;
}

.zone-liens--couverture {
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  padding-top: 6px;
}

.zone-liens--couverture .lien { flex: 1 1 210px; text-align: center; }

.bouton-direct {
  border-left-color: var(--rouge);
  background: linear-gradient(100deg, rgba(233, 69, 96, 0.22), rgba(123, 104, 238, 0.18));
  font-family: var(--police-mono);
  letter-spacing: 0.04em;
}

/* ---------- Fins ---------- */

.bandeau-fin {
  font-family: var(--police-mono);
  font-size: 0.78rem;
  letter-spacing: 0.3em;
  color: var(--ambre);
}

.fin-texte { font-size: 1.05rem; }

.fin-texte strong { color: var(--ambre); }

.carte-fin {
  border: 1px solid var(--bord);
  border-radius: 12px;
  padding: 16px 18px;
  background: var(--pave);
  text-decoration: none;
  color: inherit;
  display: block;
}

.carte-fin:hover, .carte-fin:focus-visible { border-color: var(--ambre); }

.carte-fin h3 { font-family: var(--police-titre); font-size: 1rem; margin-bottom: 4px; }

.carte-fin p { font-size: 0.86rem; color: var(--texte2); }

.etat-fin {
  font-family: var(--police-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
}

.etat-fin--ok { color: var(--vert); }
.etat-fin--non { color: var(--texte2); }

/* ---------- Liste du sommaire ---------- */

.sommaire-liste { list-style: none; padding: 0; }

.sommaire-liste li { border-bottom: 1px dashed var(--bord); }

.sommaire-liste a {
  display: flex;
  gap: 14px;
  align-items: baseline;
  padding: 12px 6px;
  text-decoration: none;
  color: var(--texte);
}

.sommaire-liste a:hover, .sommaire-liste a:focus-visible { color: var(--cyan); }

.sommaire-liste .num {
  font-family: var(--police-mono);
  font-size: 0.78rem;
  color: var(--rouge-clair);
  min-width: 2.6em;
}

/* ---------- Mini-jeu : le barrage ---------- */

.minijeu {
  margin: 24px 0 8px;
  border: 1px solid var(--bord);
  border-radius: 12px;
  overflow: hidden;
  background: #07070e;
}

.minijeu-bandeau {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--pave);
  font-family: var(--police-mono);
  font-size: 0.74rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.minijeu-terrain {
  position: relative;
  height: clamp(250px, 46vh, 370px);
  overflow: hidden;
  cursor: crosshair;
  background: radial-gradient(ellipse 90% 70% at 50% 8%, #23233d 0%, #0a0a14 72%);
}

.minijeu-sol {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 190%;
  height: 56%;
  transform: translateX(-50%);
  clip-path: polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%);
  background: linear-gradient(180deg, #1e1e33 0%, #0d0d18 70%, #08080f 100%);
}

.minijeu-axe {
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 190%;
  height: 56%;
  transform: translateX(-50%);
  clip-path: polygon(46% 0%, 54% 0%, 78% 100%, 22% 100%);
  background: repeating-linear-gradient(180deg, #ffcc00 0 22px, transparent 22px 64px);
  opacity: 0.16;
}

.minijeu-ligne {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--rouge);
  box-shadow: 0 0 14px var(--rouge);
  z-index: 900;
}

.minijeu-cible {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 3px;
  height: 100%;
}

.cible {
  position: absolute;
  left: 0;
  width: 46px;
  height: 104px;
  margin-left: -23px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  transform-origin: 50% 100%;
  transition: opacity 0.25s;
}

.cible-corps {
  position: absolute;
  left: 9px;
  bottom: 0;
  width: 28px;
  height: 74px;
  background: #12122a;
  border: 2px solid #4ecdc4;
  border-bottom: none;
  border-radius: 14px 14px 0 0;
}

.cible-tete {
  position: absolute;
  left: 13px;
  bottom: 66px;
  width: 20px;
  height: 22px;
  background: #12122a;
  border: 2px solid #4ecdc4;
  border-radius: 50%;
}

.cible-gyrophare {
  position: absolute;
  left: 18px;
  bottom: 88px;
  width: 10px;
  height: 7px;
  border-radius: 6px 6px 2px 2px;
  background: #4ecdc4;
  animation: gyrophare 0.9s ease-in-out infinite alternate;
}

@keyframes gyrophare {
  from { background: #4ecdc4; box-shadow: 0 0 6px #4ecdc4; }
  to   { background: #e94560; box-shadow: 0 0 14px #e94560; }
}

.cible--ok { opacity: 0; pointer-events: none; }

.minijeu-retour {
  position: absolute;
  left: 50%;
  bottom: 10%;
  width: 30px;
  height: 30px;
  margin-left: -15px;
  border: 3px solid var(--ambre);
  border-radius: 50%;
  animation: respiration 1.1s ease-in-out infinite;
}

.minijeu-retour::before,
.minijeu-retour::after {
  content: "";
  position: absolute;
  background: var(--ambre);
}

.minijeu-retour::before { left: 50%; top: -11px; width: 3px; height: 8px; margin-left: -1.5px; }
.minijeu-retour::after { left: 50%; top: 4px; width: 3px; height: 8px; margin-left: -1.5px; }

@keyframes respiration {
  0%, 100% { transform: scale(0.85); opacity: 0.55; }
  50% { transform: scale(1.15); opacity: 1; }
}

.minijeu-message {
  padding: 12px 16px;
  font-family: var(--police-mono);
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  color: var(--texte2);
  border-top: 1px solid var(--bord);
  min-height: 44px;
}

.minijeu-message b { color: var(--ambre); }

.lien--verrou { opacity: 0.32; pointer-events: none; filter: grayscale(0.6); }

.barre {
  height: 6px;
  background: var(--bord);
  border-radius: 999px;
  overflow: hidden;
  width: 120px;
}

.barre > i {
  display: block;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, var(--cyan), var(--ambre), var(--rouge));
  transition: width 0.2s linear;
}

/* ---------- Notes, listes, tableau ---------- */

.note {
  background: rgba(36, 36, 61, 0.5);
  border: 1px solid var(--bord);
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 0.92rem;
  color: var(--texte2);
}

.note strong { color: var(--texte); }

ul.puces, ol.puces { margin: 0 0 18px 20px; }
ul.puces li, ol.puces li { margin-bottom: 6px; max-width: 68ch; }

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  margin-bottom: 18px;
}

th, td {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 1px solid var(--bord);
  vertical-align: top;
}

th {
  font-family: var(--police-mono);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cyan);
}

code {
  font-family: var(--police-mono);
  font-size: 0.88em;
  background: var(--pave);
  border: 1px solid var(--bord);
  border-radius: 5px;
  padding: 1px 6px;
}

/* ---------- Adaptation petit écran ---------- */

@media (max-width: 640px) {
  .zone-texte { padding-top: 22px; }
  .zone-image figcaption { padding: 22px 16px 10px; font-size: 0.66rem; }
  .lien { padding: 12px 14px; }
  .lien .marque-choix { float: none; display: inline-block; margin: 6px 0 0; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; scroll-behavior: auto; }
}

@media print {
  body { background: #fff; color: #000; }
  .entete-nav, .pied { display: none; }
  .page { border: none; box-shadow: none; background: none; }
  .lien { border: 1px solid #999; color: #000; }
}
`
}

// ============================================
// Script de jeu
// ============================================

/**
 * Tout le livre est statique : ce script ne fait qu'ajouter la mémoire
 * (véhicule choisi, statistiques, parcours, fins découvertes), appliquer les
 * effets des choix et piloter le mini-jeu. Aucune dépendance, aucun réseau.
 */
export function buildJs() {
  return `/* ============================================================
   CLARK: NIGHT RUN — logique du livre-jeu
   ============================================================ */
(function () {
  'use strict'

  var CLE = 'clark_night_run_livre'
  var VEHICULES = { porsche: 'Porsche 911 Turbo S', corolla: 'Toyota Corolla', ram: 'Dodge Ram' }

  var STATS = {
    heat: { nom: 'Alerte', signe: true },
    damage: { nom: 'Dégâts', signe: true },
    danger: { nom: 'Danger', signe: true },
    reputation: { nom: 'Réputation' },
    money: { nom: 'Argent' },
    fuel: { nom: 'Carburant' },
    secrets: { nom: 'Secrets' },
    trust_maya: { nom: 'Maya' },
    trust_rocco: { nom: 'Rocco' },
    trust_elias: { nom: 'Elias' },
  }

  /* ---------- memoire ---------- */

  function lire() {
    try {
      var brut = window.localStorage.getItem(CLE)
      if (!brut) return { vehicule: '', stats: {}, parcours: [], fins: [], debut: Date.now() }
      var d = JSON.parse(brut)
      return {
        vehicule: d.vehicule || '',
        stats: d.stats || {},
        parcours: d.parcours || [],
        fins: d.fins || [],
        debut: d.debut || Date.now(),
      }
    } catch (e) {
      return { vehicule: '', stats: {}, parcours: [], fins: [], debut: Date.now() }
    }
  }

  function ecrire(d) {
    try { window.localStorage.setItem(CLE, JSON.stringify(d)) } catch (e) { /* mode prive */ }
  }

  function maj(modifs) {
    var d = lire()
    if (modifs.vehicule !== undefined) d.vehicule = modifs.vehicule
    if (modifs.fin !== undefined && d.fins.indexOf(modifs.fin) === -1) d.fins.push(modifs.fin)
    if (modifs.page && d.parcours.indexOf(modifs.page) === -1) d.parcours.push(modifs.page)
    ecrire(d)
    return d
  }

  function sansAccents(t) {
    return String(t).normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
  }

  function prix(n) {
    return n > 0 ? '+' + n : String(n)
  }

  /* ---------- conditions ---------- */

  function conditionVerifiee(c) {
    if (!c) return true
    var d = lire()
    var v = d.stats
    switch (c.type) {
      case 'vehicle':       return d.vehicule === c.value
      case 'secrets_min':   return (v.secrets || 0) >= c.value
      case 'heat_min':      return (v.heat || 0) >= c.value
      case 'heat_max':      return (v.heat || 0) <= c.value
      case 'damage_min':    return (v.damage || 0) >= c.value
      case 'damage_max':    return (v.damage || 0) <= c.value
      case 'reputation_min':return (v.reputation || 0) >= c.value
      case 'money_min':     return (v.money || 0) >= c.value
      case 'trust_maya_min':return (v.trust_maya || 0) >= c.value
      case 'trust_rocco_min':return (v.trust_rocco || 0) >= c.value
      case 'trust_elias_min':return (v.trust_elias || 0) >= c.value
      case 'flag':          return true
      default:              return true
    }
  }

  function raison(c) {
    if (!c) return ''
    var d = lire()
    if (c.type === 'vehicle') {
      return 'Réservé au véhicule ' + (VEHICULES[c.value] || c.value) + ' — tu es en ' + (VEHICULES[d.vehicule] || 'cours de route') + '.'
    }
    var s = STATS[c.type.replace(/_min$/, '')]
    return 'Il te faut ' + (s ? s.nom : c.type) + ' ' + c.value + ' ou plus.'
  }

  /* ---------- affichage ---------- */

  function afficherStats() {
    var zone = document.querySelector('[data-stats]')
    if (!zone) return
    var d = lire()
    var ordre = ['heat', 'damage', 'reputation', 'secrets', 'money', 'trust_maya', 'trust_rocco', 'trust_elias']
    var html = ''
    ordre.forEach(function (cle) {
      var brut = d.stats[cle] || 0
      if (cle !== 'heat' && cle !== 'damage' && cle !== 'reputation' && cle !== 'secrets' && brut === 0) return
      var s = STATS[cle]
      html += '<li>' + s.nom + ' <b>' + brut + '</b>' + (brut !== 0 ? ' (' + prix(brut) + ')' : '') + '</li>'
    })
    zone.innerHTML = html || '<li>Aucune statistique modifiee</li>'
  }

  function afficherVehicule() {
    var d = lire()
    document.querySelectorAll('[data-nom-vehicule]').forEach(function (el) {
      el.textContent = d.vehicule ? VEHICULES[d.vehicule] : 'Aucun vehicule'
    })
  }

  function afficherParcours() {
    var el = document.querySelector('[data-parcours]')
    if (!el) return
    var n = lire().parcours.length
    el.textContent = n > 0 ? n + ' page(s) parcourue(s)' : 'Aucune page parcourue'
  }

  function afficherFins() {
    var trouvees = lire().fins
    document.querySelectorAll('[data-fin-etat]').forEach(function (el) {
      var num = el.getAttribute('data-fin-etat')
      var ok = trouvees.indexOf(num) !== -1
      el.textContent = ok ? 'DECOUVERTE' : 'INCONNUE'
      el.className = 'etat-fin ' + (ok ? 'etat-fin--ok' : 'etat-fin--non')
    })
    var total = document.querySelector('[data-fin-total]')
    if (total) total.textContent = trouvees.length
  }

  /* ---------- vehicule ---------- */

  function initVehicules() {
    document.querySelectorAll('a[data-vehicule]').forEach(function (a) {
      a.addEventListener('click', function () {
        var d = maj({ vehicule: a.getAttribute('data-vehicule') })
        d.parcours = []
        ecrire(d)
      })
    })
  }

  /* ---------- choix ---------- */

  function initChoix() {
    document.querySelectorAll('a[data-choix]').forEach(function (a) {
      var condition = null
      try { condition = JSON.parse(a.getAttribute('data-condition') || 'null') } catch (e) { condition = null }

      if (!conditionVerifiee(condition)) {
        a.classList.add('lien--bloque')
        a.setAttribute('aria-disabled', 'true')
        var info = document.createElement('span')
        info.className = 'raison-blocage'
        info.textContent = 'VERROUILLE — ' + raison(condition)
        a.appendChild(info)
        a.addEventListener('click', function (e) { e.preventDefault() })
        return
      }

      a.addEventListener('click', function () {
        var effets = null
        try { effets = JSON.parse(a.getAttribute('data-effets') || 'null') } catch (e) { effets = null }
        var d = lire()
        if (effets) {
          Object.keys(effets).forEach(function (cle) {
            d.stats[cle] = (d.stats[cle] || 0) + effets[cle]
          })
        }
        d.choix = d.choix || []
        d.choix.push(a.getAttribute('data-choix'))
        ecrire(d)
      })
    })
  }

  /* ---------- fins ---------- */

  function initFins() {
    var num = document.body.getAttribute('data-fin')
    if (num) maj({ fin: num })
  }

  function initReinitialisation() {
    document.querySelectorAll('[data-reinitialiser]').forEach(function (a) {
      a.addEventListener('click', function () {
        try { window.localStorage.removeItem(CLE) } catch (e) { /* ignore */ }
      })
    })
  }

  /* ---------- mini-jeu : le barrage ---------- */

  function initMiniJeu() {
    var racine = document.querySelector('[data-minijeu]')
    if (!racine) return

    var terrain = racine.querySelector('.minijeu-cible')
    var message = racine.querySelector('.minijeu-message')
    var jauge = racine.querySelector('[data-jauge] > i')
    var duree = Number(racine.getAttribute('data-duree') || 20)
    var cibles = []

    var liens = document.querySelectorAll('[data-minijeu-suite]')
    liens.forEach(function (l) { l.classList.add('lien--verrou') })

    function dire(txt) { if (message) message.innerHTML = txt }

    function direEchec() {
      dire('<b>Tu n\\'as pas tenu.</b> Quelqu\\'un a franchi la ligne. Le barrage tient sans toi.')
      racine.setAttribute('data-etat', 'defaite')
      liens.forEach(function (l) {
        if (l.getAttribute('data-minijeu-suite') === 'defaite') l.classList.remove('lien--verrou')
      })
    }

    function direVictoire() {
      dire('<b>Barrage tenu.</b> Vingt secondes. Personne n\\'a franchi la ligne.')
      racine.setAttribute('data-etat', 'victoire')
      liens.forEach(function (l) {
        if (l.getAttribute('data-minijeu-suite') === 'victoire') l.classList.remove('lien--verrou')
      })
    }

    if (!terrain) return

    function apparaitre() {
      var progression = Math.min(1, (Date.now() - depart) / (duree * 1000))
      var b = document.createElement('button')
      b.type = 'button'
      b.className = 'cible'
      b.setAttribute('aria-label', 'Gyrophare')
      b.style.left = (30 + Math.random() * 40) + '%'
      var lueur = document.createElement('span')
      lueur.className = 'cible-gyrophare'
      var tete = document.createElement('span')
      tete.className = 'cible-tete'
      var corps = document.createElement('span')
      corps.className = 'cible-corps'
      b.appendChild(corps)
      b.appendChild(tete)
      b.appendChild(lueur)
      b.addEventListener('click', function (e) {
        e.stopPropagation()
        if (b.classList.contains('cible--ok')) return
        b.classList.add('cible--ok')
        var i = cibles.indexOf(b)
        if (i !== -1) cibles.splice(i, 1)
        score++
      })
      terrain.appendChild(b)
      cibles.push({
        el: b,
        avancement: 0,
        vitesse: 0.05 + progression * 0.055 + Math.random() * 0.028,
      })
    }

    function placer(c) {
      // avancement 0 = loin au fond de la rue, 1 = la ligne rouge du joueur.
      var distance = (1 - c.avancement) * (terrain.clientHeight * 0.82)
      c.el.style.bottom = distance + 'px'
      var taille = 0.55 + c.avancement * 0.45
      c.el.style.transform = 'scale(' + taille.toFixed(3) + ')'
      c.el.style.zIndex = String(100 - Math.floor(c.avancement * 50))
    }

    function boucler() {
      var maintenant = Date.now()
      var ecoule = (maintenant - depart) / 1000
      var progression = Math.min(1, (maintenant - depart) / (duree * 1000))

      if (jauge) jauge.style.width = (progression * 100).toFixed(1) + '%'
      if (chrono) chrono.textContent = Math.max(0, Math.ceil(duree - ecoule)) + ' s'
      if (marque) marque.textContent = score + ' touche(s)'

      if (progression >= 1) {
        direVictoire()
        return
      }

      var suivant = 1.5 - progression * 0.95
      if (maintenant - dernier >= suivant * 1000) {
        dernier = maintenant
        apparaitre()
      }

      var restant = []
      for (var i = 0; i < cibles.length; i++) {
        var c = cibles[i]
        c.avancement += c.vitesse * 0.05
        if (c.avancement >= 1) {
          direEchec()
          return
        }
        placer(c)
        restant.push(c)
      }
      cibles = restant

      requestAnimationFrame(boucler)
    }

    var depart = Date.now()
    var dernier = 0
    var score = 0
    var chrono = racine.querySelector('[data-chrono]')
    var marque = racine.querySelector('[data-score]')

    dire('Clique sur les gyrophares pour les faire reculer. Un agent qui atteint la ligne rouge et la nuit est finie.')
    apparaitre()
    requestAnimationFrame(boucler)
  }

  /* ---------- demarrage ---------- */

  function demarrer() {
    maj({ page: document.body.getAttribute('data-page') || '' })
    initVehicules()
    initChoix()
    initFins()
    // L'affichage se fait apres l'enregistrement : une page de fin doit
    // deja se compter elle-meme dans le compteur.
    afficherStats()
    afficherVehicule()
    afficherParcours()
    afficherFins()
    initReinitialisation()
    initMiniJeu()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer)
  } else {
    demarrer()
  }

  window.ClarkLivre = { lire: lire, reinitialiser: function () { try { window.localStorage.removeItem(CLE) } catch (e) {} } }
})()
`
}