// Types pour le système de messagerie

export interface User {
  id: string;
  name: string;
  profileImage: string;
  email?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
  status: 'sent' | 'delivered' | 'seen';
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  participantImages: string[];
  lastMessage?: string;
  lastMessageAt?: Date;
  lastMessageSenderId?: string;
  unreadCount: number;
  status: 'active' | 'archived';
  createdAt: Date;
}

export interface MessageRequest {
  id: string;
  from: string;
  fromName: string;
  fromImage: string;
  to: string;
  status: 'pending' | 'accepted' | 'refused';
  createdAt: Date;
  respondedAt?: Date;
}

export interface ConversationPreview extends Conversation {
  otherParticipantId: string;
  otherParticipantName: string;
  otherParticipantImage: string;
}
