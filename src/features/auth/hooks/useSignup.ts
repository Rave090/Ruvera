import { useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@store/auth.store';
import type { UserRole } from '@store/auth.store';
import { signupService } from '@features/auth/services/auth.service';
import { validateEmail, validatePassword, validateRequired } from '@utils/validators';
import { SECURE_STORE_KEYS } from '@constants';

interface SignupForm {
  displayName: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UseSignupReturn {
  form: SignupForm;
  setField: <K extends keyof SignupForm>(field: K, value: SignupForm[K]) => void;
  error: string | null;
  isLoading: boolean;
  signup: () => Promise<void>;
}

export function useSignup(): UseSignupReturn {
  const [form, setForm] = useState<SignupForm>({
    displayName: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setField = useCallback(
    <K extends keyof SignupForm>(field: K, value: SignupForm[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    [],
  );

  const signup = useCallback(async () => {
    const nameResult = validateRequired(form.displayName, 'Full name');
    if (!nameResult.isValid) { setError(nameResult.message); return; }

    const emailResult = validateEmail(form.email);
    if (!emailResult.isValid) { setError(emailResult.message); return; }

    const passwordResult = validatePassword(form.password);
    if (!passwordResult.isValid) { setError(passwordResult.message); return; }

    setIsLoading(true);
    setError(null);

    const result = await signupService({
      displayName: form.displayName.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    });

    if (!result.success) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    const { accessToken, refreshToken, user } = result.data;

    await Promise.all([
      SecureStore.setItemAsync(SECURE_STORE_KEYS.accessToken, accessToken),
      SecureStore.setItemAsync(SECURE_STORE_KEYS.refreshToken, refreshToken),
      SecureStore.setItemAsync(SECURE_STORE_KEYS.userProfile, JSON.stringify(user)),
    ]);

    useAuthStore.getState().setCredentials({ accessToken, refreshToken, userProfile: user });

    setIsLoading(false);
  }, [form]);

  return { form, setField, error, isLoading, signup };
}
