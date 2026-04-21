import { useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@store/auth.store';
import { loginService } from '@features/auth/services/auth.service';
import { validateEmail } from '@utils/validators';
import { SECURE_STORE_KEYS } from '@constants';

interface LoginForm {
  email: string;
  password: string;
}

interface UseLoginReturn {
  form: LoginForm;
  setField: (field: keyof LoginForm, value: string) => void;
  error: string | null;
  isLoading: boolean;
  login: () => Promise<void>;
}

export function useLogin(): UseLoginReturn {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setField = useCallback((field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const login = useCallback(async () => {
    const emailResult = validateEmail(form.email);
    if (!emailResult.isValid) {
      setError(emailResult.message);
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await loginService(form.email.trim(), form.password);

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

    // Updating the store triggers the auth guard in _layout.tsx to redirect
    useAuthStore.getState().setCredentials({ accessToken, refreshToken, userProfile: user });

    setIsLoading(false);
  }, [form]);

  return { form, setField, error, isLoading, login };
}
