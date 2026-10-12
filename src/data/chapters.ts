import { Chapter } from '../types'

// ============================================
// CLARK: NIGHT RUN — Chapitres
// ============================================

export const chapters: Record<string, Chapter> = {
  // ==========================================
  // CHAPITRE 1 — LE GARAGE
  // ==========================================
  ch1: {
    id: 'ch1',
    number: 1,
    title: 'LE GARAGE',
    subtitle: '23h14 — Quelque part en ville',
    image: 'garage',
    atmosphere: 'calm',
    text: [
      'La ville est plongée dans la nuit.',
      'Les rues sont presque désertes. Seuls les néons des stations-service percent l\'obscurité, reflétés sur l\'asphalte encore humide.',
      'Clark est dans son garage. L\'odeur d\'huile, de caoutchouc chaud et de métal. Trois voitures. Trois possibilités.',
      'Il regarde ses trois voitures. La Porsche, noire, agressive, qui semble respirer même à l\'arrêt. La Corolla, grise, banale, invisible. Le Ram, massif, imposant, indestructible.',
      'Il sait que ce soir pourrait être différent.',
      'Les murs du garage sont tapissés de photos de courses. Des trophées. Des articles de presse jaunis. Chaque victoire est une cicatrice. Chaque défaite, une leçon.',
      'Clark n\'a jamais vraiment été du genre à faire demi-tour. Mais cette côte-là, dans un coin sombre de la ville, personne ne la connaît sauf lui.',
      'Au loin, des moteurs. Plusieurs. Ils se rapprochent.',
      'Son téléphone vibre. Un message. Numéro inconnu.',
    ],
    dialogue: [
      { speaker: 'TÉLÉPHONE', text: '"23h30. Même endroit. Mais cette fois, ils savent qu\'on arrive."', color: '#7b68ee' },
    ],
    choices: [
      {
        id: 'ch1_porsche',
        text: 'Prendre la PORSCHE 911 Turbo S',
        tag: 'RISQUÉ',
        nextChapter: 'ch2',
        effects: [
          { type: 'heat', value: 5 },
          { type: 'reputation', value: 10 },
        ],
      },
      {
        id: 'ch1_corolla',
        text: 'Prendre la TOYOTA COROLLA',
        tag: 'DISCRET',
        nextChapter: 'ch2',
        effects: [
          { type: 'heat', value: -5 },
          { type: 'reputation', value: 0 },
        ],
      },
      {
        id: 'ch1_ram',
        text: 'Prendre le DODGE RAM',
        tag: 'DANGEREUX',
        nextChapter: 'ch2',
        effects: [
          { type: 'heat', value: 10 },
          { type: 'reputation', value: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // CHAPITRE 2 — 23H30
  // ==========================================
  ch2: {
    id: 'ch2',
    number: 2,
    title: '23H30',
    subtitle: 'Le point de rencontre — Parking désaffecté',
    image: 'meeting',
    atmosphere: 'tension',
    text: [
      'Le parking désaffecté est éclairé par un seul lampadaire clignotant. L\'asphalte est craquelé, les lignes blanches effacées par des années d\'abandon.',
      'Plusieurs voitures sont déjà là. Des silhouettes fument sous la lumière jaune. Des moteurs tournent au ralenti, un bourdonnement grave qui fait vibrer l\'air.',
      'Clark gare sa voiture à l\'écart. Il observe. Il connaît certains visages. D\'autres sont nouveaux.',
      'Un type s\'approche. Grande veste en cuir, sourire trop large. Rocco.',
      '"Clark. Tu es venu. Je pensais que tu allais encore faire ton mystérieux."',
      'Rocco tape sur le capot de la voiture de Clark. Ses yeux brillent dans la pénombre.',
      '"Ce soir, c\'est différent. Il y a de l\'argent. Gros. Et des gens qui veulent te voir conduire."',
    ],
    dialogue: [
      { speaker: 'ROCCO', text: '"Tu sais conduire, Clark. Mais est-ce que tu sais gagner ?"', color: '#e94560' },
      { speaker: 'CLARK', text: '"Je sais faire les deux. C\'est toi qui devrais t\'inquiéter."', color: '#f8f8f2' },
    ],
    choices: [
      {
        id: 'ch2_confident',
        text: '"Je suis prêt. Montre-moi le parcours."',
        tag: 'RISQUÉ',
        nextChapter: 'ch3',
        effects: [
          { type: 'reputation', value: 10 },
          { type: 'trust_rocco', value: 5 },
        ],
      },
      {
        id: 'ch2_cautious',
        text: '"Qui sont ces gens ? Pourquoi ils veulent me voir ?"',
        tag: 'INTELLIGENT',
        nextChapter: 'ch3',
        effects: [
          { type: 'secrets', value: 1 },
          { type: 'trust_rocco', value: -5 },
        ],
      },
      {
        id: 'ch2_aggressive',
        text: '"Je ne suis pas un animal de cirque, Rocco."',
        tag: 'DANGEREUX',
        nextChapter: 'ch3',
        effects: [
          { type: 'heat', value: 10 },
          { type: 'trust_rocco', value: -10 },
        ],
      },
    ],
  },

  // ==========================================
  // CHAPITRE 3 — LE DÉPART
  // ==========================================
  ch3: {
    id: 'ch3',
    number: 3,
    title: 'LE DÉPART',
    subtitle: 'Première course — Centre-ville',
    image: 'race_start',
    atmosphere: 'tension',
    text: [
      'Le parcours est simple en apparence. Trois kilomètres à travers le centre-ville. Le premier qui atteint le pont de l\'autoroute gagne.',
      'Mais Clark connait la ville. Il sait que "simple" n\'existe pas dans une course nocturne.',
      'Les voitures s\'alignent. Moteurs qui rugissent. Pneus qui crissent sur l\'asphalte mouillé.',
      'Un drapeau. Un cri. Et c\'est parti.',
      'La nuit défile à toute vitesse. Les néons deviennent des lignes de lumière. Le moteur hurle. Le cœur de Clark bat à toute allure.',
      'Derrière, Rocco est là. Très près. Son moteur V8 gronde comme une bête enragée.',
      'Mais devant, un problème. Un feu. Rouge. Et des voitures qui traversent.',
    ],
    choices: [
      {
        id: 'ch3_speed',
        text: 'Accélérer et passer au rouge',
        tag: 'RISQUÉ',
        nextChapter: 'ch4',
        effects: [
          { type: 'heat', value: 15 },
          { type: 'reputation', value: 15 },
          { type: 'damage', value: 5 },
        ],
        condition: { type: 'vehicle', value: 'porsche' },
      },
      {
        id: 'ch3_slow',
        text: 'Ralentir et attendre le vert',
        tag: 'INTELLIGENT',
        nextChapter: 'ch4',
        effects: [
          { type: 'heat', value: 0 },
          { type: 'reputation', value: -5 },
        ],
      },
      {
        id: 'ch3_detour',
        text: 'Prendre une rue parallèle',
        tag: 'DISCRET',
        nextChapter: 'ch4',
        effects: [
          { type: 'heat', value: -5 },
          { type: 'reputation', value: 5 },
        ],
        condition: { type: 'vehicle', value: 'corolla' },
      },
      {
        id: 'ch3_rampage',
        text: 'Foncer à travers le carrefour',
        tag: 'FORCE BRUTE',
        nextChapter: 'ch4',
        effects: [
          { type: 'heat', value: 20 },
          { type: 'damage', value: 15 },
          { type: 'reputation', value: 20 },
        ],
        condition: { type: 'vehicle', value: 'ram' },
      },
    ],
  },

  // ==========================================
  // CHAPITRE 4 — LA FUITE
  // ==========================================
  ch4: {
    id: 'ch4',
    number: 4,
    title: 'LA FUITE',
    subtitle: 'Sirènes au loin — 00h07',
    image: 'police',
    atmosphere: 'danger',
    text: [
      'La course est terminée. Clark a gagné. Ou perdu. Difficile à dire dans la nuit.',
      'Mais les sirènes, elles, ne mentent pas. Elles se rapprochent.',
      'Des gyrophares bleus et rouges balayent les rues. La police. Plusieurs voitures.',
      'Les autres pilotes se dispersent comme des ombres. Certains connaissent des raccourcis. D\'autres n\'ont pas cette chance.',
      'Clark est encore dans le centre-ville. Entouré. Les sirènes viennent de deux directions.',
      'Son téléphone vibre. Un message du Veilleur.',
    ],
    dialogue: [
      { speaker: 'TÉLÉPHONE', text: '"Rue des Forges. Deuxième à gauche. Vite."', color: '#7b68ee' },
    ],
    choices: [
      {
        id: 'ch4_follow',
        text: 'Suivre le conseil du Veilleur',
        tag: 'INTELLIGENT',
        nextChapter: 'ch4_siege',
        effects: [
          { type: 'secrets', value: 1 },
          { type: 'heat', value: -10 },
        ],
      },
      {
        id: 'ch4_highway',
        text: 'Foncer vers l\'autoroute',
        tag: 'RISQUÉ',
        nextChapter: 'ch4_siege',
        effects: [
          { type: 'heat', value: 10 },
          { type: 'damage', value: 10 },
        ],
        condition: { type: 'vehicle', value: 'porsche' },
      },
      {
        id: 'ch4_hide',
        text: 'Se garer et attendre que ça passe',
        tag: 'DISCRET',
        nextChapter: 'ch4_siege',
        effects: [
          { type: 'heat', value: -15 },
          { type: 'fuel', value: -5 },
        ],
        condition: { type: 'vehicle', value: 'corolla' },
      },
      {
        id: 'ch4_offroad',
        text: 'Sortir de la route et traverser un terrain vague',
        tag: 'FORCE BRUTE',
        nextChapter: 'ch4_siege',
        effects: [
          { type: 'heat', value: 5 },
          { type: 'damage', value: 20 },
        ],
        condition: { type: 'vehicle', value: 'ram' },
      },
    ],
  },

  // ==========================================
  // CHAPITRE 4b — LE BARRAGE (mini-jeu de tir)
  // ==========================================
  ch4_siege: {
    id: 'ch4_siege',
    number: 4,
    title: 'LE BARRAGE',
    subtitle: 'Rue des Forges — 00h12',
    image: 'police',
    atmosphere: 'danger',
    text: [
      'Au bout de la rue des Forges, Clark pile.',
      'Trois voitures de police lui barrent la route. Les portières claquent. Quatre agents débarquent et l\'invitent à se garer.',
      '"MONSIEUR, COUPEZ LE MOTEUR."',
      'Un instant d\'hésitation. Puis la panique. Clark tend la main sous son siège et saisit son pistolet à eau, son arme de fortune pour tenir les agents à distance.',
      'C\'est l\'affrontement. Clique sur les gyrophares qui avancent, et tiens bon !',
    ],
    minigame: 'shooting',
    winChapter: 'ch5',
    loseChapter: 'ending_caught',
    choices: [],
  },

  // ==========================================
  // CHAPITRE 5 — L'OMBRE
  // ==========================================
  ch5: {
    id: 'ch5',
    number: 5,
    title: 'L\'OMBRE',
    subtitle: '00h34 — Les rues calmes',
    image: 'night_streets',
    atmosphere: 'paranoia',
    text: [
      'Les sirènes se sont éloignées. La ville reprend son souffle.',
      'Clark roule lentement. Les rues sont vides. Trop vides. Même les sans-abri ont disparu.',
      'Son téléphone sonne. Maya.',
      '"Clark... Où tu es ? J\'ai vu des gyrophares partout. C\'est toi ?"',
      'Maya. Toujours à s\'inquiéter. Toujours à savoir.',
      'Clark hésite. Il peut lui dire la vérité. Ou mentir. Mais Maya n\'est pas dupe.',
      'Au loin, une silhouette. Immobile. Sous un réverbère. Quelqu\'un qui observe.',
    ],
    dialogue: [
      { speaker: 'MAYA', text: '"Ne me mens pas, Clark. Je connais ce regard. Tu as encore fait une connerie."', color: '#4ecdc4' },
      { speaker: 'CLARK', text: '"Je... C\'est compliqué, Maya. Je t\'expliquerai."', color: '#f8f8f2' },
    ],
    choices: [
      {
        id: 'ch5_truth',
        text: 'Avouer à Maya',
        tag: 'INTELLIGENT',
        nextChapter: 'ch5b',
        effects: [
          { type: 'trust_maya', value: 15 },
          { type: 'secrets', value: 1 },
        ],
      },
      {
        id: 'ch5_lie',
        text: 'Mentir et raccrocher',
        tag: 'DISCRET',
        nextChapter: 'ch5b',
        effects: [
          { type: 'trust_maya', value: -10 },
          { type: 'heat', value: 10 },
        ],
      },
      {
        id: 'ch5_meet',
        text: 'Retrouver Maya en personne',
        tag: 'RISQUÉ',
        nextChapter: 'ch5b',
        effects: [
          { type: 'trust_maya', value: 20 },
          { type: 'heat', value: 15 },
        ],
      },
    ],
  },

  // ==========================================
  // CHAPITRE 5b — LA SILHOUETTE
  // ==========================================
  ch5b: {
    id: 'ch5b',
    number: 5,
    title: 'LA SILHOUETTE',
    subtitle: '00h58 — Sous le réverbère',
    image: 'night_streets',
    atmosphere: 'paranoia',
    text: [
      'Au coin de la rue, la silhouette bouge enfin. Elle n\'a pas de visage. Juste un sourire qu\'on devine.',
      '"Tu es doué, Clark. Mais moins que Lui."',
      'Une ombre s\'éloigne entre deux entrepôts. Une deuxième, au coin opposé. Clark est entouré.',
      'Son téléphone vibre. Un message crypté : "ROUTE 9. OUBLIE TOUT LE RESTE."',
      'Clark serre les poings sur le volant. Deux options. Trois, peut-être. Mais aucune n\'est rassurante.',
    ],
    choices: [
      {
        id: 'ch5b_listen',
        text: 'Suivre le message vers la route 9',
        tag: 'INTELLIGENT',
        nextChapter: 'ch6',
        effects: [
          { type: 'secrets', value: 1 },
          { type: 'danger', value: 15 },
        ],
      },
      {
        id: 'ch5b_confront',
        text: 'Faire demi-tour et foncer sur les ombres',
        tag: 'DANGEREUX',
        nextChapter: 'ch6',
        effects: [
          { type: 'heat', value: 15 },
          { type: 'damage', value: 20 },
          { type: 'reputation', value: 10 },
        ],
      },
      {
        id: 'ch5b_vanish',
        text: 'Éteindre les phares et disparaître entre les camions',
        tag: 'DISCRET',
        nextChapter: 'ch6',
        effects: [
          { type: 'fuel', value: -10 },
          { type: 'heat', value: -10 },
        ],
        condition: { type: 'vehicle', value: 'corolla' },
      },
    ],
  },

  // ==========================================
  // CHAPITRE 6 — LES RUELLES
  // ==========================================
  ch6: {
    id: 'ch6',
    number: 6,
    title: 'LES RUELLES',
    subtitle: '01h12 — Quartier industriel',
    image: 'alleys',
    atmosphere: 'paranoia',
    text: [
      'Le quartier industriel est un labyrinthe de ruelles étroites, d\'entrepôts abandonnés et de conteneurs rouillés.',
      'Clark connaît chaque coin. Chaque raccourci. Chaque cachette.',
      'Mais ce soir, quelque chose est différent. Des lumières. Des ombres qui bougent.',
      'Un bruit de moteur. Derrière lui. Puis un autre. Deux voitures. Elles le suivent.',
      'Clark accélère. Les ruelles deviennent plus étroites. Les murs se rapprochent.',
      'Un cul-de-sac. Dead end. Mais Clark a un plan. Il connaît cet endroit mieux que personne.',
      'La pluie s\'invite. Les pneus crissent sur le goudron. Quelque part, un chien aboie, puis se tait d\'un coup, comme pris de peur.',
      'Les deux voitures fantômes s\'arrêtent derrière lui. Portières qui claquent. Deux silhouettes descendent, lentement.',
    ],
    choices: [
      {
        id: 'ch6_escape',
        text: 'Foncer par la ruelle latérale',
        tag: 'RISQUÉ',
        nextChapter: 'ch7',
        effects: [
          { type: 'heat', value: 15 },
          { type: 'damage', value: 15 },
        ],
        condition: { type: 'vehicle', value: 'porsche' },
      },
      {
        id: 'ch6_hide',
        text: 'Se cacher dans un parking souterrain',
        tag: 'DISCRET',
        nextChapter: 'ch7',
        effects: [
          { type: 'heat', value: -10 },
          { type: 'fuel', value: -5 },
        ],
        condition: { type: 'vehicle', value: 'corolla' },
      },
      {
        id: 'ch6_smash',
        text: 'Défoncer la barrière et traverser le chantier',
        tag: 'FORCE BRUTE',
        nextChapter: 'ch7',
        effects: [
          { type: 'heat', value: 15 },
          { type: 'damage', value: 35 },
        ],
        condition: { type: 'vehicle', value: 'ram' },
      },
      {
        id: 'ch6_confront',
        text: 'S\'arrêter et faire face',
        tag: 'DANGEREUX',
        nextChapter: 'ch7',
        effects: [
          { type: 'heat', value: 20 },
          { type: 'reputation', value: 10 },
        ],
      },
    ],
  },

  // ==========================================
  // CHAPITRE 7 — LE MÉCANICIEN
  // ==========================================
  ch7: {
    id: 'ch7',
    number: 7,
    title: 'LE MÉCANICIEN',
    subtitle: '02h03 — Garage d\'Elias',
    image: 'mechanic',
    atmosphere: 'calm',
    text: [
      'Le garage d\'Elias est une vieille bâtisse au bout de la rue. Enseigne cassée, porte grinçante, mais à l\'intérieur, c\'est un temple.',
      'Elias est là. Comme toujours. Un chiffon à la main, des yeux fatigués mais vifs.',
      '"Encore des ennuis, Clark ?"',
      'Elias connaît Clark depuis le début. Il a réparé chaque voiture. Il a vu chaque éraflure. Il sait des choses.',
      'Ce soir, il semble différent. Plus sérieux. Plus inquiet.',
      '"Il y a quelque chose que tu devrais savoir. Sur ces courses. Sur les gens qui organisent tout ça."',
    ],
    dialogue: [
      { speaker: 'ELIAS', text: '"Ce ne sont pas juste des courses, Clark. C\'est plus gros. Beaucoup plus gros."', color: '#ff6b35' },
      { speaker: 'CLARK', text: '"Qu\'est-ce que tu veux dire, Elias ?"', color: '#f8f8f2' },
    ],
    choices: [
      {
        id: 'ch7_listen',
        text: 'Écouter ce qu\'Elias a à dire',
        tag: 'INTELLIGENT',
        nextChapter: 'ch8',
        effects: [
          { type: 'secrets', value: 2 },
          { type: 'trust_elias', value: 15 },
        ],
      },
      {
        id: 'ch7_dismiss',
        text: '"Je n\'ai pas le temps pour tes théories, Elias."',
        tag: 'DANGEREUX',
        nextChapter: 'ch8',
        effects: [
          { type: 'trust_elias', value: -15 },
          { type: 'heat', value: 5 },
        ],
      },
      {
        id: 'ch7_repair',
        text: 'Demander une réparation complète',
        tag: 'INTELLIGENT',
        nextChapter: 'ch8',
        effects: [
          { type: 'damage', value: -30 },
          { type: 'money', value: -500 },
          { type: 'trust_elias', value: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // CHAPITRE 8 — LE VEILLEUR
  // ==========================================
  ch8: {
    id: 'ch8',
    number: 8,
    title: 'LE VEILLEUR',
    subtitle: '02h47 — Messages',
    image: 'phone',
    atmosphere: 'paranoia',
    text: [
      'Assis dans sa voiture, Clark regarde son téléphone. Les messages s\'enchaînent.',
      'Le Veilleur. Toujours le même numéro. Toujours les mêmes messages cryptiques.',
      '"Tu as fait le bon choix. Mais ce n\'est pas fini."',
      '"Ils savent. Ils savent tout. Depuis le début."',
      '"Demande à Elias. Il était là cette nuit-là."',
      'Cette nuit-là. Clark ne sait pas de quelle nuit il parle. Mais quelque chose dans son estomac se noue.',
      'Son téléphone vibre une dernière fois.',
      '"Le rendez-vous de demain. Ne viens pas. C\'est un piège."',
    ],
    dialogue: [
      { speaker: 'TÉLÉPHONE', text: '"Tu veux la vérité ? Viens seul. 04h00. Ancienne usine."', color: '#7b68ee' },
    ],
    choices: [
      {
        id: 'ch8_go',
        text: 'Aller au rendez-vous',
        tag: 'RISQUÉ',
        nextChapter: 'ch9',
        effects: [
          { type: 'secrets', value: 1 },
          { type: 'danger', value: 20 },
        ],
      },
      {
        id: 'ch8_ignore',
        text: 'Ignorer et rentrer chez lui',
        tag: 'DISCRET',
        nextChapter: 'ch9',
        effects: [
          { type: 'heat', value: -10 },
          { type: 'trust_maya', value: 5 },
        ],
      },
      {
        id: 'ch8_investigate',
        text: 'Enquêter d\'abord sur "cette nuit-là"',
        tag: 'INTELLIGENT',
        nextChapter: 'ch9',
        effects: [
          { type: 'secrets', value: 2 },
          { type: 'trust_elias', value: 10 },
        ],
      },
    ],
  },

  // ==========================================
  // CHAPITRE 9 — TRAHI
  // ==========================================
  ch9: {
    id: 'ch9',
    number: 9,
    title: 'TRAHI',
    subtitle: '03h15 — Le rendez-vous',
    image: 'betrayal',
    atmosphere: 'danger',
    text: [
      'L\'ancienne usine est un squelette de béton et de fer. Les fenêtres sont des yeux vides. L\'intérieur est plongé dans l\'obscurité.',
      'Clark entre seul. Comme demandé. Mais il n\'est pas seul.',
      'Des bruits. Des pas. Plusieurs personnes.',
      'Une lumière s\'allume. Et là, au milieu, Rocco.',
      'Mais ce n\'est pas le Rocco qu\'il connaît. Son sourire a disparu. Ses yeux sont froids.',
      '"Désolé, Clark. Vraiment. Mais ils paient trop bien."',
      'Derrière Rocco, des hommes en noir. Et au fond, un bureau. Quelqu\'un est assis là. Dans l\'ombre.',
    ],
    dialogue: [
      { speaker: 'ROCCO', text: '"Tu ne comprends pas. Ce n\'est pas personnel. C\'est les affaires."', color: '#e94560' },
      { speaker: 'CLARK', text: '"Tu m\'as trahi, Rocco. Pour de l\'argent ?"', color: '#f8f8f2' },
    ],
    choices: [
      {
        id: 'ch9_fight',
        text: 'Se battre',
        tag: 'DANGEREUX',
        nextChapter: 'ch10',
        effects: [
          { type: 'heat', value: 25 },
          { type: 'damage', value: 20 },
          { type: 'reputation', value: 15 },
        ],
      },
      {
        id: 'ch9_talk',
        text: 'Parler à la personne dans l\'ombre',
        tag: 'INTELLIGENT',
        nextChapter: 'ch10',
        effects: [
          { type: 'secrets', value: 2 },
          { type: 'trust_rocco', value: -20 },
        ],
      },
      {
        id: 'ch9_run',
        text: 'Fuir',
        tag: 'RISQUÉ',
        nextChapter: 'ch10',
        effects: [
          { type: 'heat', value: 15 },
          { type: 'damage', value: 10 },
        ],
      },
    ],
  },

  // ==========================================
  // CHAPITRE 10 — FANTÔMES
  // ==========================================
  ch10: {
    id: 'ch10',
    number: 10,
    title: 'FANTÔMES',
    subtitle: '03h52 — La vérité',
    image: 'truth',
    atmosphere: 'revelation',
    text: [
      'La personne dans l\'ombre se lève. Un homme. Des cheveux gris. Des yeux qui connaissent trop de choses.',
      '"Je t\'attendais, Clark. Depuis longtemps."',
      'Il s\'appelle Victor. Et il connaissait le père de Clark.',
      'Il y a dix ans, le père de Clark était impliqué dans les mêmes courses. Les mêmes gens. La même nuit.',
      'Il a disparu. Jamais retrouvé. Officiellement, un accident. Officieusement, autre chose.',
      '"Ton père a découvert quelque chose. Quelque chose que ces gens voulaient garder secret. Et il a payé le prix."',
      'Victor regarde Clark. Ses yeux sont tristes.',
      '"Et maintenant, ils veulent toi. Parce que tu es son fils. Et parce que tu as son talent."',
    ],
    dialogue: [
      { speaker: 'VICTOR', text: '"Les courses ne sont pas des courses. C\'est un réseau. Un système. Et ton père voulait le détruire."', color: '#7b68ee' },
      { speaker: 'CLARK', text: '"Et toi ? Tu es qui dans tout ça ?"', color: '#f8f8f2' },
      { speaker: 'VICTOR', text: '"Je suis celui qui a essayé de le sauver. Et qui a échoué."', color: '#7b68ee' },
    ],
    choices: [
      {
        id: 'ch10_revenge',
        text: '"Je vais les détruire. Comme mon père voulait le faire."',
        tag: 'DANGEREUX',
        nextChapter: 'ch11',
        effects: [
          { type: 'heat', value: 20 },
          { type: 'reputation', value: 20 },
          { type: 'danger', value: 15 },
        ],
      },
      {
        id: 'ch10_escape',
        text: '"Je veux juste m\'en sortir. Laisse-moi partir."',
        tag: 'DISCRET',
        nextChapter: 'ch11',
        effects: [
          { type: 'heat', value: -10 },
          { type: 'trust_maya', value: 10 },
        ],
      },
      {
        id: 'ch10_plan',
        text: '"Aide-moi à les arrêter. Mais à ma façon."',
        tag: 'INTELLIGENT',
        nextChapter: 'ch11',
        effects: [
          { type: 'secrets', value: 2 },
          { type: 'trust_elias', value: 10 },
        ],
      },
    ],
  },

  // ==========================================
  // CHAPITRE 11 — LA CONFRONTATION
  // ==========================================
  ch11: {
    id: 'ch11',
    number: 11,
    title: 'LA CONFRONTATION',
    subtitle: '04h30 — L\'aube approche',
    image: 'confrontation',
    atmosphere: 'revelation',
    text: [
      'L\'aube approche. Le ciel passe du noir au gris. La ville s\'éveille doucement.',
      'Clark est retourné au garage. Elias l\'attendait. Maya aussi. Et même Rocco, blessé, honteux.',
      'Tous sont là. Tous attendent que Clark décide.',
      'Le téléphone vibre une dernière fois. Le Veilleur.',
      '"C\'est le moment, Clark. Le moment de choisir qui tu veux être."',
      'Dehors, des bruits de moteurs. Plusieurs voitures. Ils arrivent.',
      'La décision finale appartient à Clark.',
    ],
    dialogue: [
      { speaker: 'MAYA', text: '"Quoi qu\'arrive, je suis avec toi, Clark."', color: '#4ecdc4' },
      { speaker: 'ELIAS', text: '"Ton père serait fier de toi. Quoi que tu choisisses."', color: '#ff6b35' },
      { speaker: 'ROCCO', text: '"Je... Je suis désolé. Laisse-moi t\'aider. Une dernière fois."', color: '#e94560' },
    ],
    choices: [
      {
        id: 'ch11_fight',
        text: 'Affronter les hommes de Victor',
        tag: 'DANGEREUX',
        nextChapter: 'ch12_fight',
        effects: [
          { type: 'heat', value: 30 },
          { type: 'damage', value: 25 },
          { type: 'reputation', value: 25 },
        ],
      },
      {
        id: 'ch11_escape',
        text: 'Fuir avec ceux qui comptent',
        tag: 'DISCRET',
        nextChapter: 'ch12_escape',
        effects: [
          { type: 'heat', value: -20 },
          { type: 'trust_maya', value: 15 },
          { type: 'trust_elias', value: 10 },
        ],
      },
      {
        id: 'ch11_truth',
        text: 'Révéler la vérité au grand jour',
        tag: 'INTELLIGENT',
        nextChapter: 'ch12_truth',
        effects: [
          { type: 'secrets', value: 3 },
          { type: 'reputation', value: 30 },
        ],
        condition: { type: 'secrets_min', value: 5 },
      },
    ],
  },

  // ==========================================
  // CHAPITRE 12 — L'AUBE (branches)
  // ==========================================
  ch12_fight: {
    id: 'ch12_fight',
    number: 12,
    title: 'L\'AUBE — LE COMBAT',
    subtitle: '05h12 — Le garage',
    image: 'dawn_fight',
    atmosphere: 'dawn',
    text: [
      'Le soleil se lève. La bataille est terminée.',
      'Clark est debout. Blessé, épuisé, mais debout.',
      'Les hommes de Victor sont partis. La vérité est révélée. Le réseau est détruit.',
      'Mais le prix est lourd. La voiture est détruite. Et Clark devra répondre de ses actes.',
      'Pourtant, pour la première fois depuis longtemps, il se sent libre.',
      'Maya est là. Elias est là. Même Rocco.',
      'La ville s\'éveille. Une nouvelle journée commence.',
    ],
    choices: [
      {
        id: 'ch12_fight_end',
        text: 'Accepter les conséquences',
        nextChapter: 'ending_legend',
      },
    ],
  },

  ch12_escape: {
    id: 'ch12_escape',
    number: 12,
    title: 'L\'AUBE — LA FUITE',
    subtitle: '05h12 — Route de campagne',
    image: 'dawn_escape',
    atmosphere: 'dawn',
    text: [
      'Le soleil se lève sur la route de campagne.',
      'Clark conduit. Maya est à ses côtés. Elias et Rocco suivent dans une autre voiture.',
      'Derrière eux, la ville s\'éloigne. Les problèmes aussi.',
      'Ils ne sont pas riches. Ils ne sont pas célèbres. Mais ils sont libres.',
      'Clark regarde dans le rétroviseur. La ville disparaît.',
      '"On fait quoi maintenant ?" demande Maya.',
      'Clark sourit. "On vit. Simplement."',
    ],
    choices: [
      {
        id: 'ch12_escape_end',
        text: 'Continuer la route',
        nextChapter: 'ending_freedom',
      },
    ],
  },

  ch12_truth: {
    id: 'ch12_truth',
    number: 12,
    title: 'L\'AUBE — LA VÉRITÉ',
    subtitle: '05h12 — Les médias',
    image: 'dawn_truth',
    atmosphere: 'dawn',
    text: [
      'Le soleil se lève. Et avec lui, la vérité.',
      'Clark a tout révélé. Les courses. Le réseau. La disparition de son père.',
      'Les médias sont là. Les policiers aussi. Mais cette fois, c\'est différent.',
      'Clark n\'est pas un criminel. C\'est un lanceur d\'alerte.',
      'Victor est arrêté. Le réseau est démantelé.',
      'Elias témoigne. Maya filme. Rocco aussi.',
      'La vérité est en marche. Et rien ne peut l\'arrêter.',
    ],
    choices: [
      {
        id: 'ch12_truth_end',
        text: 'Regarder le soleil se lever',
        nextChapter: 'ending_truth',
      },
    ],
  },

  // ==========================================
  // FINS
  // ==========================================
  ending_legend: {
    id: 'ending_legend',
    number: 13,
    title: 'FIN — LA LÉGENDE',
    subtitle: '06h00 — Après la tempête',
    image: 'ending_legend',
    isEnding: true,
    endingNumber: 1,
    endingTitle: 'LA LÉGENDE',
    endingDescription: 'Clark a affronté ses démons et en est sorti victorieux. La ville murmure son nom. Il est devenu une légende.',
    atmosphere: 'dawn',
    text: [
      'On raconte encore l\'histoire de Clark.',
      'Le garage qui a défié la nuit. Le pilote qui a battu le système.',
      'Certains disent qu\'il est parti. D\'autres qu\'il est toujours là, quelque part, dans l\'ombre.',
      'Mais une chose est sûre : il a laissé une trace.',
      'Et cette trace ne s\'effacera jamais.',
    ],
    choices: [],
  },

  ending_freedom: {
    id: 'ending_freedom',
    number: 13,
    title: 'FIN — LA LIBERTÉ',
    subtitle: '06h00 — Route infinie',
    image: 'ending_freedom',
    isEnding: true,
    endingNumber: 2,
    endingTitle: 'LA LIBERTÉ',
    endingDescription: 'Clark a choisi ceux qu\'il aime plutôt que la gloire. La route est longue, mais elle est à eux.',
    atmosphere: 'dawn',
    text: [
      'La route devant eux est longue.',
      'Pas de destination. Pas de plan. Juste la route.',
      'Maya pose sa tête sur l\'épaule de Clark. Elias et Rocco suivent derrière.',
      'Ils ne sont pas riches. Ils ne sont pas célèbres.',
      'Mais ils sont libres. Et c\'est tout ce qui compte.',
      'Le soleil se lève. La nuit est terminée.',
      'Et une nouvelle vie commence.',
    ],
    choices: [],
  },

  ending_truth: {
    id: 'ending_truth',
    number: 13,
    title: 'FIN — LA VÉRITÉ',
    subtitle: '06h00 — Justice',
    image: 'ending_truth',
    isEnding: true,
    endingNumber: 3,
    endingTitle: 'LA VÉRITÉ',
    endingDescription: 'Clark a révélé la vérité et changé le système. Son père peut enfin reposer en paix.',
    atmosphere: 'dawn',
    text: [
      'La vérité a un prix. Mais elle a aussi une récompense.',
      'Victor est derrière les barreaux. Le réseau est démantelé.',
      'Le nom du père de Clark est réhabilité.',
      'Elias a enfin pu parler. Maya a filmé. Rocco a témoigné.',
      'Clark regarde le soleil se lever.',
      'Il a perdu sa voiture. Il a perdu son innocence.',
      'Mais il a gagné quelque chose de plus précieux : la vérité.',
      'Et la paix.',
    ],
    choices: [],
  },

  ending_caught: {
    id: 'ending_caught',
    number: 13,
    title: 'FIN — LA CHUTE',
    subtitle: '06h00 — Les menottes',
    image: 'ending_caught',
    isEnding: true,
    endingNumber: 4,
    endingTitle: 'LA CHUTE',
    endingDescription: 'Clark a été arrêté. La nuit a eu raison de lui. Mais il y a toujours une prochaine fois.',
    atmosphere: 'dawn',
    text: [
      'Les gyrophares bleus et rouges illuminent la nuit.',
      'Clark est à genoux. Les mains sur la tête.',
      'Les menottes sont froides. La réalité aussi.',
      'Il a perdu. La nuit a gagné.',
      'Mais dans ses yeux, quelque chose brille encore.',
      'La détermination. La promesse d\'une prochaine fois.',
      'Parce que Clark n\'abandonne jamais.',
      'Jamais.',
    ],
    choices: [],
  },

  ending_veilleur: {
    id: 'ending_veilleur',
    number: 13,
    title: 'FIN — LE VEILLEUR',
    subtitle: '06h00 — L\'ombre',
    image: 'ending_veilleur',
    isEnding: true,
    endingNumber: 5,
    endingTitle: 'LE VEILLEUR',
    endingDescription: 'Clark a découvert l\'identité du Veilleur. Et il a choisi de prendre sa place.',
    atmosphere: 'dawn',
    text: [
      'Le Veilleur n\'est pas un mystère. C\'est une personne.',
      'Une personne qui connaît Clark depuis toujours.',
      'Une personne qui l\'a protégé, guidé, observé.',
      'Et maintenant, c\'est à Clark de prendre la relève.',
      'De devenir le nouveau Veilleur.',
      'De veiller sur les autres.',
      'La nuit ne s\'arrête jamais. Elle change juste de gardien.',
    ],
    choices: [],
  },

  ending_secret: {
    id: 'ending_secret',
    number: 13,
    title: 'FIN — LE SECRET',
    subtitle: '06h00 — La révélation',
    image: 'ending_secret',
    isEnding: true,
    endingNumber: 6,
    endingTitle: 'LE SECRET',
    endingDescription: 'Clark a découvert le secret le plus sombre. Et il a choisi de le garder.',
    atmosphere: 'dawn',
    text: [
      'Il y a des vérités qui sont trop lourdes à porter.',
      'Clark l\'a découverte. La vérité sur son père. Sur sa mort. Sur tout.',
      'Et il a choisi de la garder.',
      'Parce que certaines vérités ne doivent pas voir le jour.',
      'Parce que certaines histoires doivent rester dans l\'ombre.',
      'Clark regarde le soleil se lever.',
      'Il sourit. Un sourire triste. Un sourire libre.',
      'Il connaît le secret. Et le secret le rend libre.',
    ],
    choices: [],
  },
}

export const chapterList = Object.values(chapters)
export const startChapter = 'ch1'
