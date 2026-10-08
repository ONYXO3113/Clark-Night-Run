# CLARK: NIGHT RUN

Jeu narratif automobile à choix, en français. 12 chapitres, 6 fins, 3 véhicules,
5 personnages, 10 statistiques.

## Jouer

**Double-clique sur `CLARK_NIGHT_RUN.html`.** C'est tout.

Ni serveur, ni installation, ni connexion internet. Le fichier est autonome :
le code, les styles et les polices sont embarqués dedans.

## Modifier le jeu

Le fichier HTML est généré — ne l'édite pas directement, tes changements
serais écrasés au prochain build. On modifie les sources puis on régénère :

```bash
npm install       # une seule fois
npm run build:single
```

### Où changer quoi

| Fichier | Contenu |
| --- | --- |
| `src/data/chapters.ts` | Tout le texte, les choix, les branches, les 6 fins |
| `src/data/vehicles.ts` | Les 3 véhicules et leurs caractéristiques |
| `src/data/characters.ts` | Les 5 personnages |
| `src/game/gameState.ts` | Statistiques de départ (argent, carburant, confiance…) |
| `src/game/GameContext.tsx` | Logique de jeu, sauvegarde automatique |
| `src/game/saveSystem.ts` | Lecture/écriture de la sauvegarde |
| `src/types.ts` | La structure des données |
| `src/index.css` | Couleurs, typographie, mise en page |
| `src/components/SceneImage.tsx` | Les scènes SVG (ville, pluie, véhicules…) |
| `src/pages/` | Les écrans : menu, garage, personnages, stats, fins, options |

## Commandes

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build:single` | Génère `CLARK_NIGHT_RUN.html` (le fichier jouable) |
| `npm run build` | Typecheck + build classique dans `dist/` |
| `npm run preview` | Prévisualise le build classique |

`build:single` télécharge les polices Google une seule fois et les incorpore en
base64. Sans réseau, le build fonctionne quand même : le jeu utilise alors les
polices de repli définies dans `src/index.css`.

## Sauvegarde

La progression est enregistrée automatiquement dans le `localStorage` du
navigateur, sous la clé `clark_night_run_save`. Comme le jeu est ouvert en
`file://`, la sauvegarde est propre à ce fichier dans ce navigateur : l'ouvrir
à un autre emplacement ou dans un autre navigateur repart de zéro.

## Notes techniques

- React 18 + TypeScript + Vite.
- Pas de router : les écrans sont pilotés par l'état React, donc rien à adapter
  pour `file://`.
- Aucun appel réseau, aucun audio : le jeu fonctionne entièrement hors-ligne.
- `scripts/build-single.mjs` vérifie qu'aucune référence externe ne subsiste
  dans le fichier produit, et échoue si c'est le cas.