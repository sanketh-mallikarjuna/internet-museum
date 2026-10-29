export interface MuseumTrail {
  id: string;
  title: string;
  description: string;
  curatorName: string;
  exhibitIds: string[];
  estimatedMinutes?: number;
  tags?: string[];
  isStaffPick?: boolean;
  createdAt?: string;
}

export interface SharedTrailPayload {
  v: number; // schema version (1)
  t: string; // title
  d?: string; // description
  c?: string; // creator/curator name
  e: string[]; // exhibit ids
}
