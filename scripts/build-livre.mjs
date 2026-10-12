/*
 * Génère le livre-jeu statique : 40+ fichiers HTML, une feuille de style
 * séparée, un script de jeu et toutes les illustrations.
 *
 *   npm run build:livre
 *
 * Le contenu vient de src/data (le même que la version React) : modifier
 * chapters.ts puis relancer la commande suffit.
 *
 * Sortie : livre/  —  index.html, style.css, game.js, images/, cXXa.html…
 */

import { build as esbuildBuild } from 'esbuild'
import { mkdir, writeFile, rm, readdir, readFile, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SCENE_NAMES,
  buildSceneFile,
  buildPortraitSvg,
  buildVoitureSvg,
  buildIconSvg,
  buildCoverSvg,
  buildCss,
  buildJs,
  PERSONNAGE_LIST,
} from './livre-assets.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sortie = resolve(root, 'livre')
const images = resolve(sortie, 'images')

// ============================================
// Chargement des donnees TypeScript
// ============================================

/**
 * Les sources sont en TypeScript : esbuild les transpile et les lie en un
 * module temporaire que l'on importe. Les JPEG sont neutralisés en `empty`
 * car le livre utilise ses propres illustrations vectorielles.
 */
async function chargerDonnees() {
  const temporaire = resolve(root, 'node_modules', '.cache-livre-donnees.mjs')
  await esbuildBuild({
    stdin: {
      contents: `
        export { chapters } from './src/data/chapters.ts'
        export { vehicles } from './src/data/vehicles.ts'
        export { characters } from './src/data/characters.ts'
      `,
      resolveDir: root,
      loader: 'ts',
      sourcefile: 'donnees.ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: temporaire,
    logLevel: 'silent',
    loader: { '.jpeg': 'empty' },
  })
  const donnees = await import(`file://${temporaire.replace(/\\/g, '/')}?v=${Date.now()}`)
  await rm(temporaire, { force: true })
  return donnees
}

// ============================================
// Polices embarquees
// ============================================

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900' +
  '&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

const SOUS_ENSEMBLES = new Set(['latin', 'latin-ext'])

/**
 * Telecharge les polices Google une fois et les inscrit dans le CSS en
 * base64. Sans reseau, le build continue avec les polices systeme.
 * Les polices sont libres (SIL Open Font License).
 */
async function embedFonts() {
  let feuille = ''
  try {
    const reponse = await fetch(FONT_HREF, { headers: { 'User-Agent': UA } })
    if (!reponse.ok) throw new Error(`CSS ${reponse.status}`)
    feuille = await reponse.text()
  } catch (erreur) {
    console.warn(`  polices ignorees (${erreur.message}) — replis systeme`)
    return ''
  }

  const blocs = feuille.split(/\/\*\s*([\w-]+)\s*\*\//).slice(1)
  const voulus = []
  for (let i = 0; i < blocs.length; i += 2) {
    if (SOUS_ENSEMBLES.has(blocs[i])) voulus.push(blocs[i + 1])
  }
  if (voulus.length === 0) return ''

  const urls = new Set(
    [...feuille.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map((m) => m[1])
  )

  let telechargees = 0
  const polices = new Map()
  for (const url of urls) {
    try {
      const reponse = await fetch(url, { headers: { 'User-Agent': UA } })
      if (!reponse.ok) continue
      const tampon = Buffer.from(await reponse.arrayBuffer())
      polices.set(url, `data:font/woff2;base64,${tampon.toString('base64')}`)
      telechargees++
    } catch {
      /* ce poids manque, les autres restent disponibles */
    }
  }
  console.log(`  ${telechargees}/${urls.size} fichier(s) woff2 telecharge(s)`)

  const regles = []
  for (const corps of voulus) {
    let regle = corps
    for (const [url, dataUrl] of polices) {
      if (regle.includes(url)) regle = regle.replaceAll(url, dataUrl)
    }
    regles.push(regle.trim())
  }
  return regles.join('\n')
}

// ============================================
// Helpers
// ============================================

const esc = (t) =>
  String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const attr = (t) => esc(t).replace(/"/g, '&quot;')

/** Nom de fichier strict : uniquement 0-9 et a-z, plus le point d'extension. */
const slug = (t) => String(t).toLowerCase().replace(/[^a-z0-9]/g, '')

const ORDRE_TAGS = ['RISQUÉ', 'INTELLIGENT', 'DISCRET', 'DANGEREUX', 'FORCE BRUTE']

const classeTag = (tag) => {
  const i = ORDRE_TAGS.indexOf(tag)
  return i === -1 ? 'm-discret' : 'm-' + slug(ORDRE_TAGS[i])
}

const TITRES_STATS = {
  heat: 'Alerte',
  damage: 'Dégâts',
  danger: 'Danger',
  reputation: 'Réputation',
  money: 'Argent',
  fuel: 'Carburant',
  secrets: 'Secrets',
  trust_maya: 'Confiance Maya',
  trust_rocco: 'Confiance Rocco',
  trust_elias: 'Confiance Elias',
}

const effetsEnJson = (choix) => {
  if (!choix.effects || choix.effects.length === 0) return null
  const objet = {}
  for (const e of choix.effects) objet[e.type] = (objet[e.type] || 0) + e.value
  return JSON.stringify(objet)
}

// ============================================
// Gabarits de page
// ============================================

const NAV = [
  { href: 'sommaire.html', nom: 'Sommaire' },
  { href: 'fins.html', nom: 'Fins' },
  { href: 'aide.html', nom: 'Aide' },
]

const PIED = `  <footer class="pied">
    <span>Livre-jeu automobile · Clark: Night Run</span>
    <span><span data-parcours>Aucune page parcourue</span> · <span data-fin-total>0</span>/6 fins</span>
    <span>Illustrations originales SVG · <a href="credits.html">crédits</a></span>
  </footer>`

function pageHtml({ titre, description, corps, classe, donnees, scripts = true }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${attr(description)}">
  <meta name="author" content="CLARK: NIGHT RUN">
  <title>${esc(titre === 'CLARK: NIGHT RUN' ? titre : titre + ' — CLARK: NIGHT RUN')}</title>
  <link rel="icon" href="images/icone.svg" type="image/svg+xml">
  <link rel="stylesheet" href="style.css">
</head>
<body class="${attr(classe)}"${donnees}>
  <header class="entete">
    <a class="marque" href="index.html">Clark: Night Run</a>
    <nav class="entete-nav" aria-label="Navigation générale">
${NAV.map((n) => `      <a href="${n.href}">${esc(n.nom)}</a>`).join('\n')}
    </nav>
  </header>
${corps}
${PIED}
${scripts ? '  <script src="game.js"></script>' : ''}
</body>
</html>
`
}

/** Bloc « liens de navigation » commun à toutes les pages d'aventure. */
const liensSecondaires = (extra = []) =>
  `      <a class="lien lien--secondaire" href="sommaire.html">Sommaire<span class="detail">Revenir au sommaire général</span></a>
      <a class="lien lien--secondaire" href="index.html">Accueil<span class="detail">Retour à la page de couverture</span></a>${extra}`

const blocStats = () => `      <ul class="panneau-stats" data-stats></ul>`

// ============================================
// Pages
// ============================================

function pageCouverture() {
  const corps = `  <main class="page page--couverture">
    <figure class="zone-image zone-image--couverture">
      <img src="images/couverture.svg" alt="Une voiture traverse la ville de nuit sous la pluie, des gyrophares rouges et bleus clignotent au loin">
      <figcaption>Une nuit. Une ville. Six fins possibles.</figcaption>
    </figure>
    <div class="zone-texte zone-texte--couverture">
      <p class="etiquette">Livre-jeu</p>
      <h1 class="titre-page">CLARK: NIGHT RUN</h1>
      <p class="sous-titre sous-titre--couverture">Un livre-jeu automobile à choix</p>
      <p>Clark conduit une nuit de trop. Dans son garage, trois voitures l'attendent. Plus loin, une course, un secret de famille et une police qui ne dort jamais. Chaque décision que vous prenez laisse une trace : la réputation, l'alerte, les confidences, et au bout de la nuit, une seule des six fins.</p>
      <p>Ce livre se lit comme une aventure : ouvrez une page, lisez la scène, puis cliquez sur la décision que vous prenez. Le livre se souvient de votre parcours dans votre navigateur, sur cet ordinateur uniquement.</p>
      <div class="note">
        <strong>Comment lire ce livre&nbsp;:</strong> cliquez sur <em>Commencer la nuit</em>, choisissez votre véhicule, puis suivez les liens de page en page. Chaque page propose plusieurs décisions. Un mini-jeu de tir attend au chapitre&nbsp;5, à la page <strong>LE BARRAGE</strong>.
      </div>
    </div>
    <nav class="zone-liens zone-liens--couverture" aria-label="Accès au livre">
      <a class="lien bouton-direct" href="garage.html">Commencer la nuit<span class="detail">Choisir son véhicule et partir</span></a>
      <a class="lien" href="sommaire.html">Sommaire<span class="detail">Les seize pages de l'aventure</span></a>
      <a class="lien" href="perso.html">Personnages<span class="detail">Clark, Maya, Rocco, Elias, le Veilleur</span></a>
      <a class="lien" href="fins.html">Les six fins<span class="detail">Découvrir les conclusions possibles</span></a>
      <a class="lien" href="aide.html">Aide<span class="detail">Règles et commandes</span></a>
      <a class="lien" href="credits.html">Crédits<span class="detail">Images, polices, licences</span></a>
    </nav>
  </main>`
  return pageHtml({
    titre: 'CLARK: NIGHT RUN',
    description:
      'CLARK: NIGHT RUN, livre-jeu automobile à choix. Seize chapitres, six fins, un mini-jeu de barrage.',
    corps,
    classe: 'page-couverture',
    donnees: ' data-page="index"',
  })
}

function pageGarage(vehicules, idParId) {
  const cartes = Object.values(vehicules)
    .map((v) => {
      const image = `images/voiture${slug(v.id)}.svg`
      const mini = [
        ['VIT', v.stats.vitesse],
        ['DIS', v.stats.discretion],
        ['ACC', v.stats.acceleration],
        ['FIAB', v.stats.fiabilite],
      ]
        .map(([k, n]) => `<span>${k} <b>${n}</b></span>`)
        .join('')
      return `        <a class="fiche" href="${attr(idParId[v.id])}" data-vehicule="${attr(v.id)}">
          <img src="${image}" alt="Silhouette de la ${attr(v.name)}">
          <div class="fiche-corps">
            <h3>${esc(v.name)}</h3>
            <p>${esc(v.tagline)}</p>
            <p>${esc(v.specialAbility)}</p>
            <div class="stats-mini">${mini}</div>
          </div>
        </a>`
    })
    .join('\n')

  const corps = `  <main class="page">
    <figure class="zone-image">
      <img src="images/scenegarage.svg" alt="L'intérieur du garage de Clark, un outil suspendu éclaire la place">
      <figcaption>Chapitre 1 · Le garage · 23h14</figcaption>
    </figure>
    <div class="zone-texte">
      <p class="etiquette">Le choix qui détermine la nuit</p>
      <h1 class="titre-page">LE GARAGE</h1>
      <p class="sous-titre">23h14 — Quelque part en ville</p>
      <p class="chapo">Clark est dans son garage. L'odeur d'huile, de caoutchouc chaud et de métal. Trois voitures. Trois possibilités.</p>
      <p>Il regarde ses trois voitures. La Porsche, noire, agressive. La Corolla, grise, banale, invisible. Le Ram, massif, imposant, indestructible.</p>
      <p class="consigne">Choisissez la voiture que vous prendrez</p>
      <p>Ce choix ouvre ou verrouille certains passages plus loin dans l'histoire. Vous pourrez le changer à tout moment depuis le sommaire.</p>
      ${blocStats()}
    </div>
    <nav class="zone-liens" aria-label="Choix du véhicule">
      <div class="grille">
${cartes}
      </div>
${liensSecondaires(`
      <a class="lien lien--secondaire" href="sommaire.html">Voir le sommaire</a>`)}
    </nav>
  </main>`

  return pageHtml({
    titre: 'Le garage',
    description: 'Choisissez la voiture de Clark avant de commencer la nuit.',
    corps,
    classe: 'page-choix',
    donnees: ' data-page="garage" data-type="vehicule"',
  })
}

function pageChapitre(chapitre, index, cible, total) {
  const scene = `images/scene${slug(chapitre.image)}.svg`
  const paragraphe = chapitre.text.map((t) => `      <p>${esc(t)}</p>`).join('\n')
  const repliques = (chapitre.dialogue || [])
    .map(
      (d) => `      <blockquote class="replique">
        <span class="qui" style="color:${attr(d.color || '#7b68ee')}">${esc(d.speaker)}</span>
        ${esc(d.text)}
      </blockquote>`
    )
    .join('\n')

  const corps = `  <main class="page">
    <figure class="zone-image">
      <img src="${scene}" alt="${attr(chapitre.subtitle || chapitre.title)}">
      <figcaption>${attr(chapitre.subtitle || chapitre.title)}</figcaption>
    </figure>
    <div class="zone-texte">
      <p class="etiquette">Chapitre ${index} sur ${total}</p>
      <h1 class="titre-page">${esc(chapitre.title)}</h1>
      <p class="sous-titre">${esc(chapitre.subtitle || '')}</p>
${paragraphe}
${repliques}
    </div>
    <nav class="zone-liens" aria-label="Suite de la page">
      <a class="lien lien--suivant" href="${cible}">Continuer<span class="detail">Lire la suite</span></a>
${liensSecondaires()}
    </nav>
  </main>`

  return pageHtml({
    titre: chapitre.title,
    description: `${chapitre.title} — ${chapitre.subtitle || 'Clark: Night Run'}.`,
    corps,
    classe: `page-recit atmosphere-${chapitre.atmosphere || 'calm'}`,
    donnees: ` data-page="${attr(chapitre.id)}" data-type="recit"`,
  })
}

function pageChoix(chapitre, index, resoudre, total) {
  const scene = `images/scene${slug(chapitre.image)}.svg`
  const situation = chapitre.text[chapitre.text.length - 1]

  const liens = chapitre.choices
    .map((c) => {
      const cible = resoudre(c.nextChapter)
      const marque = c.tag
        ? `\n            <span class="marque-choix ${classeTag(c.tag)}">${esc(c.tag)}</span>`
        : ''
      const effets = effetsEnJson(c)
      return `      <a class="lien" href="${cible}" data-choix="${attr(c.id)}"${effets ? ` data-effets="${attr(effets)}"` : ''}${
        c.condition ? ` data-condition="${attr(JSON.stringify(c.condition))}"` : ''
      }>${marque}${esc(c.text)}</a>`
    })
    .join('\n')

  const corps = `  <main class="page">
    <figure class="zone-image">
      <img src="${scene}" alt="${attr(chapitre.subtitle || chapitre.title)}">
      <figcaption>${esc(chapitre.title)} · ${esc(chapitre.subtitle || '')}</figcaption>
    </figure>
    <div class="zone-texte">
      <p class="etiquette">Chapitre ${index} sur ${total} · décision</p>
      <h1 class="titre-page">${esc(chapitre.title)}</h1>
      <p class="sous-titre">${esc(chapitre.subtitle || '')}</p>
      <p class="chapo">${esc(situation)}</p>
      <p class="consigne">Que faites-vous ?</p>
${blocStats()}
    </div>
    <nav class="zone-liens" aria-label="Choix de la page">
${liens}
${liensSecondaires()}
    </nav>
  </main>`

  return pageHtml({
    titre: `${chapitre.title} — décision`,
    description: `Choisissez une option : ${chapitre.title}.`,
    corps,
    classe: 'page-choix',
    donnees: ` data-page="${attr(chapitre.id)}" data-type="choix"`,
  })
}

function pageMiniJeu(chapitre, index, resoudre, total) {
  const scene = `images/scene${slug(chapitre.image)}.svg`
  const paragraphe = chapitre.text.map((t) => `      <p>${esc(t)}</p>`).join('\n')

  const corps = `  <main class="page">
    <figure class="zone-image">
      <img src="${scene}" alt="Trois voitures de police barrent la rue, gyrophares allumés">
      <figcaption>${esc(chapitre.subtitle || chapitre.title)}</figcaption>
    </figure>
    <div class="zone-texte">
      <p class="etiquette">Chapitre ${index} sur ${total} · mini-jeu</p>
      <h1 class="titre-page">${esc(chapitre.title)}</h1>
      <p class="sous-titre">${esc(chapitre.subtitle || '')}</p>
${paragraphe}
      <p class="consigne">Mini-jeu&nbsp;: le barrage</p>
      <div class="minijeu" data-minijeu data-duree="20" data-etat="en-cours">
        <div class="minijeu-bandeau">
          <span>Chrono <b data-chrono>20 s</b></span>
          <span class="barre" data-jauge><i></i></span>
          <span data-score>0 touche(s)</span>
        </div>
        <div class="minijeu-terrain" role="group" aria-label="Zone de tir">
          <div class="minijeu-sol"></div>
          <div class="minijeu-axe"></div>
          <div class="minijeu-cible"></div>
          <div class="minijeu-retour" aria-hidden="true"></div>
          <div class="minijeu-ligne" aria-hidden="true"></div>
        </div>
        <p class="minijeu-message">Clique sur les gyrophares pour les faire reculer. Un agent qui atteint la ligne rouge&nbsp;et la nuit est finie.</p>
      </div>
${blocStats()}
    </div>
    <nav class="zone-liens" aria-label="Issue du mini-jeu">
      <a class="lien lien--suivant" href="${resoudre(chapitre.winChapter)}" data-minijeu-suite="victoire">Tenir jusqu au bout<span class="detail">Le barrage tient. La suite de la nuit</span></a>
      <a class="lien" href="${resoudre(chapitre.loseChapter)}" data-minijeu-suite="defaite">Ceder le barrage<span class="detail">La ligne est franchie. Fin de cette nuit</span></a>
${liensSecondaires()}
    </nav>
  </main>`

  return pageHtml({
    titre: `${chapitre.title} — le barrage`,
    description: `Mini-jeu de tir : tenir le barrage pendant vingt secondes. ${chapitre.title}.`,
    corps,
    classe: 'page-minijeu',
    donnees: ` data-page="${attr(chapitre.id)}" data-type="minijeu"`,
  })
}

function pageFin(fin, numero, total) {
  const paragraphe = fin.text.map((t) => `      <p>${esc(t)}</p>`).join('\n')
  const autres = Array.from({ length: total }, (_, i) => i + 1).filter((n) => n !== numero)

  const corps = `  <main class="page">
    <figure class="zone-image">
      <img src="images/scene${slug(fin.image)}.svg" alt="${attr(fin.endingTitle)}">
      <figcaption>Fin ${numero} sur ${total}</figcaption>
    </figure>
    <div class="zone-texte">
      <p class="etiquette bandeau-fin">Fin ${numero} sur ${total}</p>
      <h1 class="titre-page">${esc(fin.endingTitle)}</h1>
      <p class="sous-titre">${esc(fin.subtitle || '')}</p>
      <p class="chapo fin-texte"><strong>${esc(fin.endingTitle)}</strong> — ${esc(fin.endingDescription)}</p>
${paragraphe}
${blocStats()}
    </div>
    <nav class="zone-liens" aria-label="Après cette fin">
      <a class="lien lien--secondaire" href="fins.html" data-reinitialiser>Recommencer une nuit<span class="detail">Repartir du garage, progression remise à zéro</span></a>
      <a class="lien lien--secondaire" href="sommaire.html">Sommaire<span class="detail">Revenir au sommaire général</span></a>
      <a class="lien lien--secondaire" href="index.html">Accueil<span class="detail">Page de couverture</span></a>
      <div class="groupe-liens">
${autres
  .map((n) => `        <a class="lien lien--secondaire" href="fin${n}.html">Fin ${n}<span class="detail">Voir la conclusion ${n}</span></a>`)
  .join('\n')}
      </div>
    </nav>
  </main>`

  return pageHtml({
    titre: `Fin ${numero} — ${fin.endingTitle}`,
    description: `${fin.endingTitle} : ${fin.endingDescription}`,
    corps,
    classe: 'page-fin',
    donnees: ` data-page="${attr(fin.id)}" data-fin="${numero}"`,
  })
}

function pageSommaire(chapitres, idParId, fins) {
  const entrees = chapitres
    .map((c, i) => {
      const cible = idParId.get(c.id)
      return `        <li><a href="${cible}"><span class="num">${String(i + 1).padStart(2, '0')}</span><span>${esc(c.title)} <em style="color:var(--texte2);font-size:.86em">— ${esc(c.subtitle || '')}</em>${c.minigame ? ' <strong style="color:var(--ambre);font-size:.72rem;letter-spacing:.1em">MINI-JEU</strong>' : ''}</span></a></li>`
    })
    .join('\n')

  const listeFins = fins
    .map(
      (f, i) =>
        `        <li><a href="fin${i + 1}.html"><span class="num">F${i + 1}</span><span>${esc(f.endingTitle)} <em style="color:var(--texte2);font-size:.86em">— ${esc(f.endingDescription)}</em></span></a></li>`
    )
    .join('\n')

  const corps = `  <main class="page">
    <figure class="zone-image">
      <img src="images/scenenightstreets.svg" alt="Les rues de la ville la nuit, lampadaires et asphalte humide">
      <figcaption>Le parcours de la nuit</figcaption>
    </figure>
    <div class="zone-texte">
      <p class="etiquette">Reference</p>
      <h1 class="titre-page">SOMMAIRE</h1>
      <p class="sous-titre">Seize pages, six conclusions</p>
      <p>Le livre se lit de page en page&nbsp;: <strong>index.html</strong> ouvre l'aventure, chaque page propose plusieurs décisions et vous mène à la suivante. Vous pouvez aussi sauter directement à une page&nbsp;— votre progression est conservée dans ce navigateur.</p>
      <p class="consigne">L'aventure</p>
      <ul class="sommaire-liste">
${entrees}
      </ul>
      <p class="consigne">Les fins</p>
      <ul class="sommaire-liste">
${listeFins}
      </ul>
    </div>
    <nav class="zone-liens" aria-label="Navigation">
      <a class="lien lien--suivant" href="garage.html">Recommencer au garage<span class="detail">Changer de véhicule et repartir de zéro</span></a>
      <a class="lien lien--secondaire" href="perso.html">Personnages</a>
      <a class="lien lien--secondaire" href="aide.html">Aide</a>
      <a class="lien lien--secondaire" href="index.html">Accueil<span class="detail">Page de couverture</span></a>
    </nav>
  </main>`

  return pageHtml({
    titre: 'Sommaire',
    description: 'Sommaire de CLARK: NIGHT RUN : les seize pages de l aventure et les six fins.',
    corps,
    classe: 'page-sommaire',
    donnees: ' data-page="sommaire"',
  })
}

function pageFins(fins) {
  const cartes = fins
    .map((f, i) => {
      const n = i + 1
      return `        <a class="carte-fin" href="fin${n}.html">
          <h3>Fin ${n} — ${esc(f.endingTitle)}</h3>
          <p>${esc(f.endingDescription)}</p>
          <span class="etat-fin etat-fin--non" data-fin-etat="${n}">INCONNUE</span>
        </a>`
    })
    .join('\n')

  const corps = `  <main class="page">
    <figure class="zone-image">
      <img src="images/sceneendinglegend.svg" alt="La ville de nuit, néons allumés, une voiture s'éloigne">
      <figcaption>Ce que la nuit peut faire de vous</figcaption>
    </figure>
    <div class="zone-texte">
      <p class="etiquette">Conclusions</p>
      <h1 class="titre-page">LES SIX FINS</h1>
      <p class="sous-titre"><span data-fin-total>0</span> fin(s) découverte(s) sur 6</p>
      <p>Chaque fin correspond à une manière de terminer la nuit. Toutes ne demandent pas les mêmes choix&nbsp;: les pages de décision ouvrent ou ferment des portes selon votre véhicule et vos statistiques.</p>
      <p class="consigne">Conclusions possibles</p>
      <div class="grille">
${cartes}
      </div>
    </div>
    <nav class="zone-liens" aria-label="Navigation">
      <a class="lien lien--suivant" href="sommaire.html">Retour au sommaire<span class="detail">Reprendre l'aventure</span></a>
      <a class="lien lien--secondaire" href="index.html">Accueil<span class="detail">Page de couverture</span></a>
      <a class="lien lien--secondaire" href="fins.html" data-reinitialiser>Effacer ma progression<span class="detail">Remettre à zéro le parcours et les fins trouvées</span></a>
    </nav>
  </main>`

  return pageHtml({
    titre: 'Les six fins',
    description: 'Les six conclusions possibles de CLARK: NIGHT RUN.',
    corps,
    classe: 'page-fins',
    donnees: ' data-page="fins"',
  })
}

function pagePerso(personnages) {
  const couleurs = Object.fromEntries(PERSONNAGE_LIST.map((p) => [p.id, p]))
  const cartes = personnages
    .map((p) => {
      const meta = couleurs[p.id] || { couleur: p.color || '#7b68ee', name: p.name }
      const traits = (p.personality || []).map((t) => `<li>${esc(t)}</li>`).join('')
      return `        <article class="fiche">
          <img src="images/perso${slug(p.id)}.svg" alt="Portrait de ${attr(p.name)}">
          <div class="fiche-corps">
            <h3>${esc(p.name)}</h3>
            <p><em>${esc(p.role)}</em></p>
            <p>${esc(p.description)}</p>
            <ul class="puces" style="margin-top:8px;font-size:.86rem;color:var(--texte2)">${traits}</ul>
          </div>
        </article>`
    })
    .join('\n')

  const corps = `  <main class="page">
    <figure class="zone-image">
      <img src="images/scenemeeting.svg" alt="Une lampadaire éclaire un parking à minuit">
      <figcaption>Ceux que Clark croise cette nuit</figcaption>
    </figure>
    <div class="zone-texte">
      <p class="etiquette">Dossier</p>
      <h1 class="titre-page">PERSONNAGES</h1>
      <p class="sous-titre">Cinq personnes, une nuit</p>
      <p>Les liens que vous nouez avec ces cinq personnes modifient la fin de l'histoire&nbsp;: la confiance de Maya, de Rocco et d'Elias compte autant que votre réputation de pilote.</p>
      <div class="grille" style="margin-top:22px">
${cartes}
      </div>
    </div>
    <nav class="zone-liens" aria-label="Navigation">
      <a class="lien lien--suivant" href="sommaire.html">Retour au sommaire<span class="detail">Reprendre l'aventure</span></a>
      <a class="lien lien--secondaire" href="index.html">Accueil<span class="detail">Page de couverture</span></a>
    </nav>
  </main>`

  return pageHtml({
    titre: 'Personnages',
    description: 'Clark, Maya, Rocco, Elias et le Veilleur.',
    corps,
    classe: 'page-perso',
    donnees: ' data-page="perso"',
  })
}

function pageAide() {
  const corps = `  <main class="page">
    <figure class="zone-image">
      <img src="images/sceneconfrontation.svg" alt="Plusieurs silhouettes se font face à l'aube">
      <figcaption>Mode d emploi</figcaption>
    </figure>
    <div class="zone-texte">
      <p class="etiquette">Mode d emploi</p>
      <h1 class="titre-page">AIDE</h1>
      <p class="sous-titre">Comment lire ce livre</p>

      <p class="consigne">Règles</p>
      <ol class="puces">
        <li><strong>index.html</strong> est la première page. Elle est différente des suivantes&nbsp;: c'est la couverture.</li>
        <li>Depuis la couverture, vous choisissez un véhicule. Ce choix compte&nbsp;: il ouvre ou verrouille certains passages.</li>
        <li>Chaque page de l'aventure présente le même gabarit&nbsp;: une image, un texte, puis une liste de liens. Chaque lien est une décision.</li>
        <li>Cliquer sur un lien applique ses effets (alerte, réputation, secrets, confiance) puis ouvre la page suivante.</li>
        <li>Un choix marqué <em>VERROUILLÉ</em> n'est pas accessible&nbsp;: le livre explique pourquoi juste dessous.</li>
      </ol>

      <p class="consigne">Mini-jeu&nbsp;: le barrage</p>
      <p>Le chapitre <em>Le barrage</em> remplace la liste de choix par un mini-jeu de tir. Des silhouettes de policiers avancent vers toi&nbsp;: clique sur leurs gyrophares pour les faire reculer. Si l'un d'eux franchit la ligne rouge avant la fin du chrono, tu perds. Tiens vingt secondes pour gagner. Le jeu est écrit en JavaScript, dans le fichier <code>game.js</code>, et il fonctionne hors ligne.</p>

      <p class="consigne">Progression</p>
      <table>
        <thead><tr><th>Statistique</th><th>Effet</th></tr></thead>
        <tbody>
${Object.entries(TITRES_STATS)
  .map(
    ([cle, nom]) =>
      `          <tr><td>${esc(nom)}</td><td>Modifiée par les choix, affichée en haut de chaque page de décision.</td></tr>`
  )
  .join('\n')}
        </tbody>
      </table>
      <p>La progression est enregistrée dans le <code>localStorage</code> de votre navigateur, sur cet ordinateur et ce navigateur uniquement. Elle n'est envoyée nulle part. Pour repartir de zéro, utilisez le bouton <em>Effacer ma progression</em> de la page des fins.</p>

      <p class="consigne">Commandes</p>
      <ul class="puces">
        <li><strong>Clavier</strong> — <kbd>Tab</kbd> pour suivre les liens, <kbd>Entrée</kbd> pour valider.</li>
        <li><strong>Souris ou tactile</strong> — tous les liens sont cliquables, aucun geste bizarre n'est demandé.</li>
        <li><strong>Impression</strong> — <kbd>Ctrl</kbd>+<kbd>P</kbd> fonctionne&nbsp;: la mise en page s'adapte au papier.</li>
      </ul>
    </div>
    <nav class="zone-liens" aria-label="Navigation">
      <a class="lien lien--suivant" href="sommaire.html">Retour au sommaire<span class="detail">Reprendre l'aventure</span></a>
      <a class="lien lien--secondaire" href="credits.html">Crédits<span class="detail">Images et licences</span></a>
      <a class="lien lien--secondaire" href="index.html">Accueil<span class="detail">Page de couverture</span></a>
    </nav>
  </main>`

  return pageHtml({
    titre: 'Aide',
    description: 'Règles, mini-jeu et progression de CLARK: NIGHT RUN.',
    corps,
    classe: 'page-aide',
    donnees: ' data-page="aide"',
  })
}

function pageCredits() {
  const corps = `  <main class="page">
    <figure class="zone-image">
      <img src="images/sceneendingsecret.svg" alt="Une porte fermée dans le noir, une lumière au loin">
      <figcaption>Ou viennent les images de ce livre</figcaption>
    </figure>
    <div class="zone-texte">
      <p class="etiquette">Sources et licences</p>
      <h1 class="titre-page">CRÉDITS</h1>
      <p class="sous-titre">Tout ce qui est publié ici est libre de droit</p>

      <p class="consigne">Images</p>
      <p>Toutes les illustrations de ce livre (<code>images/*.svg</code>) sont des <strong>dessins vectoriels originaux</strong>, écrits spécialement pour ce projet&nbsp;: des formes géométriques, des dégradés et des animations, sans aucune image photographique. Elles sont donc libres de droit par construction&nbsp;— aucune banque d'images, aucun retraitement, aucune image tierce. C'est ce qui rend la publication sans problème de licence.</p>

      <p class="consigne">Polices d'écriture</p>
      <p>Les polices <strong>Orbitron</strong>, <strong>Rajdhani</strong> et <strong>Share Tech Mono</strong> sont distribuées par Google Fonts sous licence <em>SIL Open Font License 1.1</em>, qui autorise la redistribution. Elles sont incorporées directement dans <code>style.css</code>, donc le livre reste lisible hors ligne. Si la première compilation se fait sans réseau, le livre bascule automatiquement sur des polices système.</p>

      <p class="consigne">Textes</p>
      <p>L'histoire, les dialogues, les statistiques et les décisions sont écrits pour ce projet. Les noms de marques cités (Porsche 911 Turbo S, Toyota Corolla, Dodge Ram) désignent des véhicules réels à titre de comparaison fictive&nbsp;: aucune marque n'est commanditaire de ce livre.</p>

      <p class="consigne">Code</p>
      <ul class="puces">
        <li>Structure HTML générée à partir de <code>src/data/chapters.ts</code>.</li>
        <li>Mise en forme&nbsp;: <code>style.css</code>.</li>
        <li>Progression, choix et mini-jeu&nbsp;: <code>game.js</code>.</li>
      </ul>

      <p class="consigne">Fonctionnement hors ligne</p>
      <p>Ce livre ne contient aucune adresse externe&nbsp;: ni police distante, ni image hébergée, ni lien réseau. Vous pouvez copier le dossier <code>livre/</code> sur une clé USB et l'ouvrir hors connexion, le jeu fonctionne à l'identique.</p>
    </div>
    <nav class="zone-liens" aria-label="Navigation">
      <a class="lien lien--secondaire" href="sommaire.html">Sommaire<span class="detail">Reprendre l'aventure</span></a>
      <a class="lien lien--secondaire" href="aide.html">Aide<span class="detail">Règles et commandes</span></a>
      <a class="lien lien--secondaire" href="index.html">Accueil<span class="detail">Page de couverture</span></a>
    </nav>
  </main>`

  return pageHtml({
    titre: 'Crédits',
    description: 'Sources, licences et informations de publication de CLARK: NIGHT RUN.',
    corps,
    classe: 'page-credits',
    donnees: ' data-page="credits"',
  })
}

// ============================================
// Controle qualite du livrable
// ============================================

/**
 * Verifie le dossier produit contre les contraintes de publication :
 * nommage strict, liens internes tous resolus, aucune adresse locale ou
 * distante, plusieurs liens par page, couverture differente des autres.
 */
async function controler(dossier) {
  const fichiers = await readdir(dossier)
  const html = fichiers.filter((f) => f.endsWith('.html'))
  const images = (await readdir(resolve(dossier, 'images'))).length

  // Nom de fichier strict : uniquement 0-9 et a-z dans chaque segment.
  const nomAutorise = /^[a-z0-9]+(\.[a-z0-9]+)*$/
  const interdits = []

  const listeImages = (await readdir(resolve(dossier, 'images'))).map((f) => `images/${f}`)
  for (const chemin of [...fichiers, ...listeImages]) {
    const segments = chemin.split('/')
    if (!segments.every((s) => nomAutorise.test(s))) interdits.push(`nom de fichier interdit : ${chemin}`)
  }

  let couvertureDiffere = false
  const pagesSansLiens = []

  for (const fichier of html) {
    const contenu = await readFile(resolve(dossier, fichier), 'utf8')

    if (/[a-zA-Z]:[\\/]/.test(contenu)) interdits.push(`${fichier} : adresse locale`)
    if (/file:\/\//.test(contenu)) interdits.push(`${fichier} : adresse file://`)
    if (/https?:\/\//.test(contenu)) {
      // Seuls les xmlns SVG et les mentions de licence dans le texte sont tolérés.
      const suspects = [...contenu.matchAll(/(?:src|href)="https?:\/\/[^"]+"/g)].map((m) => m[0])
      if (suspects.length) interdits.push(`${fichier} : reference distante ${suspects[0]}`)
    }

    const cibles = [...contenu.matchAll(/(?:href|src)="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((v) => !v.startsWith('#') && !v.startsWith('data:'))

    for (const cible of cibles) {
      // Sans `await`, fichierAutorise renvoie une promesse toujours vraie :
      // le controle ne testerait rien du tout.
      if (!(await fichierAutorise(dossier, fichier, cible))) {
        interdits.push(`${fichier} : lien casse vers "${cible}"`)
      }
    }

    const nbLiens = [...contenu.matchAll(/<a\s[^>]*href="/g)].length
    if (nbLiens < 2) pagesSansLiens.push(`${fichier} (${nbLien} lien)`)

    if (fichier === 'index.html') {
      couvertureDiffere =
        contenu.includes('page--couverture') &&
        contenu.includes('zone-image--couverture') &&
        contenu.includes('zone-liens--couverture') &&
        !contenu.includes('<div class="zone-image">')
    }
  }

  if (!couvertureDiffere) interdits.push('index.html : la couverture doit avoir une structure propre')
  if (pagesSansLiens.length) interdits.push(`pages sans plusieurs liens : ${pagesSansLiens.join(', ')}`)
  if (!fichiers.includes('style.css')) interdits.push('style.css manquant')
  if (!fichiers.includes('index.html')) interdits.push('index.html manquant')

  const orphelines = await pagesInatteignables(dossier, html)
  if (orphelines.length) {
    interdits.push(`pages inatteignables depuis index.html : ${orphelines.join(', ')}`)
  }

  if (interdits.length) {
    throw new Error('Controle echoue :\n  - ' + interdits.join('\n  - '))
  }

  return { html: html.length, images }
}

/**
 * Parcourt le livre a partir de index.html et signale toute page que le
 * lecteur ne peut pas atteindre. Une page orpheline existe sur le disque
 * mais le lecteur ne la verra jamais.
 */
async function pagesInatteignables(dossier, pages) {
  const vues = new Set(['index.html'])
  const file = ['index.html']

  while (file.length > 0) {
    const courante = file.pop()
    const contenu = await readFile(resolve(dossier, courante), 'utf8')
    const cibles = [...contenu.matchAll(/href="([^"#?]+\.html)"/g)].map((m) => m[1])
    for (const cible of cibles) {
      if (vues.has(cible) || !pages.includes(cible)) continue
      vues.add(cible)
      file.push(cible)
    }
  }

  return pages.filter((p) => !vues.has(p))
}

/** Verifie qu'un lien relatif pointe vers un fichier reellement ecrit. */
async function fichierAutorise(dossier, depuis, cible) {
  if (/^[a-z]+:\/\//i.test(cible)) return false
  const sansAncre = cible.split('#')[0].split('?')[0]
  if (!sansAncre) return true
  const complet = resolve(dossier, sansAncre)
  if (!complet.startsWith(resolve(dossier))) return false
  try {
    const info = await stat(complet)
    return info.isFile()
  } catch {
    return false
  }
}

// ============================================
// Test de fumee dans un vrai navigateur
// ============================================

const NAVIGATEURS = [
  process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env.ProgramFiles + '\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  process.env.ProgramFiles + '\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
]

async function trouverNavigateur() {
  for (const chemin of NAVIGATEURS) {
    if (!chemin) continue
    try {
      await stat(chemin)
      return chemin
    } catch {
      /* suivant */
    }
  }
  return null
}

async function interroger(navigateur, fichier, dossier) {
  const url = 'file:///' + resolve(dossier, fichier).replace(/\\/g, '/')
  const { execFile } = await import('node:child_process')
  const { promisify } = await import('node:util')
  const { stdout } = await promisify(execFile)(
    navigateur,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--virtual-time-budget=4000',
      '--dump-dom',
      url,
    ],
    { maxBuffer: 24 * 1024 * 1024, windowsHide: true }
  )
  return stdout
}

/**
 * Ouvre quelques pages dans un vrai navigateur et verifie que le script a
 * produit ses effets. Un fichier valide peut contenir une erreur JavaScript :
 * seul l'affichage du donne raison.
 */
async function testerDansNavigateur(dossier) {
  const navigateur = await trouverNavigateur()
  if (!navigateur) {
    console.warn('  test navigateur ignore (aucun Chrome/Edge trouve)')
    return
  }

  const attendus = [
    { page: 'c05b.html', raison: 'le mini-jeu doit creer des cibles', motifs: [/class="cible"/, /class="cible-tete"/] },
    { page: 'c05b.html', raison: 'les statistiques doivent etre remplies', motifs: [/<ul class="panneau-stats"[^>]*>\s*<li>/] },
    { page: 'garage.html', raison: 'le parcours doit etre memorise', motifs: [/data-parcours[^>]*>[^<]*[1-9][0-9]* page/] },
    { page: 'fin1.html', raison: 'la fin doit etre enregistree', motifs: [/data-fin-total[^>]*>1</] },
  ]

  const doms = new Map()
  for (const { page } of attendus) {
    if (!doms.has(page)) doms.set(page, await interroger(navigateur, page, dossier))
  }

  const echecs = []
  for (const { page, raison, motifs } of attendus) {
    const dom = doms.get(page)
    for (const motif of motifs) {
      if (!motif.test(dom)) echecs.push(`${page} : ${raison}`)
    }
  }

  if (echecs.length) {
    throw new Error('Test navigateur echoue :\n  - ' + echecs.join('\n  - '))
  }
  console.log(`  ${attendus.length} verifications navigateur OK`)
}

// ============================================
// Construction
// ============================================

async function ecrireIllustrations() {
  await mkdir(images, { recursive: true })

  for (const scene of SCENE_NAMES) {
    await writeFile(resolve(images, `scene${slug(scene)}.svg`), buildSceneFile(scene), 'utf8')
  }

  for (const p of PERSONNAGE_LIST) {
    await writeFile(
      resolve(images, `perso${slug(p.id)}.svg`),
      buildPortraitSvg(p.id, p.couleur, p.name),
      'utf8'
    )
  }

  const couleursVoitures = { porsche: '#e94560', corolla: '#b8b8c8', ram: '#ffcc00' }
  for (const [id, couleur] of Object.entries(couleursVoitures)) {
    await writeFile(resolve(images, `voiture${slug(id)}.svg`), buildVoitureSvg(id, couleur), 'utf8')
  }

  await writeFile(resolve(images, 'icone.svg'), buildIconSvg(), 'utf8')
  await writeFile(resolve(images, 'couverture.svg'), buildCoverSvg(), 'utf8')

  console.log(`  ${(await readdir(images)).length} illustrations SVG ecrites`)
}

async function main() {
  console.log('▸ Lecture des sources…')
  const { chapters, vehicles, characters } = await chargerDonnees()

  const ids = Object.keys(chapters)
  const chapitres = ids.filter((id) => !chapters[id].isEnding).map((id) => chapters[id])
  const fins = ids.filter((id) => chapters[id].isEnding).map((id) => chapters[id])

  if (fins.length === 0) throw new Error('Aucune fin trouvee dans chapters.ts')

  const indexParId = new Map()
  chapitres.forEach((c, i) => indexParId.set(c.id, i + 1))
  const finParId = new Map()
  fins.forEach((f, i) => finParId.set(f.id, i + 1))

  // Un chapitre à mini-jeu n'a qu'une seule page : les autres chapitres qui
  // pointent vers lui doivent donc viser cette page-là, pas une page « a ».
  const avecMinijeu = new Set(chapitres.filter((c) => c.minigame).map((c) => c.id))

  const nomParId = new Map()
  for (const c of chapitres) {
    const base = `c${String(indexParId.get(c.id)).padStart(2, '0')}`
    nomParId.set(c.id, avecMinijeu.has(c.id) ? `${base}b.html` : `${base}a.html`)
  }
  for (const f of fins) nomParId.set(f.id, `fin${finParId.get(f.id)}.html`)

  /** Resout un identifiant de chapitre vers le nom de fichier de sa page. */
  const resoudre = (id) => {
    const fichier = nomParId.get(id)
    if (!fichier) throw new Error(`Chapitre inconnu : "${id}"`)
    return fichier
  }

  // Toutes les cibles doivent exister : on le verifie avant d ecrire quoi que ce soit.
  for (const c of chapitres) {
    for (const choix of c.choices) resoudre(choix.nextChapter)
    if (c.minigame) {
      resoudre(c.winChapter)
      resoudre(c.loseChapter)
    }
  }

  // Un chapitre sans choix et sans mini-jeu produirait une page morte.
  for (const c of chapitres) {
    if (c.choices.length === 0 && !c.minigame) {
      throw new Error(`Le chapitre "${c.id}" n'a ni choix ni mini-jeu`)
    }
  }

  console.log('▸ Illustrations…')
  await rm(sortie, { recursive: true, force: true })
  await mkdir(images, { recursive: true })
  await ecrireIllustrations()

  console.log('▸ Polices…')
  const fontFace = await embedFonts()

  console.log('▸ Feuilles et scripts…')
  const css = buildCss(fontFace)
  const js = buildJs()

  // Une apostrophe mal echappee dans un gabarit produit du JavaScript
  // invalide : le controle de syntaxe attrape l'erreur avant la livraison.
  try {
    new Function(js)
  } catch (erreur) {
    throw new Error(`game.js ne compile pas : ${erreur.message}`)
  }

  await writeFile(resolve(sortie, 'style.css'), css, 'utf8')
  await writeFile(resolve(sortie, 'game.js'), js, 'utf8')

  console.log('▸ Pages…')
  const ecrites = []
  const ecrirePage = async (nom, contenu) => {
    await writeFile(resolve(sortie, nom), contenu, 'utf8')
    ecrites.push(nom)
  }

  await ecrirePage('index.html', pageCouverture())
  const premierePage = nomParId.get(chapitres[0].id)
  await ecrirePage(
    'garage.html',
    pageGarage(
      vehicles,
      Object.fromEntries(Object.values(vehicles).map((v) => [v.id, premierePage]))
    )
  )
  await ecrirePage('sommaire.html', pageSommaire(chapitres, nomParId, fins))
  await ecrirePage('fins.html', pageFins(fins))
  await ecrirePage('perso.html', pagePerso(Object.values(characters)))
  await ecrirePage('aide.html', pageAide())
  await ecrirePage('credits.html', pageCredits())

  const total = chapitres.length
  for (let i = 0; i < chapitres.length; i++) {
    const c = chapitres[i]
    const n = i + 1
    const base = `c${String(n).padStart(2, '0')}`
    if (c.minigame) {
      await ecrirePage(`${base}b.html`, pageMiniJeu(c, n, resoudre, total))
    } else {
      await ecrirePage(`${base}a.html`, pageChapitre(c, n, `${base}b.html`, total))
      await ecrirePage(`${base}b.html`, pageChoix(c, n, resoudre, total))
    }
  }

  // Un forEach declenche les ecritures sans les attendre : le controle
// commencerait alors a lire un dossier incomplet.
for (const f of fins) {
    const n = finParId.get(f.id)
    await ecrirePage(`fin${n}.html`, pageFin(f, n, fins.length))
  }

  const controle = await controler(sortie)
  console.log('▸ Test dans un navigateur…')
  await testerDansNavigateur(sortie)
  console.log(`▸ Terminé — ${sortie}`)
  console.log(`  ${controle.html} pages HTML · ${controle.images} images · 1 feuille de style`)
  if (controle.html < 30) throw new Error(`Seulement ${controle.html} pages : il en faut au moins 30`)
}

main().catch((erreur) => {
  console.error('\n✖ ' + erreur.message)
  process.exit(1)
})