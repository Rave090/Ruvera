import { useState, useCallback } from 'react';
import { forgotPasswordService } from '@features/auth/services/auth.service';
import { validateEmail } from '@utils/validators';

interface UseForgotPasswordReturn {
  email: string;
  setEmail: (value: string) => void;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  submit: () => Promise<void>;
}

export function useForgotPassword(): UseForgotPasswordReturn {
  const [email, setEmailState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const setEmail = useCallback((value: string) => {
    setEmailState(value);
    setError(null);
  }, []);

  const submit = useCallback(async () => {
    const result = validateEmail(email);
    if (!result.isValid) {
      setError(result.message);
      return;
    }

    setIsLoading(true);
    setError(null);

    await forgotPasswordService(email.trim());

    setIsLoading(false);
    setIsSuccess(true);
  }, [email]);

  return { email, setEmail, error, isLoading, isSuccess, submit };
}
