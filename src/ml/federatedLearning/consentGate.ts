import * as SecureStore from 'expo-secure-store';

const FL_CONSENT_KEY = 'ruvera_fl_consent';

export interface ConsentGateResult {
  granted: boolean;
  reason?: string;
}

/**
 * Must be called before any federated learning operation.
 * Returns false immediately if the user has not explicitly opted in.
 */
export async function checkFLConsent(): Promise<ConsentGateResult> {
  try {
    const stored = await SecureStore.getItemAsync(FL_CONSENT_KEY);
    if (stored !== 'true') {
      return { granted: false, reason: 'User has not opted in to federated learning.' };
    }
    return { granted: true };
  } catch {
    return { granted: false, reason: 'Could not read consent state.' };
  }
}

export async function grantFLConsent(): Promise<void> {
  await SecureStore.setItemAsync(FL_CONSENT_KEY, 'true');
}

export async function revokeFLConsent(): Promise<void> {
  await SecureStore.deleteItemAsync(FL_CONSENT_KEY);
}
