import { Character } from '../types'
import mayaImg from '../assets/maya.jpeg'
import roccoImg from '../assets/rocco.jpeg'
import eliasImg from '../assets/elias.jpeg'
import veilleurImg from '../assets/veilleur.jpeg'
import clarkImg from '../assets/clark.jpeg'

export const characters: Record<string, Character> = {
  maya: {
    id: 'maya',
    name: 'MAYA',
    role: 'Amie proche',
    description: 'Très intelligente, elle connaît la ville mieux que Clark. Elle commence progressivement à comprendre que Clark cache quelque chose.',
    personality: ['Intuitive', 'Loyale', 'Perspicace', 'Inquiète'],
    avatar: mayaImg,
    color: '#4ecdc4',
  },
  rocco: {
    id: 'rocco',
    name: 'ROCCO',
    role: 'Pilote rival',
    description: 'Charismatique et provocateur, il connaît Clark depuis longtemps. Il pourrait être allié ou adversaire selon les choix.',
    personality: ['Charismatique', 'Provocateur', 'Ambitieux', 'Imprévisible'],
    avatar: roccoImg,
    color: '#e94560',
  },
  elias: {
    id: 'elias',
    name: 'ELIAS',
    role: 'Mécanicien',
    description: 'Il entretient les véhicules. Il semble loyal mais possède ses propres secrets.',
    personality: ['Silencieux', 'Compétent', 'Mystérieux', 'Protecteur'],
    avatar: eliasImg,
    color: '#ff6b35',
  },
  veilleur: {
    id: 'veilleur',
    name: 'LE VEILLEUR',
    role: 'Mystère',
    description: 'Il semble connaître les déplacements de Clark avant même que Clark les fasse. Personne ne sait réellement qui il est. Il communique uniquement par messages.',
    personality: ['Omniscient', 'Cryptique', 'Bienveillant?', 'Insaisissable'],
    avatar: veilleurImg,
    color: '#7b68ee',
  },
  clark: {
    id: 'clark',
    name: 'CLARK',
    role: 'Protagoniste',
    description: 'Jeune passionné d\'adrénaline, de voitures et de sensations fortes. Son obsession : sortir de nuit et participer à des courses clandestines.',
    personality: ['Audacieux', 'Passionné', 'Impulsif', 'Déterminé'],
    avatar: clarkImg,
    color: '#f8f8f2',
  },
}

export const characterList = Object.values(characters)
