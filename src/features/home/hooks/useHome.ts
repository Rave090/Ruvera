import { useState, useEffect, useCallback } from 'react';
import { fetchHomeData } from '../services/home.service';
import type { HomeData } from '../types';

interface UseHomeResult {
  data: HomeData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useHome(): UseHomeResult {
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchHomeData();
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, isLoading, error, refresh: load };
}
