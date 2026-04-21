import { create } from 'zustand';

interface ChatState {
  unreadCount: number;
  activeConversationId: string | null;
}

interface ChatActions {
  setUnreadCount: (count: number) => void;
  decrementUnread: (by: number) => void;
  setActiveConversation: (id: string | null) => void;
}

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>((set, get) => ({
  unreadCount: 0,
  activeConversationId: null,

  setUnreadCount: (count) => set({ unreadCount: count }),
  decrementUnread: (by) =>
    set({ unreadCount: Math.max(0, get().unreadCount - by) }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
}));

export const selectUnreadCount = (s: ChatStore) => s.unreadCount;
export const selectActiveConversationId = (s: ChatStore) =>
  s.activeConversationId;
