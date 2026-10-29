import type { MuseumTrail } from '../types/trail';

export const PRESET_TRAILS: MuseumTrail[] = [
  {
    id: 'trail-retro-capsule',
    title: 'The Digital Time Capsule Tour',
    description: 'A nostalgic pilgrimage through raw 90s HTML tables, GeoCities GIF tapestries, and vintage operating systems.',
    curatorName: 'Chief Curator of Cyber-Archaeology',
    exhibitIds: [
      'internet-archive',
      'space-jam-1996',
      'million-dollar-homepage',
      'camerons-world',
      'windows-93',
    ],
    estimatedMinutes: 20,
    tags: ['retro', 'nostalgia', 'preservation', 'history'],
    isStaffPick: true,
  },
  {
    id: 'trail-generative-reverie',
    title: 'Algorithmic & Generative Reveries',
    description: 'Immerse your senses in procedural mathematics, real-time WebGL fragment shaders, and reactive sound synthesis.',
    curatorName: 'Fellow of Algorithmic Arts',
    exhibitIds: [
      'weave-silk',
      'shadertoy',
      'patatap',
      'cellular-automata-music',
      'stars-chrome-experiment',
    ],
    estimatedMinutes: 25,
    tags: ['generative', 'math', 'shaders', 'audio'],
    isStaffPick: true,
  },
  {
    id: 'trail-absurdist-curiosities',
    title: 'The Cabinet of Existential Oddities',
    description: 'Explore the wonderfully strange corners of the independent web, from solar servers to cosmic paperclip empires.',
    curatorName: 'Curator of Web Peculiarities',
    exhibitIds: [
      'the-useless-web',
      'solar-protocol',
      'falling-fruit',
      'universal-paperclips',
      'neal-fun',
    ],
    estimatedMinutes: 20,
    tags: ['curiosities', 'weird-web', 'existential', 'creative'],
    isStaffPick: true,
  },
];
