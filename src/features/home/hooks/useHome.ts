import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { refreshHomeData } from '../services/home.service';
import {
  isHomeDataStale,
  readAllCachedHomeData,
} from '../services/home.repository';
import type { HomeData } from '../types';

interface UseHomeResult {
  data: HomeData | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => void;
}

export function useHome(): UseHomeResult {
  const [data, setData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tracks whether we're past the first mount to avoid double-fetching in focus effect
  const hasMounted = useRef(false);
  // Tracks whether a refresh is in flight to prevent concurrent refreshes
  const isRefreshingRef = useRef(false);

  const loadFromCache = useCallback(async (): Promise<string | null> => {
    try {
      const cached = await readAllCachedHomeData(null);
      const hasAnyData =
        cached.trendingProducts.length > 0 ||
        cached.dermatologists.length > 0 ||
        cached.analysis !== null;

      if (hasAnyData) {
        const analysisId = cached.analysis?.id ?? null;
        const full = await readAllCachedHomeData(analysisId);
        setData(full);
        return analysisId;
      }
    } catch {
      // DB unavailable — proceed to network fetch
    }
    return null;
  }, []);

  const runRefresh = useCallback(
    async (silent: boolean) => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      if (!silent) setIsRefreshing(true);
      setError(null);

      const result = await refreshHomeData();

      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        // Only surface the error when there is nothing cached to fall back on
        setData((prev) => {
          if (!prev) setError(result.error.message);
          return prev;
        });
      }

      if (!silent) setIsRefreshing(false);
      isRefreshingRef.current = false;
    },
    [],
  );

  // Initial mount: show cache instantly, then refresh if stale
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadFromCache();
      const stale = await isHomeDataStale().catch(() => true);
      if (stale) {
        await runRefresh(true);
      }
      setIsLoading(false);
      hasMounted.current = true;
    };
    void init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On screen focus (e.g. returning from skin scan): silently refresh if stale
  useFocusEffect(
    useCallback(() => {
      if (!hasMounted.current) return;
      const checkAndRefresh = async () => {
        const stale = await isHomeDataStale().catch(() => true);
        if (stale) await runRefresh(true);
      };
      void checkAndRefresh();
    }, [runRefresh]),
  );

  const refresh = useCallback(() => {
    void runRefresh(false);
  }, [runRefresh]);

  return { data, isLoading, isRefreshing, error, refresh };
}
