import { useState, useEffect, useCallback } from 'react';
import { fetchConversations } from '../services/chat.service';
import { useChatStore } from '@store/chat.store';
import type { Conversation } from '../types';

interface UseChatListResult {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useChatList(): UseChatListResult {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setUnreadCount = useChatStore(s => s.setUnreadCount);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchConversations();
    if (result.success) {
      setConversations(result.data);
      const total = result.data.reduce((sum, c) => sum + c.unreadCount, 0);
      setUnreadCount(total);
    } else {
      setError(result.error.message);
    }
    setIsLoading(false);
  }, [setUnreadCount]);

  useEffect(() => {
    void load();
  }, [load]);

  return { conversations, isLoading, error, refresh: load };
}
