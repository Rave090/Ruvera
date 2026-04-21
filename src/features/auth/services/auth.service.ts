import type { UserRole, UserProfile } from '@store/auth.store';
import type { LoginResponse, SignupRequest, SignupResponse, ForgotPasswordResponse } from '../types';
import type { Result } from '@services/api/types';

const MOCK_DELAY_MS = 1200;

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function makeToken(): string {
  return `${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
}

// Test credentials: email → { password, profile }
const MOCK_USERS: Record<
  string,
  { password: string; profile: UserProfile }
> = {
  'user@test.com': {
    password: 'Password1',
    profile: { id: 'usr_001', email: 'user@test.com', displayName: 'Alex User', role: 'user', avatarUrl: null },
  },
  'vendor@test.com': {
    password: 'Password1',
    profile: { id: 'vnd_001', email: 'vendor@test.com', displayName: 'Sam Vendor', role: 'vendor', avatarUrl: null },
  },
  'derm@test.com': {
    password: 'Password1',
    profile: { id: 'drm_001', email: 'derm@test.com', displayName: 'Dr. Chris', role: 'dermatologist', avatarUrl: null },
  },
};

export async function loginService(
  email: string,
  password: string,
): Promise<Result<LoginResponse>> {
  await delay(MOCK_DELAY_MS);

  const mock = MOCK_USERS[email.toLowerCase()];

  if (!mock || mock.password !== password) {
    return {
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.\nTry user@test.com / Password1',
        statusCode: 401,
      },
    };
  }

  return {
    success: true,
    data: {
      accessToken: makeToken(),
      refreshToken: makeToken(),
      user: mock.profile,
    },
  };
}

export async function signupService(
  request: SignupRequest,
): Promise<Result<SignupResponse>> {
  await delay(MOCK_DELAY_MS);

  if (MOCK_USERS[request.email.toLowerCase()]) {
    return {
      success: false,
      error: {
        code: 'EMAIL_TAKEN',
        message: 'An account with this email already exists.',
        statusCode: 409,
      },
    };
  }

  const newProfile: UserProfile = {
    id: `usr_${Date.now()}`,
    email: request.email,
    displayName: request.displayName,
    role: request.role,
    avatarUrl: null,
  };

  return {
    success: true,
    data: {
      accessToken: makeToken(),
      refreshToken: makeToken(),
      user: newProfile,
    },
  };
}

export async function forgotPasswordService(
  _email: string,
): Promise<Result<ForgotPasswordResponse>> {
  await delay(MOCK_DELAY_MS);
  return {
    success: true,
    data: { message: 'If this email exists, a reset link has been sent.' },
  };
}

export async function logoutService(): Promise<void> {
  await delay(300);
}

// Expose mock roles info for the signup role hint
export const MOCK_ROLE_HINT: Record<UserRole, string> = {
  user: 'Browse products & consult dermatologists',
  vendor: 'Manage products & track orders',
  dermatologist: 'Manage patients & consultations',
};
