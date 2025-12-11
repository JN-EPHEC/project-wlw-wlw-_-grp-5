export interface Community {
  id: string;
  name: string;
  coverImage: string;
  memberCount: string;
  activityStatus: string;
  description?: string;
  tags?: string[];
  members?: Member[];
}

export interface Member {
  id: string;
  name: string;
  profileImage: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

export interface PrivateChat {
  id: string;
  contactName: string;
  profileImage: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isPending?: boolean;
}

export const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Routine Matinale Positive',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
    memberCount: '2,1k membres',
    activityStatus: 'Tres actif',
    description: 'Commence ta journee en douceur avec des routines bien-etre.',
    tags: ['routine', 'habitudes', 'matin'],
    members: [
      { id: 'm1', name: 'Alice', profileImage: 'https://i.pravatar.cc/150?img=8' },
      { id: 'm2', name: 'Lucas', profileImage: 'https://i.pravatar.cc/150?img=9' },
    ],
  },
  {
    id: '2',
    name: 'Parler de ses emotions',
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=200&fit=crop',
    memberCount: '980 membres',
    activityStatus: "Actif aujourd'hui",
    description: 'Un espace bienveillant pour poser ses ressentis.',
    tags: ['ecoute', 'entraide'],
    members: [
      { id: 'm3', name: 'Sophie', profileImage: 'https://i.pravatar.cc/150?img=10' },
      { id: 'm4', name: 'Karim', profileImage: 'https://i.pravatar.cc/150?img=11' },
    ],
  },
  {
    id: '3',
    name: 'Challenge 30 jours bien-etre',
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
    memberCount: '5,4k membres',
    activityStatus: 'Nouveaux posts',
    description: 'Un defi quotidien pour avancer ensemble.',
    tags: ['defi', 'motivation'],
    members: [
      { id: 'm5', name: 'Emma', profileImage: 'https://i.pravatar.cc/150?img=12' },
      { id: 'm6', name: 'Leo', profileImage: 'https://i.pravatar.cc/150?img=13' },
    ],
  },
  {
    id: '4',
    name: 'Meditation & Pleine Conscience',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=200&fit=crop',
    memberCount: '3,2k membres',
    activityStatus: 'Tres actif',
    description: 'Meditations guidees et partage de pratiques.',
    tags: ['meditation', 'respiration'],
    members: [
      { id: 'm7', name: 'Nina', profileImage: 'https://i.pravatar.cc/150?img=14' },
      { id: 'm8', name: 'Paul', profileImage: 'https://i.pravatar.cc/150?img=15' },
    ],
  },
  {
    id: '5',
    name: 'Developpement Personnel',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=200&fit=crop',
    memberCount: '1,5k membres',
    activityStatus: 'Actif cette semaine',
    description: 'Progression perso, lectures, podcasts et coaching.',
    tags: ['mindset', 'coaching'],
    members: [
      { id: 'm9', name: 'Claire', profileImage: 'https://i.pravatar.cc/150?img=16' },
      { id: 'm10', name: 'Julien', profileImage: 'https://i.pravatar.cc/150?img=17' },
    ],
  },
];

export const mockPrivateChats: PrivateChat[] = [
  {
    id: '1',
    contactName: 'Marie Laurent',
    profileImage: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Super ! On se voit demain alors',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    unreadCount: 0,
  },
  {
    id: '2',
    contactName: 'Thomas Dubois',
    profileImage: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'Tu as vu le dernier commit ?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 3,
  },
  {
    id: '3',
    contactName: 'Julie Martin',
    profileImage: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'Merci pour ton aide !',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    unreadCount: 0,
  },
  {
    id: '4',
    contactName: 'Kevin Bernard',
    profileImage: 'https://i.pravatar.cc/150?img=4',
    lastMessage: 'Nouvelle demande de discussion',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    unreadCount: 1,
    isPending: true,
  },
  {
    id: '5',
    contactName: 'Sarah Cohen',
    profileImage: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Le projet avance bien ?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
  },
];

export const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Maintenant';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `${diffDays}j`;

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};
