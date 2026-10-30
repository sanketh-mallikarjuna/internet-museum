export interface CuratorUser {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  tokenType: string;
  user: CuratorUser;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
