import { Community, Member, mockCommunities } from './discussions';

// Stockage en memoire pour les communautes creees et les adhesions (mock)
class CommunityStore {
  private createdCommunities: Community[] = [];
  private memberships: Set<string> = new Set();
  private notifications: Set<string> = new Set();
  private listeners: (() => void)[] = [];
  private currentUser: Member = { id: 'me', name: 'Moi', profileImage: 'https://i.pravatar.cc/150?img=64' };

  addCommunity(community: Community) {
    const withMembers: Community = {
      ...community,
      members: community.members || [this.currentUser],
    };
    this.createdCommunities.unshift(withMembers);
    this.memberships.add(community.id);
    this.notifyListeners();
  }

  getCommunities(): Community[] {
    return this.createdCommunities;
  }

  getAllCommunities(): Community[] {
    return [...this.createdCommunities, ...mockCommunities];
  }

  getCommunityById(id: string): Community | undefined {
    return this.getAllCommunities().find((c) => c.id === id);
  }

  joinCommunity(id: string) {
    this.memberships.add(id);
    this.notifyListeners();
  }

  leaveCommunity(id: string) {
    this.memberships.delete(id);
    this.notifications.delete(id);
    this.notifyListeners();
  }

  isMember(id: string) {
    return this.memberships.has(id);
  }

  toggleNotifications(id: string) {
    if (this.notifications.has(id)) {
      this.notifications.delete(id);
    } else {
      this.notifications.add(id);
    }
    this.notifyListeners();
  }

  notificationsEnabled(id: string) {
    return this.notifications.has(id);
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export const communityStore = new CommunityStore();
