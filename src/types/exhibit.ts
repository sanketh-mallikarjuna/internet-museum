export type MuseumWingId =
  | 'atrium'
  | 'generative'
  | 'retro-web'
  | 'curiosities'
  | 'interactive-fiction';

export interface MuseumWing {
  id: MuseumWingId;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  icon: string;
  displayOrder?: number;
  exhibitCount?: number;
}

export type InteractionLevel = 'ambient' | 'interactive' | 'playable' | 'audio-visual';

export interface Exhibit {
  id: string;
  title: string;
  url: string;
  year?: number;
  author?: string;
  wingId: MuseumWingId;
  tagline: string;
  curatorNotes: string;
  tags: string[];
  interactionLevel: InteractionLevel;
  thumbnailUrl?: string;
  isCuratorPick?: boolean;
  /** Normalized constellation coordinates on a 1000x700 virtual canvas */
  coords?: {
    x: number;
    y: number;
  };
}
