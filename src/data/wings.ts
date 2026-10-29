import type { MuseumWing } from '../types/exhibit';

export const MUSEUM_WINGS: MuseumWing[] = [
  {
    id: 'atrium',
    name: 'The Central Atrium',
    tagline: 'Featured Masterpieces & Welcome Grounds',
    description: 'The monumental core of the Internet Museum showcasing landmark sites, curator spotlights, and today’s chosen wonders.',
    accentColor: '#38bdf8',
    icon: '🏛️',
  },
  {
    id: 'generative',
    name: 'Hall of Generative Wonders',
    tagline: 'Code as Canvas & Algorithmic Reverie',
    description: 'Interactive canvas experiments, procedural audiovisual pieces, and algorithmic worlds painted live inside the browser.',
    accentColor: '#a855f7',
    icon: '✨',
  },
  {
    id: 'retro-web',
    name: 'Archive of Forgotten Protocols',
    tagline: 'Early Web Nostalgia & Living Time Capsules',
    description: 'Handcrafted HTML personal sites, GeoCities homages, blinking marquee aesthetics, and digital artifacts preserved in time.',
    accentColor: '#f59e0b',
    icon: '💾',
  },
  {
    id: 'curiosities',
    name: 'The Cabinet of Curiosities',
    tagline: 'Hyper-Niche Toys & Absurdist Web Oddities',
    description: 'Single-serving websites, surrealist thought experiments, and idiosyncratic corners created for pure joy or sheer bewilderment.',
    accentColor: '#ec4899',
    icon: '🔮',
  },
  {
    id: 'interactive-fiction',
    name: 'Playground of Fiction & Play',
    tagline: 'Text Adventures, Puzzles & Collaborative Canvases',
    description: 'Browser games, point-and-click wonders, interactive narratives, and micro-worlds inviting playful exploration.',
    accentColor: '#10b981',
    icon: '🎮',
  },
];
