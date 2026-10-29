import type { VisitorState } from '../types/visitor';
import type { MuseumTrail, SharedTrailPayload } from '../types/trail';

const STORAGE_KEY = 'internet_museum_visitor_state_v1';

const DEFAULT_STATE: VisitorState = {
  favorites: [],
  visitedExhibitIds: [],
  customTrails: [],
  preferences: {
    soundEnabled: true,
    reducedMotion: false,
    theme: 'dark',
  },
};

/** Load visitor state safely from localStorage */
export function loadVisitorState(): VisitorState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      preferences: {
        ...DEFAULT_STATE.preferences,
        ...(parsed.preferences || {}),
      },
    };
  } catch (err) {
    console.warn('Failed to load visitor state from localStorage:', err);
    return DEFAULT_STATE;
  }
}

/** Save visitor state safely to localStorage */
export function saveVisitorState(state: VisitorState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save visitor state to localStorage:', err);
  }
}

/**
 * Encode a trail into a URL-safe Base64 string for sharing without a backend.
 */
export function encodeTrailToShareUrl(trail: MuseumTrail): string {
  const payload: SharedTrailPayload = {
    v: 1,
    t: trail.title,
    d: trail.description,
    c: trail.curatorName,
    e: trail.exhibitIds,
  };
  const json = JSON.stringify(payload);
  const base64 = btoa(encodeURIComponent(json));
  const url = new URL(window.location.href);
  url.searchParams.set('trail', base64);
  return url.toString();
}

/**
 * Decode a trail from a URL search param or hash fragment.
 */
export function decodeTrailFromUrl(): MuseumTrail | null {
  if (typeof window === 'undefined') return null;
  try {
    const url = new URL(window.location.href);
    let encoded = url.searchParams.get('trail');
    
    // Check hash fallback e.g. #trail=...
    if (!encoded && window.location.hash.includes('trail=')) {
      const hashMatch = window.location.hash.match(/trail=([^&]+)/);
      if (hashMatch) encoded = hashMatch[1];
    }

    if (!encoded) return null;

    const json = decodeURIComponent(atob(encoded));
    const payload: SharedTrailPayload = JSON.parse(json);

    if (!payload || !Array.isArray(payload.e) || payload.e.length === 0) {
      return null;
    }

    return {
      id: `shared-${Date.now()}`,
      title: payload.t || 'Shared Museum Journey',
      description: payload.d || 'A custom curated trail shared by another web explorer.',
      curatorName: payload.c || 'Fellow Traveler',
      exhibitIds: payload.e,
      estimatedMinutes: Math.max(5, payload.e.length * 4),
      tags: ['community', 'shared-trail'],
      isStaffPick: false,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Could not decode shared trail from URL:', err);
    return null;
  }
}
