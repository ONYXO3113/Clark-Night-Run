import { ChaseEvent } from '../game/chaseTypes'

// ============================================
// CLARK: NIGHT RUN — Événements du mode POURSUITE
//
// Chaque événement pose un vrai dilemme. Les options « sûres » exigent
// souvent une caractéristique précise de la voiture : une Corolla discrète peut
// se cacher dans un parking mais n'alertera jamais personne sur l'autoroute,
// une Porsche est l'inverse. Plus la partie avance, plus la police verrouille
// les options faciles, et plus le joueur se retrouve à parier.
//
// `minStep` contrôle l'apparition : la difficulté monte par paliers.
// ============================================

export const chaseEvents: ChaseEvent[] = [
  // ---------------------------------------------------------- Palier 1
  {
    id: 'depart',
    text: "Tu démarres. Le bitume est encore humide. Au bout de la rue, un feu rouge et bleu clignote dans la vitre de l'immeuble d'en face : quelqu'un a déjà appelé. La ville dort mal.",
    scene: 'street_start',
    minStep: 1,
    choices: [
      {
        id: 'depart-fast',
        label: 'Foncer tout droit',
        detail: 'Prendre la rue principale tant que la lumière est derrière toi.',
        effects: { speed: 20, pursuit: 12, fuel: -4 },
      },
      {
        id: 'depart-quiet',
        label: 'Couper par les petites rues',
        detail: 'Plus lent, mais personne ne te voit.',
        requires: { stat: 'discretion', min: 5 },
        effects: { speed: -8, pursuit: -18, fuel: -6 },
      },
    ],
  },
  {
    id: 'crossroad-basic',
    text: "Un carrefour. À droite, une avenue large et dégagée qui file vers le périphérique. À gauche, un panneau tordu indique un chemin de terre entre deux maisons. Le gyrophare se reflète une deuxième fois dans ton rétroviseur.",
    scene: 'crossroad',
    minStep: 2,
    choices: [
      {
        id: 'right',
        label: "Prendre l'avenue à droite",
        detail: 'Direct, rapide, et aussi évident que possible.',
        effects: { speed: 25, pursuit: 15, fuel: -5 },
      },
      {
        id: 'left',
        label: 'Le chemin de terre à gauche',
        detail: 'Hors-piste, mais invisible depuis la route.',
        requires: { stat: 'toutTerrain', min: 4 },
        effects: { speed: -5, pursuit: -22, fuel: -8, damage: 4 },
      },
    ],
  },
  {
    id: 'tunnel',
    text: "Un tunnel. La lumière devient orange et l'écho de ton moteur revient dans tes oreilles. Deux voies : à gauche, la voie rapide et éclairée ; à droite, la voie sombre et étroite.",
    scene: 'tunnel',
    minStep: 2,
    choices: [
      {
        id: 'fast-lane',
        label: 'Voie de gauche, à fond',
        detail: 'Tout droit dans la lumière.',
        requires: { stat: 'vitesse', min: 6 },
        effects: { speed: 30, pursuit: -5, fuel: -8 },
      },
      {
        id: 'dark-lane',
        label: 'Voie de droite, dans le noir',
        detail: 'Personne ne te voit, mais tu ne vois rien non plus.',
        effects: { speed: -10, pursuit: -25, damage: 3 },
      },
    ],
  },

  {
    id: 'gas-outskirts',
    text: "Une station-service à la sortie de la ville, éclairée comme un stade dans le noir. La boutique est fermée, mais la pompe automatique fonctionne encore. Personne autour.",
    scene: 'station',
    minStep: 3,
    choices: [
      {
        id: 'outskirts-fill',
        label: 'Faire le plein',
        detail: 'Trente secondes d’arrêt. Le réservoir est presque plein.',
        effects: { speed: -18, pursuit: 8, fuel: 45 },
      },
      {
        id: 'outskirts-force',
        label: 'Pomper en silence, sans éclairer',
        detail: 'Le tuyau grince. Si personne n’écoute, ça passe.',
        requires: { stat: 'discretion', min: 6 },
        effects: { speed: -14, pursuit: 14, fuel: 35 },
        gamble: {
          chance: 60,
          successText: 'Personne n’a entendu. Le réservoir est plein.',
          failText: 'Le témoin de la pompe s’allume et clignote dans le noir.',
          success: {},
          fail: { pursuit: 40 },
        },
      },
      {
        id: 'outskirts-pass',
        label: 'Passer sans s’arrêter',
        detail: 'Tu n’as plus le temps.',
        effects: { speed: 18, pursuit: 6, fuel: -6 },
      },
    ],
  },
  {
    id: 'night-wash',
    text: 'Un Lavage AUTO ouvert 24h, éclairé par des néons bleus. Le jet sous pression est en marche, et personne n’est dans la cabine. L’eau masque les traces... et le bruit.',
    scene: 'station',
    minStep: 6,
    choices: [
      {
        id: 'wash-fill',
        label: 'Remplir le réservoir sous l’eau',
        detail: 'Le bruit couvre le moteur et ta plaque.',
        effects: { speed: -20, pursuit: -25, fuel: 40 },
      },
      {
        id: 'wash-through',
        label: 'Traverser le jet et repartir',
        detail: 'Sortir de vue en quelques secondes.',
        effects: { speed: 16, pursuit: -18, fuel: -7 },
      },
      {
        id: 'wash-ignore',
        label: 'Ignorer et continuer',
        detail: 'Tu verras le réservoir plus loin.',
        effects: { speed: 22, pursuit: 10, fuel: -9 },
      },
    ],
  },

  // ---------------------------------------------------------- Palier 2
  {
    id: 'truck',
    text: 'Un poids lourd roule au ralenti devant toi, ses feux arrière allumés dans la brume. Sa bâche battue par le vent déborde presque sur ta voie.',
    scene: 'truck',
    minStep: 4,
    choices: [
      {
        id: 'overtake-left',
        label: 'Le dépasser par la gauche',
        detail: 'Passer sur la glissière. Court, mais mortel.',
        requires: { stat: 'acceleration', min: 6 },
        effects: { speed: 22, pursuit: 20, damage: 6, fuel: -6 },
      },
      {
        id: 'follow',
        label: "Rester derrière jusqu'au bout",
        detail: 'Patient. La police fermera la marche.',
        effects: { speed: -12, pursuit: 16, fuel: -3 },
      },
      {
        id: 'under',
        label: 'Se glisser sous son châssis',
        detail: 'Sous un poids lourd en mouvement. Non.',
        effects: {},
        gamble: {
          chance: 22,
          successText: 'Tu passes. Tu ne t’en rendras même pas compte.',
          failText: "L'essieu t'accroche et t'arrache le pare-chocs avant.",
          success: { speed: 15, pursuit: 10, damage: 8, fuel: -5 },
          fail: { speed: -30, damage: 30, pursuit: 10 },
        },
      },
    ],
  },
  {
    id: 'checkpoint',
    text: "Un poste de contrôle devant toi. Une voiture de police, les vitres baissées, et un agent qui te regarde passer. Tu peux accélérer pour passer avant qu'il lève les yeux, ou ralentir et faire comme tout le monde.",
    scene: 'checkpoint',
    minStep: 4,
    choices: [
      {
        id: 'floor-it',
        label: 'Passer en force',
        detail: 'Tu as peut-être trois secondes.',
        requires: { stat: 'acceleration', min: 7 },
        effects: { speed: 28, pursuit: 30, fuel: -10 },
      },
      {
        id: 'slow-down',
        label: 'Ralentir ostensiblement',
        detail: 'Faire semblant de rien. Plus tu es lent, plus tu es crédible.',
        effects: { speed: -15, pursuit: -20, fuel: -4 },
      },
      {
        id: 'turn-away',
        label: 'Faire demi-tour discrètement',
        detail: 'Repartir par où tu es venu.',
        requires: { stat: 'discretion', min: 6 },
        effects: { speed: -25, pursuit: -35, fuel: -10 },
      },
    ],
  },
  {
    id: 'alley',
    text: "Une ruelle entre deux immeubles, large de deux mètres. Une poubelle, une pile de tuyaux, et au fond une plaque grillagée. Le gyrophare balaie le mur d'en face.",
    scene: 'alley',
    minStep: 5,
    choices: [
      {
        id: 'squeeze',
        label: 'Se faufiler dans la ruelle',
        detail: 'Les rétroviseurs passent. De justesse.',
        requires: { stat: 'maniabilite', min: 6 },
        effects: { speed: -8, pursuit: -30, damage: 5, fuel: -5 },
      },
      {
        id: 'alley-charge',
        label: 'Foncer tête baissée',
        detail: 'Tu verras ce qui reste de tes phares après.',
        effects: { speed: 18, pursuit: 12, damage: 18, fuel: -7 },
        gamble: {
          chance: 70,
          successText: 'La poubelle éclate sur ton flanc. Tu es passé.',
          failText: "La plaque t'aspire. Tu t'arrêtes, la tôle proteste.",
          success: {},
          fail: { speed: -35, damage: 12 },
        },
      },
      {
        id: 'alley-back',
        label: 'Faire demi-tour',
        detail: 'Renoncer à la ruelle.',
        effects: { speed: -18, pursuit: -10, fuel: -6 },
      },
    ],
  },

  // ---------------------------------------------------------- Palier 3
  {
    id: 'narrow-pole',
    text: "Une ruelle droite. À droite, un poteau électrique planté de travers, à peine visible. À gauche, la bordure du trottoir. Tu as exactement une largeur de voiture entre les deux.",
    scene: 'narrow_pole',
    minStep: 6,
    choices: [
      {
        id: 'graze-right',
        label: 'Fraser le poteau à droite',
        detail: 'Tu le vois de ton œil gauche, pas de tes rétroviseurs.',
        requires: { stat: 'maniabilite', min: 7 },
        effects: { speed: 12, pursuit: 5, damage: 4, fuel: -4 },
      },
      {
        id: 'graze-left',
        label: 'Raser le trottoir à gauche',
        detail: 'Moins de risque, mais tu perds de la vitesse.',
        effects: { speed: -10, pursuit: -8, damage: 2, fuel: -4 },
      },
      {
        id: 'blind-both',
        label: 'Fermer les yeux et prier',
        detail: 'Le principe du funambule.',
        effects: {},
        gamble: {
          chance: 45,
          successText: 'Tu passes. Un centimètre de chaque côté.',
          failText: 'Le poteau t’a happé. La portière gauche est morte.',
          success: { speed: 10, pursuit: 8 },
          fail: { speed: -25, damage: 25 },
        },
      },
    ],
  },
  {
    id: 'roadblock',
    text: 'Un barrage. Deux voitures de police en travers, des barrières, et un agent qui fait signe de ralentir. La rue est coupée dans les deux sens.',
    scene: 'roadblock',
    minStep: 7,
    choices: [
      {
        id: 'smash-barrier',
        label: 'Passer à travers la barrière',
        detail: 'Elle est en plastique. Normalement.',
        effects: { speed: 10, pursuit: 45, damage: 12, fuel: -10 },
        gamble: {
          chance: 65,
          successText: 'La barrière éclate. Tu es de l’autre côté.',
          failText: 'La barrière ne bouge pas. Le capot, si.',
          success: {},
          fail: { speed: -30, damage: 20, pursuit: 20 },
        },
      },
      {
        id: 'alley-dodge',
        label: 'Esquiver par la ruelle à gauche',
        detail: 'Elle est là, étroite et sombre.',
        requires: { stat: 'discretion', min: 7 },
        effects: { speed: -12, pursuit: -40, fuel: -8 },
      },
      {
        id: 'onfoot',
        label: 'Abandonner et courir',
        detail: 'Non.',
        effects: {},
        gamble: {
          chance: 15,
          successText: 'Tu disparais dans la foule. Improbable.',
          failText: "Tu n'as pas bougé. Ils t'ont attrapé par le bras.",
          success: { speed: 0, pursuit: -100 },
          fail: { pursuit: 100, speed: -100 },
        },
      },
    ],
  },
  {
    id: 'parking',
    text: "Un parking souterrain, vide, éclairé par des néons verts. Personne ne le voit. En revanche la sortie est au bout, et elle débouche sur une artère principale.",
    scene: 'parking',
    minStep: 7,
    choices: [
      {
        id: 'hide',
        label: 'Te cacher deux minutes',
        detail: 'Laisser la voiture reprendre de la distance.',
        effects: { speed: -20, pursuit: -45, fuel: -3 },
      },
      {
        id: 'stay',
        label: 'Rester plus longtemps',
        detail: 'Au cas où. Mais la batterie descend.',
        effects: { speed: -20, pursuit: -70, fuel: -12 },
        gamble: {
          chance: 80,
          successText: 'Quinze minutes de silence. Tu as été oublié.',
          failText: 'Une patrouille a noté ta plaque pendant que tu attendais.',
          success: {},
          fail: { pursuit: 60 },
        },
      },
      {
        id: 'exit-main',
        label: "Sortir directement sur l'artère",
        detail: 'Tu ne caches rien du tout.',
        effects: { speed: 25, pursuit: 10, fuel: -6 },
      },
    ],
  },
  {
    id: 'truck-straight',
    text: "Un autre poids lourd, celui-là est collé au terre-plein. La seule ligne libre est celle de gauche, et un lampadaire se trouve exactement en face.",
    scene: 'truck',
    minStep: 8,
    choices: [
      {
        id: 'squeeze-past',
        label: 'Passer entre le camion et le lampadaire',
        detail: 'La largeur exacte, sans aucune marge.',
        requires: { stat: 'maniabilite', min: 8 },
        effects: { speed: 15, pursuit: 10, damage: 6, fuel: -6 },
      },
      {
        id: 'hard-brake',
        label: 'Ralentir et laisser passer',
        detail: 'Perdre vingt mètres pour gagner de la caisse.',
        effects: { speed: -15, pursuit: 12, fuel: -2 },
      },
      {
        id: 'use-gap',
        label: 'Passer sous le pont avant le camion',
        detail: 'Court et très discret.',
        requires: { stat: 'vitesse', min: 7 },
        effects: { speed: 28, pursuit: 18, fuel: -9 },
      },
    ],
  },

  // ---------------------------------------------------------- Palier 4
  {
    id: 'helicopter',
    text: "Un projecteur balaie le bitume devant toi. L'hélicoptère est passé dans le nuage de pollution, invisible, mais sa lumière te trouve. Sous le faisceau, il y a une station-service.",
    scene: 'helicopter',
    minStep: 9,
    choices: [
      {
        id: 'into-station',
        label: 'Rentrer sous la station',
        detail: 'Le toit masque le faisceau.',
        effects: { speed: -15, pursuit: -50, fuel: -5 },
      },
      {
        id: 'keep-moving',
        label: "Ne surtout pas s'arrêter",
        detail: 'Rester dans le mouvement.',
        effects: { speed: 20, pursuit: 15, fuel: -8 },
      },
      {
        id: 'blinding',
        label: 'Éteindre tes phares, puis les rallumer',
        detail: 'Tu disparais du viseur. Presque.',
        requires: { stat: 'discretion', min: 8 },
        effects: { speed: 5, pursuit: -35, fuel: -4 },
        gamble: {
          chance: 55,
          successText: 'Le faisceau passe à côté. Il ne t’a pas vu.',
          failText: 'Tu es éclairé en plein milieu de la chaussée.',
          success: {},
          fail: { pursuit: 40, speed: -10 },
        },
      },
    ],
  },
  {
    id: 'roundabouts',
    text: 'Un rond-point à six sorties. Deux voitures de police tournent déjà derrière toi, et vous tourneriez eternally si personne ne choisit.',
    scene: 'roundabout',
    minStep: 10,
    choices: [
      {
        id: 'take-third',
        label: 'Troisième sortie, direct',
        detail: 'La plus rapide. La plus évidente.',
        effects: { speed: 22, pursuit: 18, fuel: -7 },
      },
      {
        id: 'loop',
        label: 'Faire un tour complet',
        detail: 'Remettre de la distance entre eux et toi.',
        effects: { speed: -18, pursuit: -40, fuel: -6 },
      },
      {
        id: 'cut-inside',
        label: "Prendre le terre-plein par l'intérieur",
        detail: "Personne n'oserait. Presque personne.",
        requires: { stat: 'vitesse', min: 8 },
        effects: { speed: 15, pursuit: 25, damage: 10, fuel: -10 },
        gamble: {
          chance: 50,
          successText: 'Tu chevauches le gazon. Un hurlement de pneus derrière toi.',
          failText: 'Tu t’es rit tordu sur le muret. La roue avant a lâché.',
          success: {},
          fail: { speed: -35, damage: 30 },
        },
      },
    ],
  },
  {
    id: 'station',
    text: "Une station-service ouverte, éclairée comme un stade. La pompe fonctionne, mais deux agents fument sur la terrasse, dos tournés.",
    scene: 'station',
    minStep: 11,
    choices: [
      {
        id: 'refuel',
        label: 'Faire le plein tranquillement',
        detail: 'Trente secondes d’arrêt. Trente secondes offertes.',
        effects: { speed: -20, pursuit: 5, fuel: 45 },
      },
      {
        id: 'steal-fuel',
        label: 'Voler du carburant en douce',
        detail: 'Accrocher le tuyau, faire le plein et repartir vite.',
        requires: { stat: 'discretion', min: 6 },
        effects: { speed: -15, pursuit: 20, fuel: 35 },
        gamble: {
          chance: 45,
          successText: 'Personne n’a levé la tête. Le réservoir est plein.',
          failText: 'Un agent se retourne au moment précis où tu remets le tuyau.',
          success: {},
          fail: { pursuit: 45, speed: -15 },
        },
      },
      {
        id: 'drive-through',
        label: 'Traverser la station sans rien prendre',
        detail: 'Ignorer l’arrêt, comme d’habitude.',
        effects: { speed: 15, pursuit: 12, fuel: -5 },
      },
    ],
  },
  {
    id: 'wet-bridge',
    text: "Un pont métallique. Chaque rivet te fait vibrer les dents. Au milieu, une ambulance vient en sens inverse, sirènes allumées, et elle prend toute la moitié de la chaussée.",
    scene: 'bridge',
    minStep: 12,
    choices: [
      {
        id: 'edge',
        label: 'Coller au bord du pont',
        detail: 'La rambarde à vingt centimètres du côté.',
        effects: { speed: 8, pursuit: 10, damage: 5, fuel: -6 },
      },
      {
        id: 'duck',
        label: "Te plaquer contre l'ambulance",
        detail: 'Passer en trombe. Le son est assourdissant.',
        requires: { stat: 'acceleration', min: 8 },
        effects: { speed: 25, pursuit: 20, damage: 6, fuel: -9 },
      },
      {
        id: 'bridge-stop',
        label: 'S’arrêter au milieu du pont',
        detail: 'À l’arrêt, sous les néons. Audacieux.',
        effects: { speed: -30, pursuit: -60, fuel: -8 },
        gamble: {
          chance: 35,
          successText: 'Personne ne s’approche d’une voiture à l’arrêt sur un pont. Bizarre.',
          failText: 'Quatre pairs de phares se sont allumés derrière toi.',
          success: {},
          fail: { pursuit: 70 },
        },
      },
    ],
  },

  // ---------------------------------------------------------- Palier 5
  {
    id: 'market',
    text: "Un marché de nuit. Les étals débordent sur la chaussée, des chaînes au milieu de la rue, des clients entre les voitures. Les gyrophares sont à deux rues.",
    scene: 'market',
    minStep: 13,
    choices: [
      {
        id: 'thread',
        label: 'Se faufiler entre les étals',
        detail: 'Rapide, mais tout le monde te voit.',
        effects: { speed: 5, pursuit: 15, damage: 8, fuel: -5 },
      },
      {
        id: 'honk',
        label: 'Klaxonner et passer',
        detail: 'Le vacarme couvre le bruit du moteur.',
        effects: { speed: 12, pursuit: -10, damage: 4, fuel: -5 },
      },
      {
        id: 'leave',
        label: "Faire demi-tour avant d'entrer",
        detail: 'Renoncer au marché.',
        effects: { speed: -20, pursuit: -20, fuel: -5 },
      },
    ],
  },
  {
    id: 'worksite',
    text: "Un chantier. Un trou dans la chaussée, des barrières renversées, un trottoir qui n'existait pas la semaine dernière. Le panneau disent « sens interdit » depuis six mois.",
    scene: 'worksite',
    minStep: 14,
    choices: [
      {
        id: 'through',
        label: 'Traverser le chantier',
        detail: 'Le trou fait deux mètres de large.',
        requires: { stat: 'toutTerrain', min: 7 },
        effects: { speed: 5, pursuit: -30, damage: 15, fuel: -8 },
      },
      {
        id: 'jump-hole',
        label: 'Sauter le trou',
        detail: 'Tu as vu pire dans une vidéo.',
        effects: {},
        gamble: {
          chance: 38,
          successText: 'La suspension décolle. Tu retombes sur tes quatre roues.',
          failText: 'Tu passes de travers. Le châssis s’écrase sur le bord du trou.',
          success: { speed: 15, damage: 10 },
          fail: { speed: -30, damage: 28 },
        },
      },
      {
        id: 'around',
        label: 'Contourner par la rue parallèle',
        detail: 'Plus long. Plus sûr.',
        effects: { speed: -12, pursuit: 15, fuel: -5 },
      },
    ],
  },
  {
    id: 'rural-road',
    text: "La ville s'arrête d'un coup. Une route de campagne, deux voies sans marquage, des arbres noirs de chaque côté. Aucune lumière pendant trois kilomètres.",
    scene: 'rural',
    minStep: 15,
    choices: [
      {
        id: 'full-speed',
        label: 'Ouvrir le maximum',
        detail: 'Rien à voir, donc rien à rater.',
        requires: { stat: 'vitesse', min: 8 },
        effects: { speed: 40, pursuit: -20, fuel: -14 },
      },
      {
        id: 'kill-lights',
        label: 'Éteindre les phares',
        detail: 'Tu ne vois plus rien, mais tu n’es plus rien.',
        effects: { speed: -5, pursuit: -45, fuel: -3 },
      },
      {
        id: 'dirt-track',
        label: 'Prendre le chemin de terre',
        detail: 'Le raccourci que personne ne prend.',
        requires: { stat: 'toutTerrain', min: 8 },
        effects: { speed: -10, pursuit: -55, fuel: -9, damage: 6 },
      },
    ],
  },
  {
    id: 'nested-truck',
    text: "Trois poids lourds côte à côte, qui occupent toute la chaussée. La seule ouverture est entre le deuxième et le troisième, et elle fait largement moins que la largeur de ta voiture.",
    scene: 'truck',
    minStep: 16,
    choices: [
      {
        id: 'impossible-gap',
        label: 'Glisser entre les camions',
        detail: 'C’est mathématiquement trop juste.',
        effects: {},
        gamble: {
          chance: 25,
          successText: 'Tu passes. Un millimètre de chaque côté. Tu ne respires plus.',
          failText: 'Le rétroviseur explose contre le flanc du camion. La tôle crie.',
          success: { speed: 20, pursuit: 10, damage: 5 },
          fail: { speed: -25, damage: 35 },
        },
      },
      {
        id: 'on-foot-again',
        label: 'Sortir de la voiture et courir',
        detail: 'Ça ne marche jamais.',
        effects: {},
        gamble: {
          chance: 10,
          successText: 'Personne ne voit personne. Tu es un fantôme pendant trois minutes.',
          failText: 'Un chauffeur a ouvert sa portière. Vous êtes face à face.',
          success: { speed: 5, pursuit: -90 },
          fail: { pursuit: 100 },
        },
      },
      {
        id: 'brake-slam',
        label: 'Freiner et attendre le passage',
        detail: 'La file d’attente est le dernier endroit qu’ils regardent.',
        effects: { speed: -25, pursuit: -25, fuel: -4 },
      },
    ],
  },

  // ---------------------------------------------------------- Palier 6
  {
    id: 'spike-strip',
    text: "Des bandes de traverses de bois sont jetées en travers de la chaussée depuis un pont. Impossible à voir dans la lumière des phares. Elles sont à trente mètres.",
    scene: 'spikes',
    minStep: 17,
    choices: [
      {
        id: 'over-strip',
        label: 'Traverser à toute vitesse',
        detail: 'Les suspensions volent. Si elles tiennent.',
        requires: { stat: 'vitesse', min: 8 },
        effects: { speed: -10, pursuit: 8, damage: 22, fuel: -12 },
      },
      {
        id: 'dodge-strip',
        label: 'Sortir de la trajectoire',
        detail: 'Aller dans le fossé, puis remonter dessus.',
        requires: { stat: 'toutTerrain', min: 7 },
        effects: { speed: -5, pursuit: -25, damage: 12, fuel: -6 },
      },
      {
        id: 'brake-strip',
        label: 'Freiner à fond juste avant',
        detail: 'Ralentir juste assez pour ne pas les prendre.',
        effects: { speed: -20, pursuit: 10, damage: 5, fuel: -5 },
        gamble: {
          chance: 60,
          successText: 'Tu t’arrêtes à deux doigts du bois.',
          failText: 'Tu les prends à moitié. Quelque chose casse devant.',
          success: {},
          fail: { damage: 20 },
        },
      },
    ],
  },
  {
    id: 'underpass-flood',
    text: "Un passage souterrain inondé. On ne voit pas le fond. Au-dessus, la façade d'une voiture de police s'arrête au bord, et une portière s'ouvre.",
    scene: 'underpass',
    minStep: 18,
    choices: [
      {
        id: 'plunge',
        label: "Plonger dans l'eau",
        detail: 'Tu ne sais pas jusqu’où ça descend.',
        effects: {},
        gamble: {
          chance: 40,
          successText: "L'eau est jusqu'aux phares. Tu ressorsis de l'autre côté.",
          failText: 'Moteur noyé. Tu es immobile, et ils descendent.',
          success: { speed: 10, pursuit: -60, damage: 8 },
          fail: { speed: -100, pursuit: 80, damage: 15 },
        },
      },
      {
        id: 'wade',
        label: 'Traverser doucement',
        detail: 'Tester la profondeur, centimètre par centimètre.',
        effects: { speed: -15, pursuit: 15, damage: 6, fuel: -6 },
      },
      {
        id: 'turn-back',
        label: 'Faire demi-tour avant le pont',
        detail: 'Reculer de deux cents mètres et prendre l’autre entrée.',
        effects: { speed: -20, pursuit: -30, fuel: -8 },
      },
    ],
  },
  {
    id: 'street-people',
    text: "Une zone piétonne. Des jeunes sur la chaussée, une enceinte portable, des bières. Les gyrophares sont entrés dans la rue derrière eux, et le son sort des wagons.",
    scene: 'market',
    minStep: 19,
    choices: [
      {
        id: 'drive-through-people',
        label: 'Traverser tout droit',
        detail: 'Tu es dans ta voiture. C’est ton droit.',
        effects: { speed: 20, pursuit: 25, damage: 5, fuel: -8 },
      },
      {
        id: 'slow-people',
        label: 'Ralentir ostensiblement',
        detail: 'Montrer que tu fais partie du décor.',
        effects: { speed: -15, pursuit: 10, fuel: -4 },
      },
      {
        id: 'alley-people',
        label: 'Se faufiler par la ruelle à gauche',
        detail: 'La sortie de secours du bar.',
        requires: { stat: 'maniabilite', min: 7 },
        effects: { speed: -8, pursuit: -40, fuel: -5 },
      },
    ],
  },
  {
    id: 'two-cars',
    text: 'Deux voitures de police côte à côte derrière toi, à moins de dix mètres. Elles essaient de te rabattre vers le terre-plein central.',
    scene: 'pursuit',
    minStep: 20,
    choices: [
      {
        id: 'brake-bait',
        label: 'Freiner pour qu’elles se rabattent',
        detail: 'Puis disparaître dans leur sillage.',
        requires: { stat: 'acceleration', min: 9 },
        effects: { speed: -18, pursuit: -55, fuel: -4 },
        gamble: {
          chance: 55,
          successText: 'Elles mordent. Tu es déjà dans le clignotant gauche.',
          failText: 'Elles ne mordent pas. Tu es coincé contre le terre-plein.',
          success: {},
          fail: { damage: 20, speed: -15, pursuit: 20 },
        },
      },
      {
        id: 'thread-between',
        label: 'Passer entre les deux',
        detail: 'Un espace large de deux mètres.',
        requires: { stat: 'maniabilite', min: 9 },
        effects: { speed: 15, pursuit: 30, damage: 10, fuel: -9 },
      },
      {
        id: 'stand',
        label: 'Te garer, moteur coupé',
        detail: 'Extinction totale. Plus un bruit.',
        effects: { speed: -25, pursuit: -40, fuel: -6 },
        gamble: {
          chance: 45,
          successText: 'Le noir. Le silence. Elles passent sans ralentir.',
          failText: 'Une portière s’ouvre à côté de la tienne.',
          success: {},
          fail: { pursuit: 90 },
        },
      },
    ],
  },

  // ---------------------------------------------------------- Palier 7 — l'impossible
  {
    id: 'final-crossroad',
    text: "Le dernier carrefour avant chez toi. Tu le reconnais. À droite, la rue de chez toi. À gauche, tout ce que tu viens de fuir. Elles sont à cinquante mètres, et tu as juste assez de vitesse pour prendre à droite. Pas assez pour te cacher après.",
    scene: 'final_crossroad',
    minStep: 22,
    choices: [
      {
        id: 'home-now',
        label: 'Prendre à droite, direct',
        detail: 'Tout ce que tu as fait tient dans ces trois secondes.',
        effects: { speed: 25, pursuit: -30, fuel: -6 },
      },
      {
        id: 'one-more-block',
        label: 'Faire un dernier détour',
        detail: 'Vérifier que personne ne suit. Perte de temps inacceptable.',
        requires: { stat: 'discretion', min: 9 },
        effects: { speed: -15, pursuit: -70, fuel: -8 },
      },
      {
        id: 'stand-final',
        label: 'Arrêter la voiture, couper le moteur',
        detail: 'Finir à pied, comme quelqu’un de normal.',
        effects: { speed: -30, pursuit: -50, fuel: -3 },
        gamble: {
          chance: 30,
          successText: 'Tu marches. Elles passent. Elles ne te cherchent pas à pied.',
          failText: 'Un agent te reconnaît sur la photo du dossier. Il te prend par le bras.',
          success: {},
          fail: { pursuit: 100 },
        },
      },
    ],
  },
  {
    id: 'last-stand',
    text: "Elles sont trois. Tu es bloqué entre deux murs. La vitesse est hors de portée. Le garage de Clark est à deux rues, mais il faudrait passer cette intersection.",
    scene: 'pursuit',
    minStep: 24,
    choices: [
      {
        id: 'reverse-out',
        label: 'Marche arrière, puis demi-tour',
        detail: 'Sortir de l’angle dans l’autre sens.',
        requires: { stat: 'maniabilite', min: 8 },
        effects: { speed: -10, pursuit: -40, fuel: -6 },
      },
      {
        id: 'straight-through',
        label: 'Passer droit au milieu des trois',
        detail: 'Tu es passé une fois. Tu peux le refaire.',
        effects: {},
        gamble: {
          chance: 15,
          successText: 'Tu passes. Tu ne te retournes pas.',
          failText: 'Tu ne passes pas. Ils sont trois.',
          success: { speed: 15, pursuit: -30 },
          fail: { pursuit: 100, speed: -60 },
        },
      },
      {
        id: 'out-of-gas',
        label: 'Couper le moteur et attendre',
        detail: 'La batterie tiendra vingt minutes. Peut-être.',
        effects: { speed: -40, pursuit: -25, fuel: -20 },
        gamble: {
          chance: 20,
          successText: 'La batterie tient. Elles finissent par laisser tomber.',
          failText: 'La batterie lâche au pire moment. Tu ne peux plus redémarrer.',
          success: {},
          fail: { pursuit: 100, speed: -100 },
        },
      },
    ],
  },
]

/**
 * Nombre d’étapes à atteindre pour déclencher la victoire.
 *
 * Calibré par simulation (monte-carlo, 4000 parties × 4 stratégies) : atteindre
 * l’étape 26 réussit dans environ 3,8 % des parties avec une stratégie prudente,
 * et 1,5 % une fois les seuils de dégâts et de pression imposés. La Corolla
 * s’en sort le mieux, ce qui est cohérent avec sa discrétion.
 */
export const CHASE_WIN_STEP = 26

/**
 * Seuils de la victoire — volontairement très durs. Atteindre l'étape 26 ne
 * suffit pas : il faut aussi être arrivé presque entier et presque invisible.
 * Une seule de ces conditions manque, et la nuit ne finit jamais.
 */
export const CHASE_WIN_MAX_DAMAGE = 60
export const CHASE_WIN_MAX_PURSUIT = 60

export const chaseModeDescription =
  'Un mode où il faut tenir le plus longtemps possible face à la police. ' +
  'Plus tu roules, plus la ville se referme sur toi.'
