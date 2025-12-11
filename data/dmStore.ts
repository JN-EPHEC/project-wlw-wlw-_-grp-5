export interface DMRequest {
  id: string; // unique id for request
  contactName: string;
  profileImage: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isPending: boolean;
}

class DMStore {
  private requests: DMRequest[] = [];
  private listeners: (() => void)[] = [];

  addRequest(request: Omit<DMRequest, 'id' | 'timestamp' | 'unreadCount' | 'isPending'>) {
    const newReq: DMRequest = {
      id: `dm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      contactName: request.contactName,
      profileImage: request.profileImage,
      lastMessage: 'Nouvelle demande de discussion',
      timestamp: new Date(),
      unreadCount: 0,
      isPending: true,
    };
    this.requests.unshift(newReq);
    this.notify();
    return newReq;
  }

  getRequests(): DMRequest[] {
    return this.requests;
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }
}

export const dmStore = new DMStore();
