export interface VisitorPreferences {
  soundEnabled: boolean;
  reducedMotion: boolean;
  theme: 'dark' | 'light';
}

export interface VisitorState {
  favorites: string[]; // Exhibit IDs
  visitedExhibitIds: string[]; // Exhibit IDs that visitor has opened
  lastVisitedAt?: string;
  customTrails: {
    id: string;
    title: string;
    exhibitIds: string[];
    createdAt: string;
  }[];
  preferences: VisitorPreferences;
}
