# CLARK: NIGHT RUN

Jeu narratif automobile à choix, en français. 16 chapitres, 6 fins, 3 véhicules,
5 personnages, 10 statistiques, un mini-jeu de tir.

Le projet existe en **deux formes** qui partagent le même texte.

---

## 1. Le livre-jeu web — `livre/`

C'est **la version à publier**. Des pages HTML autonomes, une feuille de style
séparée, aucune dépendance.

### Jouer

**Double-cliquez sur `livre/index.html`.** C'est tout.

Ni serveur, ni installation, ni connexion internet : polices et images sont
incorporées dans les fichiers. Vous pouvez copier le dossier `livre/` sur une
clé USB et le lire hors connexion.

### Contenu

| Fichier | Rôle |
| --- | --- |
| `livre/index.html` | La couverture — page différente de toutes les autres |
| `livre/garage.html` | Choix du véhicule |
| `livre/c01a.html` … `c16b.html` | L'aventure : 31 pages de récit et de décisions |
| `livre/fin1.html` … `fin6.html` | Les six conclusions |
| `livre/sommaire.html` `fins.html` `perso.html` `aide.html` `credits.html` | Index et annexes |
| `livre/style.css` | Feuille de style unique (polices incluses) |
| `livre/game.js` | Progression, choix, mini-jeu |
| `livre/images/*.svg` | 30 illustrations originales |

**44 pages HTML**, chacune avec plusieurs liens. Chaque page suit le même
gabarit : un conteneur principal `.page` contenant un conteneur image
`.zone-image`, un conteneur texte `.zone-texte` et un conteneur liens
`.zone-liens`. Seul `index.html` sort de ce gabarit.

### Générer le livre

```bash
npm install          # une seule fois
npm run build:livre
```

Le contenu vient de `src/data/chapters.ts` : modifiez le texte, relancez la
commande, les pages sont régénérées. `livre/` est effacé puis reconstruit à
chaque fois — ne l'éditez jamais à la main.

Le build échoue si quelque chose ne va pas :

- moins de 30 pages HTML ;
- un nom de fichier avec une majuscule, un espace ou un caractère spécial
  (seuls `0-9` et `a-z` sont acceptés) ;
- un lien ou une image qui pointe dans le vide ;
- une page inatteignable depuis `index.html` ;
- une page qui n'aurait qu'un seul lien ;
- une adresse locale (`c:\…`), une URL `file://` ou une ressource distante ;
- une erreur JavaScript dans `game.js` ;
- un mini-jeu qui ne se déclenche pas dans un vrai navigateur.

### Images

Les 30 illustrations sont des **SVG originaux** écrits pour ce projet. Elles
sont libres de droit par construction : aucune banque d'images, aucune image
tierce, aucun retraitement. Les polices Orbitron, Rajdhani et Share Tech Mono
viennent de Google Fonts sous licence SIL Open Font License et sont incorporées
dans `style.css`.

---

## 2. L'application React — `src/`

La version interactive, en un seul fichier HTML. Elle ajoute le **mode
Poursuite** : un mode sans fin où il faut tenir le plus longtemps possible face
à la police, avec 3 difficultés, 3 véhicules, des records sauvegardés et son
propre mini-jeu de tir.

### Jouer

**Double-cliquez sur `index.html`** à la racine du projet.

### Générer

```bash
npm run build:single   # index.html à la racine, fichier unique de 2 Mo
npm run dev            # serveur de développement
npm run build          # typecheck + build classique dans dist/
npm run preview        # prévisualiser le build classique
```

---

## Où changer quoi

| Fichier | Contenu |
| --- | --- |
| `src/data/chapters.ts` | Tout le texte, les choix, les branches, les 6 fins |
| `src/data/vehicles.ts` | Les 3 véhicules et leurs caractéristiques |
| `src/data/characters.ts` | Les 5 personnages |
| `src/data/chase.ts` | Les événements du mode Poursuite |
| `src/game/gameState.ts` | Statistiques de départ (argent, carburant, confiance…) |
| `src/game/GameContext.tsx` | Logique de jeu, sauvegarde automatique |
| `src/game/chaseState.ts` | Moteur du mode Poursuite |
| `src/types.ts` | La structure des données |
| `src/index.css` | Couleurs, typographie, mise en page de l'application |
| `scripts/build-livre.mjs` | Génération des pages HTML du livre |
| `scripts/livre-assets.mjs` | Illustrations SVG, `style.css` et `game.js` |

## Sauvegarde

La progression est enregistrée automatiquement dans le `localStorage` du
navigateur, sous la clé `clark_night_run_save` pour l'application et
`clark_night_run_livre` pour le livre. Comme le jeu est ouvert en `file://`,
la sauvegarde est propre à ce fichier dans ce navigateur : l'ouvrir ailleurs ou
dans un autre navigateur repart de zéro. La page des fins du livre propose un
bouton pour tout effacer.

## Notes techniques

- React 18 + TypeScript + Vite pour l'application.
- Le livre n'a **aucune dépendance** : HTML, CSS et JavaScript natif.
- Aucun appel réseau : les deux versions fonctionnent entièrement hors-ligne.
- `scripts/build-single.mjs` vérifie qu'aucune référence externe ne subsiste
  dans le fichier React produit, et échoue si c'est le cas.