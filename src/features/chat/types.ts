export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'system';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: MessageType;
  sentAt: string;
  isRead: boolean;
}

export interface ConversationDermatologist {
  id: string;
  name: string;
  specialization: string;
  avatarUrl: string | null;
  isOnline: boolean;
}

export interface Conversation {
  id: string;
  dermatologist: ConversationDermatologist;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
