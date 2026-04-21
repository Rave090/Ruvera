import { useState, useEffect, useCallback } from 'react';
import { fetchMessages, sendMessage } from '../services/chat.service';
import { useChatStore } from '@store/chat.store';
import { useAuthStore, selectUserProfile } from '@store/auth.store';
import type { Message } from '../types';

interface UseConversationResult {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  send: (content: string) => Promise<void>;
}

export function useConversation(conversationId: string): UseConversationResult {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setActiveConversation = useChatStore(s => s.setActiveConversation);
  const decrementUnread = useChatStore(s => s.decrementUnread);
  const userProfile = useAuthStore(selectUserProfile);

  useEffect(() => {
    setActiveConversation(conversationId);
    return () => setActiveConversation(null);
  }, [conversationId, setActiveConversation]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetchMessages(conversationId).then(result => {
      if (cancelled) return;
      if (result.success) {
        setMessages(result.data);
        const unread = result.data.filter(m => !m.isRead && m.senderId !== userProfile?.id).length;
        if (unread > 0) decrementUnread(unread);
      } else {
        setError(result.error.message);
      }
      setIsLoading(false);
    });

    return () => { cancelled = true; };
  }, [conversationId, userProfile?.id, decrementUnread]);

  const send = useCallback(
    async (content: string) => {
      if (!content.trim() || !userProfile) return;
      setIsSending(true);
      const result = await sendMessage(conversationId, content.trim(), userProfile.id);
      if (result.success) {
        setMessages(prev => [...prev, result.data]);
      }
      setIsSending(false);
    },
    [conversationId, userProfile],
  );

  return { messages, isLoading, isSending, error, send };
}
