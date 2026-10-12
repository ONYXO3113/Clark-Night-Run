/*
 * Builds CLARK: NIGHT RUN into ONE self-contained HTML file.
 *
 * The end product must work from `file://` by double-click, with no server, no
 * install and no network. Three things stand in the way of a normal Vite build:
 *
 *   1. External <script src> / <link href> assets — inlined below.
 *   2. Google Fonts loaded from a CDN — a browser opened on an offline file
 *      silently drops them, which would wreck the whole aesthetic. They are
 *      downloaded once at build time and embedded as base64 @font-face.
 *   3. `/vite.svg` as favicon — replaced with an inline data URI.
 *
 * There is no router in this app (screens are driven by React state) and no
 * fetch/audio, so nothing else needs a `file://` fallback.
 *
 *   npm run build:single
 *
 * Output: index.html at the project root.
 */

import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { writeFile, readFile, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'dist-single')
const outputFile = resolve(root, 'index.html')

// Matches the <link> in index.html. Kept here so the font step and the cleanup
// step below can never disagree about what is being requested.
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900' +
  '&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap'

// A modern browser UA is required: without it Google serves legacy TTF/OTF
// instead of woff2, which is several times larger.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

// Latin plus latin-ext covers French (é, è, à, ç, œ). The other subsets
// (cyrillic, greek, vietnamese…) would triple the file size for nothing.
const KEEP_SUBSETS = new Set(['latin', 'latin-ext'])

// A tiny night-driving icon so the tab does not fall back to a broken image.
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0a0a0f"/>
  <path d="M8 40h48l-5 12H13z" fill="#e94560"/>
  <path d="M14 40l6-13h24l6 13z" fill="#4ecdc4"/>
  <circle cx="20" cy="52" r="5" fill="#12121a" stroke="#b8b8c8" stroke-width="2"/>
  <circle cx="44" cy="52" r="5" fill="#12121a" stroke="#b8b8c8" stroke-width="2"/>
</svg>`

// Only the closing sequence can break out of the <script> element.
const escapeForScript = (code) => code.replace(/<\/(script)/gi, '<\\/$1')

/**
 * Downloads the webfonts and returns @font-face rules with the binary payloads
 * inlined. Never throws: a build without embedded fonts is still a working
 * game, just less pretty, so a network failure only downgrades the result.
 */
const embedFonts = async () => {
  let sheet = ''
  try {
    const response = await fetch(FONT_HREF, { headers: { 'User-Agent': UA } })
    if (!response.ok) throw new Error(`CSS ${response.status}`)
    sheet = await response.text()
  } catch (error) {
    console.warn(`  polices ignorées (${error.message}) — replis système utilisés`)
    return ''
  }

  // Google emits `/* subset */` immediately before each group of @font-face
  // blocks, which is the only reliable way to tell the subsets apart.
  const blocks = sheet.split(/\/\*\s*([\w-]+)\s*\*\//).slice(1)
  const wanted = []
  for (let i = 0; i < blocks.length; i += 2) {
    if (KEEP_SUBSETS.has(blocks[i])) wanted.push(blocks[i + 1])
  }
  if (wanted.length === 0) {
    console.warn('  polices ignorées (aucun sous-ensemble reconnu)')
    return ''
  }

  const fonts = new Map()
  const urls = new Set(
    [...sheet.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map(
      (match) => match[1]
    )
  )

  let downloaded = 0
  for (const url of urls) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': UA } })
      if (!response.ok) continue
      const buffer = Buffer.from(await response.arrayBuffer())
      // Only the URL is substituted: the `url(…) format('woff2')` wrapper
      // already exists in the Google stylesheet. Returning a full `url(…)`
      // here would produce `url(url(data:…))`, which is invalid CSS and makes
      // the browser drop the whole @font-face rule.
      fonts.set(url, `data:font/woff2;base64,${buffer.toString('base64')}`)
      downloaded++
    } catch {
      // Skip this face; the remaining weights still apply.
    }
  }
  console.log(`  ${downloaded}/${urls.size} fichier(s) woff2 téléchargé(s)`)

  const rules = []
  let inlined = 0
  for (const body of wanted) {
    let rule = body
    for (const [url, dataUrl] of fonts) {
      if (!rule.includes(url)) continue
      rule = rule.replaceAll(url, dataUrl)
      inlined++
    }
    rules.push(rule.trim())
  }

  if (inlined === 0) {
    console.warn('  polices ignorées (aucun woff2 intégré)')
    return ''
  }
  console.log(`  ${inlined} @font-face embarquée(s)`)
  return rules.join('\n')
}

const main = async () => {
  console.log('▸ Construction du fichier unique…')

  await build({
    root,
    base: './',
    logLevel: 'warn',
    plugins: [react()],
    build: {
      outDir,
      emptyOutDir: true,
      // Nothing to inline as base64 beyond the fonts, but keep assets local.
      assetsInlineLimit: 100_000_000,
      cssCodeSplit: false,
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: { inlineDynamicImports: true, manualChunks: undefined },
      },
    },
  })

  console.log('▸ Intégration des polices…')
  const fontCss = await embedFonts()

  const html = await readFile(resolve(outDir, 'index.html'), 'utf8')

  const assetRefs = [...html.matchAll(/(?:src|href)="\.?\/?([^"]+\.(?:js|css))"/g)].map(
    (match) => match[1]
  )

  let output = html

  // A replacer FUNCTION is mandatory: minified bundles contain `$&`, `$'` and
  // similar sequences that String.replace would otherwise substitute.
  const replaceWith = (pattern, replacement) => output.replace(pattern, () => replacement)

  for (const file of assetRefs) {
    const escaped = file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (file.endsWith('.css')) {
      const fileCss = await readFile(resolve(outDir, file), 'utf8')
      output = replaceWith(
        new RegExp(`<link[^>]*href="\\.?/?${escaped}"[^>]*>`),
        `<style>${fontCss}${fileCss}</style>`
      )
    } else if (file.endsWith('.js')) {
      const code = await readFile(resolve(outDir, file), 'utf8')
      output = replaceWith(
        new RegExp(`<script[^>]*src="\\.?/?${escaped}"[^>]*>\\s*</script>`),
        `<script type="module">${escapeForScript(code)}</script>`
      )
    }
  }

  // There are no external chunks left, so the preload hint is dead weight.
  output = output.replace(/<link rel="modulepreload"[^>]*>/g, '')

  // Strip the markup only — the bundle legitimately contains ".js" strings.
  const markupOnly = (html) => html.replace(/<script[\s\S]*?<\/script>/g, '<script></script>')

  const leftovers = [
    ...markupOnly(output).matchAll(/(?:src|href)="\.?\/?[^"]+\.(?:js|css)"/g),
  ].map((match) => match[0])
  if (leftovers.length > 0) {
    throw new Error(
      `Des assets n'ont pas été inlinés, le fichier ne marcherait pas hors-ligne :\n  ${leftovers.join('\n  ')}`
    )
  }

  // The fonts are embedded now, so the CDN links must go: leaving them would
  // only produce failed requests on an offline machine.
  output = output.replace(
    /<link[^>]*href="https:\/\/fonts\.googleapis\.com[^"]*"[^>]*>/g,
    ''
  )
  output = output.replace(
    /<link rel="preconnect" href="https:\/\/fonts\.(?:googleapis|gstatic)\.com"[^>]*>/g,
    ''
  )

  // Replace the leftover /vite.svg reference with an embedded icon.
  const faviconDataUri = `data:image/svg+xml;base64,${Buffer.from(FAVICON_SVG).toString('base64')}`
  if (/<link rel="icon"[^>]*>/.test(output)) {
    output = replaceWith(
      /<link rel="icon"[^>]*href="[^"]*"[^>]*>/,
      `<link rel="icon" type="image/svg+xml" href="${faviconDataUri}" />`
    )
  } else {
    output = output.replace('</title>', `</title>\n    <link rel="icon" type="image/svg+xml" href="${faviconDataUri}" />`)
  }

  // Nothing may still point outside the file.
  const external = [
    ...markupOnly(output).matchAll(/(?:src|href)="https?:\/\/[^"]+"/g),
  ].map((match) => match[0])
  if (external.length > 0) {
    throw new Error(
      `Des références externes subsistent, la lecture hors-ligne échouerait :\n  ${external.join('\n  ')}`
    )
  }

  await writeFile(outputFile, output, 'utf8')
  await rm(outDir, { recursive: true, force: true })

  const kb = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(0)
  console.log(`▸ Terminé — ${outputFile} (${kb} KB)`)
  console.log('  Double-clique pour jouer. Ni serveur, ni installation, ni réseau.')
}

await main()