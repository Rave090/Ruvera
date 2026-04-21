import type { UserProfile, UserRole } from '@store/auth.store';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface SignupRequest {
  displayName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface ForgotPasswordResponse {
  message: string;
}
