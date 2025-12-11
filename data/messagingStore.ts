import { Conversation, Message, MessageRequest, ConversationPreview } from './messagingTypes';

// Store en memoire pour les conversations (en production: Firestore)
class MessagingStore {
  private conversations: Conversation[] = [];
  private messages: Map<string, Message[]> = new Map();
  private requests: MessageRequest[] = [];
  private listeners: Set<() => void> = new Set();
  private currentUserId = 'user-1'; // À remplacer par l'auth réelle

  getCurrentUserId() {
    return this.currentUserId;
  }

  // =========== CONVERSATIONS ===========
  getConversations(): ConversationPreview[] {
    return this.conversations
      .filter((conv) => conv.participants.includes(this.currentUserId))
      .sort((a, b) => (b.lastMessageAt?.getTime() || 0) - (a.lastMessageAt?.getTime() || 0))
      .map((conv) => this.toPreview(conv));
  }

  getConversationById(conversationId: string): (Conversation & { messages: Message[] }) | null {
    const conversation = this.conversations.find((c) => c.id === conversationId);
    if (!conversation) return null;
    return {
      ...conversation,
      messages: this.messages.get(conversationId) || [],
    };
  }

  private toPreview(conv: Conversation): ConversationPreview {
    const otherParticipantId = conv.participants.find((id) => id !== this.currentUserId) || '';
    const otherParticipantIndex = conv.participants.indexOf(otherParticipantId);

    return {
      ...conv,
      otherParticipantId,
      otherParticipantName: conv.participantNames[otherParticipantIndex] || 'Unknown',
      otherParticipantImage: conv.participantImages[otherParticipantIndex] || '',
    };
  }

  findOrCreateConversation(otherUserId: string, otherUserName: string, otherUserImage: string): Conversation {
    let conversation = this.conversations.find(
      (conv) => conv.participants.includes(this.currentUserId) && conv.participants.includes(otherUserId)
    );

    if (!conversation) {
      conversation = {
        id: `conv-${Date.now()}`,
        participants: [this.currentUserId, otherUserId],
        participantNames: ['Moi', otherUserName],
        participantImages: ['https://i.pravatar.cc/150?img=64', otherUserImage],
        unreadCount: 0,
        status: 'active',
        createdAt: new Date(),
      };
      this.conversations.push(conversation);
      this.notifyListeners();
    }

    return conversation;
  }

  deleteConversation(conversationId: string) {
    this.conversations = this.conversations.filter((c) => c.id !== conversationId);
    this.messages.delete(conversationId);
    this.notifyListeners();
  }

  archiveConversation(conversationId: string) {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.status = 'archived';
      this.notifyListeners();
    }
  }

  // =========== MESSAGES ===========
  getMessages(conversationId: string): Message[] {
    return this.messages.get(conversationId) || [];
  }

  sendMessage(conversationId: string, content: string): Message {
    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: this.currentUserId,
      senderName: 'Moi',
      content,
      createdAt: new Date(),
      status: 'sent',
    };

    const convMessages = this.messages.get(conversationId) || [];
    convMessages.push(message);
    this.messages.set(conversationId, convMessages);

    const conversation = this.conversations.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.lastMessage = content;
      conversation.lastMessageAt = new Date();
      conversation.lastMessageSenderId = this.currentUserId;
      this.conversations.sort((a, b) => (b.lastMessageAt?.getTime() || 0) - (a.lastMessageAt?.getTime() || 0));
    }

    setTimeout(() => {
      const idx = convMessages.findIndex((m) => m.id === message.id);
      if (idx !== -1) {
        convMessages[idx].status = 'delivered';
        this.notifyListeners();
      }
    }, 300);

    setTimeout(() => {
      const idx = convMessages.findIndex((m) => m.id === message.id);
      if (idx !== -1) {
        convMessages[idx].status = 'seen';
        this.notifyListeners();
      }
    }, 1000);

    this.notifyListeners();
    return message;
  }

  updateMessageStatus(conversationId: string, messageId: string, status: 'sent' | 'delivered' | 'seen') {
    const messages = this.messages.get(conversationId);
    if (messages) {
      const msg = messages.find((m) => m.id === messageId);
      if (msg) {
        msg.status = status;
        this.notifyListeners();
      }
    }
  }

  markConversationAsRead(conversationId: string) {
    const conversation = this.conversations.find((c) => c.id === conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      this.notifyListeners();
    }
  }

  // =========== DEMANDES ===========
  getRequests(): MessageRequest[] {
    return this.requests.filter((r) => r.to === this.currentUserId && r.status === 'pending');
  }

  getAllRequests(): MessageRequest[] {
    return this.requests;
  }

  getRequestWith(userId: string): MessageRequest | undefined {
    return this.requests.find(
      (r) =>
        ((r.from === this.currentUserId && r.to === userId) || (r.to === this.currentUserId && r.from === userId)) &&
        r.status === 'pending'
    );
  }

  getRequestById(requestId: string): MessageRequest | undefined {
    return this.requests.find((r) => r.id === requestId);
  }

  sendRequest(toUserId: string, toUserName: string, toUserImage: string): MessageRequest {
    const existingPending = this.getRequestWith(toUserId);
    if (existingPending) {
      return existingPending;
    }

    const existingConversation = this.conversations.find(
      (conv) => conv.participants.includes(this.currentUserId) && conv.participants.includes(toUserId)
    );
    if (existingConversation) {
      return {
        id: `req-existing-${Date.now()}`,
        from: this.currentUserId,
        fromName: 'Moi',
        fromImage: 'https://i.pravatar.cc/150?img=64',
        to: toUserId,
        status: 'accepted',
        createdAt: new Date(),
        respondedAt: new Date(),
      };
    }

    const request: MessageRequest = {
      id: `req-${Date.now()}`,
      from: this.currentUserId,
      fromName: 'Moi',
      fromImage: 'https://i.pravatar.cc/150?img=64',
      to: toUserId,
      status: 'pending',
      createdAt: new Date(),
    };

    this.requests.push(request);
    this.notifyListeners();
    return request;
  }

  acceptRequest(requestId: string): Conversation | null {
    const request = this.requests.find((r) => r.id === requestId);
    if (!request) return null;

    request.status = 'accepted';
    request.respondedAt = new Date();

    const conversation = this.findOrCreateConversation(request.from, request.fromName, request.fromImage);

    this.notifyListeners();
    return conversation;
  }

  rejectRequest(requestId: string) {
    const request = this.requests.find((r) => r.id === requestId);
    if (request) {
      request.status = 'refused';
      request.respondedAt = new Date();
      this.notifyListeners();
    }
  }

  // =========== SUBSCRIPTIONS ===========
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  // =========== MOCK DATA ===========
  loadMockData() {
    this.conversations = [
      {
        id: 'conv-1',
        participants: [this.currentUserId, 'user-2'],
        participantNames: ['Moi', 'Marie Laurent'],
        participantImages: ['https://i.pravatar.cc/150?img=64', 'https://i.pravatar.cc/150?img=1'],
        lastMessage: 'Super ! On se voit demain alors',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 10),
        lastMessageSenderId: this.currentUserId,
        unreadCount: 0,
        status: 'active',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
      {
        id: 'conv-2',
        participants: [this.currentUserId, 'user-3'],
        participantNames: ['Moi', 'Thomas Dubois'],
        participantImages: ['https://i.pravatar.cc/150?img=64', 'https://i.pravatar.cc/150?img=2'],
        lastMessage: 'Tu as vu le dernier commit ?',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
        lastMessageSenderId: 'user-3',
        unreadCount: 3,
        status: 'active',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      },
      {
        id: 'conv-3',
        participants: [this.currentUserId, 'user-4'],
        participantNames: ['Moi', 'Julie Martin'],
        participantImages: ['https://i.pravatar.cc/150?img=64', 'https://i.pravatar.cc/150?img=3'],
        lastMessage: 'Merci pour ton aide !',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        lastMessageSenderId: this.currentUserId,
        unreadCount: 0,
        status: 'active',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
    ];

    this.messages.set('conv-1', [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-2',
        senderName: 'Marie Laurent',
        content: 'Salut ! Comment ça va ?',
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        status: 'seen',
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: this.currentUserId,
        senderName: 'Moi',
        content: 'Très bien merci ! Et toi ?',
        createdAt: new Date(Date.now() - 1000 * 60 * 25),
        status: 'seen',
      },
      {
        id: 'msg-3',
        conversationId: 'conv-1',
        senderId: 'user-2',
        senderName: 'Marie Laurent',
        content: 'Super ! Tu as vu le dernier post ?',
        createdAt: new Date(Date.now() - 1000 * 60 * 20),
        status: 'seen',
      },
      {
        id: 'msg-4',
        conversationId: 'conv-1',
        senderId: this.currentUserId,
        senderName: 'Moi',
        content: 'Super ! On se voit demain alors',
        createdAt: new Date(Date.now() - 1000 * 60 * 10),
        status: 'delivered',
      },
    ]);

    this.requests = [
      {
        id: 'req-1',
        from: 'user-5',
        fromName: 'Kevin Bernard',
        fromImage: 'https://i.pravatar.cc/150?img=4',
        to: this.currentUserId,
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60),
      },
    ];
  }
}

export const messagingStore = new MessagingStore();
messagingStore.loadMockData();
