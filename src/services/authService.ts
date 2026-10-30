import type { CuratorUser, AuthTokenResponse, RegisterPayload, LoginPayload } from '../types/auth';
import { API_V1_URL } from './apiService';

const TOKEN_STORAGE_KEY = 'im_curator_token';
const USER_STORAGE_KEY = 'im_curator_user';

export const authService = {
  /**
   * Retrieve JWT token from localStorage.
   */
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Persist JWT token in localStorage.
   */
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.warn('Failed to persist authentication token:', e);
    }
  },

  /**
   * Remove JWT token from localStorage.
   */
  removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove authentication token:', e);
    }
  },

  /**
   * Retrieve cached curator user profile from localStorage.
   */
  getUser(): CuratorUser | null {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CuratorUser) : null;
    } catch {
      return null;
    }
  },

  /**
   * Persist curator user profile in localStorage.
   */
  setUser(user: CuratorUser): void {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist curator profile:', e);
    }
  },

  /**
   * Clear curator user profile from localStorage.
   */
  removeUser(): void {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to remove curator profile:', e);
    }
  },

  /**
   * Register a new curator account against FastAPI backend.
   */
  async register(payload: RegisterPayload): Promise<AuthTokenResponse> {
    const res = await fetch(`${API_V1_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data?.detail || 'Registration was rejected by the server.';
      throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }

    const tokenResponse: AuthTokenResponse = {
      accessToken: data.accessToken || data.access_token,
      tokenType: data.tokenType || data.token_type || 'bearer',
      user: data.user,
    };

    if (tokenResponse.accessToken) {
      this.setToken(tokenResponse.accessToken);
      this.setUser(tokenResponse.user);
    }

    return tokenResponse;
  },

  /**
   * Authenticate curator credentials against FastAPI backend.
   */
  async login(payload: LoginPayload): Promise<AuthTokenResponse> {
    const res = await fetch(`${API_V1_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data?.detail || 'Invalid email or password.';
      throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
    }

    const tokenResponse: AuthTokenResponse = {
      accessToken: data.accessToken || data.access_token,
      tokenType: data.tokenType || data.token_type || 'bearer',
      user: data.user,
    };

    if (tokenResponse.accessToken) {
      this.setToken(tokenResponse.accessToken);
      this.setUser(tokenResponse.user);
    }

    return tokenResponse;
  },

  /**
   * Fetch current authenticated curator profile from protected endpoint.
   */
  async getMe(): Promise<CuratorUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_V1_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        // Token has expired or is invalid; silently clear auth session
        this.removeToken();
        this.removeUser();
        return null;
      }

      const user = (await res.json()) as CuratorUser;
      this.setUser(user);
      return user;
    } catch {
      // In case of network error, return cached user if present
      return this.getUser();
    }
  },

  /**
   * Log out currently authenticated curator.
   * Note: Guest bookmarks, passport stamps, and custom trails remain untouched.
   */
  logout(): void {
    this.removeToken();
    this.removeUser();
  },
};
