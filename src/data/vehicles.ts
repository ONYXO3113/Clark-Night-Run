import { Vehicle } from '../types'
import porscheImg from '../assets/porsche.jpeg'
import corollaImg from '../assets/corolla.jpeg'
import ramImg from '../assets/ram.jpeg'

export const vehicles: Record<string, Vehicle> = {
  porsche: {
    id: 'porsche',
    name: 'PORSCHE 911 TURBO S',
    tagline: 'La voiture du risque maximal',
    description: 'Une voiture extrêmement puissante, rapide, spectaculaire et immédiatement reconnaissable. Chaque phare est une déclaration. Chaque accélération est un défi lancé à la nuit.',
    stats: {
      vitesse: 10,
      acceleration: 10,
      discretion: 2,
      fiabilite: 5,
      toutTerrain: 3,
      maniabilite: 8,
    },
    specialAbility: 'VITESSE PURE',
    specialDescription: 'Sur les lignes droites et les autoroutes, rien ne peut la rattraper. Mais sa silhouette est gravée dans la mémoire de chaque policier de la ville.',
    color: '#1a1a2e',
    colorSecondary: '#e94560',
    image: porscheImg,
  },
  corolla: {
    id: 'corolla',
    name: 'TOYOTA COROLLA GRISE',
    tagline: 'L\'ombre parmi les ombres',
    description: 'Une voiture qui paraît complètement banale. Pas impressionnante, pas rapide. Mais c\'est justement ce qui la rend intéressante. Elle disparaît dans la nuit comme une goutte d\'eau dans l\'océan.',
    stats: {
      vitesse: 4,
      acceleration: 4,
      discretion: 10,
      fiabilite: 10,
      toutTerrain: 5,
      maniabilite: 7,
    },
    specialAbility: 'DISCRÉTION TOTALE',
    specialDescription: 'Dans certaines scènes, Clark peut se garer dans une rue ou rejoindre un parking. La police peut passer à proximité sans même identifier le véhicule.',
    color: '#2d2d2d',
    colorSecondary: '#8b8b8b',
    image: corollaImg,
  },
  ram: {
    id: 'ram',
    name: 'DODGE RAM 2500',
    tagline: 'La force brute',
    description: 'Un énorme pick-up extrêmement imposant. Il peut encaisser énormément de choses, traverser des terrains difficiles et emprunter des chemins où les voitures normales auraient énormément de difficultés.',
    stats: {
      vitesse: 4,
      acceleration: 5,
      discretion: 3,
      fiabilite: 9,
      toutTerrain: 10,
      maniabilite: 4,
    },
    specialAbility: 'FORCE BRUTE',
    specialDescription: 'Certaines situations permettent au joueur d\'utiliser la taille et la robustesse du véhicule pour franchir des obstacles narratifs autrement infranchissables.',
    color: '#0f0f0f',
    colorSecondary: '#ff6b35',
    image: ramImg,
  },
}

export const vehicleList = Object.values(vehicles)
