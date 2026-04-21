import type { Result } from '@services/api/types';
import type { Conversation, Message } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    dermatologist: {
      id: 'd1',
      name: 'Dr. Sarah Chen',
      specialization: 'Medical Dermatology',
      avatarUrl: 'https://picsum.photos/seed/d1/200/200',
      isOnline: true,
    },
    lastMessage: 'Your skin looks much better! Keep using the serum.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'c2',
    dermatologist: {
      id: 'd3',
      name: 'Dr. Priya Nair',
      specialization: 'Pediatric Dermatology',
      avatarUrl: 'https://picsum.photos/seed/d3/200/200',
      isOnline: false,
    },
    lastMessage: 'Please send a photo of the affected area.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unreadCount: 0,
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1',
      conversationId: 'c1',
      senderId: 'u1',
      senderName: 'You',
      content: 'Hi Dr. Chen, my redness has been reducing.',
      type: 'text',
      sentAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isRead: true,
    },
    {
      id: 'm2',
      conversationId: 'c1',
      senderId: 'd1',
      senderName: 'Dr. Sarah Chen',
      content: 'Your skin looks much better! Keep using the serum.',
      type: 'text',
      sentAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: false,
    },
  ],
  c2: [
    {
      id: 'm3',
      conversationId: 'c2',
      senderId: 'd3',
      senderName: 'Dr. Priya Nair',
      content: 'Please send a photo of the affected area.',
      type: 'text',
      sentAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      isRead: true,
    },
  ],
};

export async function fetchConversations(): Promise<Result<Conversation[]>> {
  await delay(600);
  return { success: true, data: MOCK_CONVERSATIONS };
}

export async function fetchMessages(
  conversationId: string,
): Promise<Result<Message[]>> {
  await delay(400);
  const msgs = MOCK_MESSAGES[conversationId] ?? [];
  return { success: true, data: msgs };
}

export async function sendMessage(
  conversationId: string,
  content: string,
  senderId: string,
): Promise<Result<Message>> {
  await delay(300);
  const message: Message = {
    id: `m${Date.now()}`,
    conversationId,
    senderId,
    senderName: 'You',
    content,
    type: 'text',
    sentAt: new Date().toISOString(),
    isRead: false,
  };
  const existing = MOCK_MESSAGES[conversationId] ?? [];
  MOCK_MESSAGES[conversationId] = [...existing, message];
  return { success: true, data: message };
}
