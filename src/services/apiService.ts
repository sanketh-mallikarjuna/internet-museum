import type { MuseumWing, Exhibit } from '../types/exhibit';
import type { MuseumTrail } from '../types/trail';
import { MUSEUM_WINGS } from '../data/wings';
import { STARTER_EXHIBITS } from '../data/exhibits';
import { PRESET_TRAILS } from '../data/presetTrails';

// Configure base backend URL from environment or default to local FastAPI
const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');
export const API_V1_URL = `${API_BASE_URL}/api/v1`;

export interface ApiHealthResponse {
  status: string;
  database: string;
  version: string;
  timestamp: string;
}

export interface MuseumDataResult {
  wings: MuseumWing[];
  exhibits: Exhibit[];
  trails: MuseumTrail[];
  isLive: boolean;
  source: 'backend' | 'local-fallback';
  error?: string;
}

/**
 * Standard fetch wrapper with timeout support to ensure responsive fallback.
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Check backend and database health.
 */
export async function checkBackendHealth(): Promise<ApiHealthResponse | null> {
  try {
    const res = await fetchWithTimeout(`${API_V1_URL}/health`, {}, 2500);
    if (!res.ok) return null;
    return (await res.json()) as ApiHealthResponse;
  } catch {
    return null;
  }
}

/**
 * Fetch all museum wings from GET /api/v1/wings.
 */
export async function getWings(): Promise<MuseumWing[]> {
  const res = await fetchWithTimeout(`${API_V1_URL}/wings`);
  if (!res.ok) {
    throw new Error(`Failed to fetch wings: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as MuseumWing[];
}

/**
 * Fetch all exhibits from GET /api/v1/exhibits with optional wing and search filters.
 */
export async function getExhibits(params?: { wingId?: string; search?: string }): Promise<Exhibit[]> {
  const query = new URLSearchParams();
  if (params?.wingId && params.wingId !== 'all') {
    query.set('wingId', params.wingId);
  }
  if (params?.search) {
    query.set('search', params.search);
  }

  const qs = query.toString();
  const url = qs ? `${API_V1_URL}/exhibits?${qs}` : `${API_V1_URL}/exhibits`;

  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch exhibits: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as Exhibit[];
}

/**
 * Fetch a single exhibit by ID from GET /api/v1/exhibits/{id}.
 */
export async function getExhibitById(id: string): Promise<Exhibit> {
  const res = await fetchWithTimeout(`${API_V1_URL}/exhibits/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(`Exhibit '${id}' not found (${res.status})`);
  }
  return (await res.json()) as Exhibit;
}

/**
 * Fetch all preset trails from GET /api/v1/trails.
 */
export async function getTrails(): Promise<MuseumTrail[]> {
  const res = await fetchWithTimeout(`${API_V1_URL}/trails`);
  if (!res.ok) {
    throw new Error(`Failed to fetch trails: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as MuseumTrail[];
}

/**
 * Central loader that fetches wings, exhibits, and preset trails concurrently.
 * If the backend is running and reachable, returns MySQL-backed live data.
 * If the backend is unavailable or returns an error, safely and transparently
 * falls back to local museum datasets without interrupting user experience.
 */
export async function loadMuseumDataWithFallback(): Promise<MuseumDataResult> {
  try {
    const [wingsRes, exhibitsRes, trailsRes] = await Promise.all([
      getWings(),
      getExhibits(),
      getTrails(),
    ]);

    return {
      wings: wingsRes,
      exhibits: exhibitsRes,
      trails: trailsRes,
      isLive: true,
      source: 'backend',
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Backend connection unavailable';
    console.warn(`[Internet Museum API] ${errorMessage}. Activating local museum dataset fallback.`);

    return {
      wings: MUSEUM_WINGS,
      exhibits: STARTER_EXHIBITS,
      trails: PRESET_TRAILS,
      isLive: false,
      source: 'local-fallback',
      error: errorMessage,
    };
  }
}
