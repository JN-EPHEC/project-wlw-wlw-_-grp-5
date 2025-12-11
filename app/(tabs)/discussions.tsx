import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { CommunityCard } from '../../components/CommunityCard';
import { EnhancedChatPreviewCard } from '../../components/EnhancedChatPreviewCard';
import { communityStore } from '../../data/communityStore';
import { Community, mockCommunities } from '../../data/discussions';
import { messagingStore } from '../../data/messagingStore';
import { ConversationPreview, MessageRequest } from '../../data/messagingTypes';

type SegmentKey = 'mindsafe' | 'community' | 'private';
type MindMessage = { id: string; text: string; from: 'user' | 'ai' };

const segments = [
  { key: 'mindsafe' as SegmentKey, label: 'MindSafe', icon: 'shield-checkmark-outline' },
  { key: 'community' as SegmentKey, label: 'Communauté', icon: 'people-outline' },
  { key: 'private' as SegmentKey, label: 'Privés', icon: 'lock-closed-outline' },
];

export default function DiscussionsScreen() {
  const router = useRouter();
  const [activeSegment, setActiveSegment] = useState<SegmentKey>('mindsafe');
  const [communities, setCommunities] = useState<Community[]>(mockCommunities);
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [requests, setRequests] = useState<MessageRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [mindMessages, setMindMessages] = useState<MindMessage[]>([
    { id: 'welcome', text: 'Bienvenue ! Je suis MindSafe, ton compagnon bienveillant. Dis-moi ce qui te préoccupe.', from: 'ai' },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      loadCommunities();
      loadMessagingData();
      const unsubscribe = messagingStore.subscribe(() => loadMessagingData());
      return () => unsubscribe();
    }, [])
  );

  const loadCommunities = () => {
    setCommunities(communityStore.getAllCommunities());
  };

  const loadMessagingData = () => {
    setConversations(messagingStore.getConversations());
    setRequests(messagingStore.getRequests());
  };

  const handleCommunityPress = (community: Community) => {
    router.push({ pathname: '/chat/[id]' as any, params: { id: community.id, name: community.name, type: 'community' } } as any);
  };

  const handleConversationPress = (conversation: ConversationPreview) => {
    messagingStore.markConversationAsRead(conversation.id);
    router.push({ pathname: '/chat/[id]' as any, params: { id: conversation.id, name: conversation.otherParticipantName, type: 'private' } } as any);
  };

  const handleAcceptRequest = (requestId: string, fromUserId: string, fromUserName: string, fromUserImage: string) => {
    const conversation = messagingStore.acceptRequest(requestId);
    if (conversation) {
      loadMessagingData();
      setTimeout(() => {
        router.push({ pathname: '/chat/[id]' as any, params: { id: conversation.id, name: fromUserName, type: 'private' } } as any);
      }, 200);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    messagingStore.rejectRequest(requestId);
    loadMessagingData();
  };

  const handleSendRequest = () => {
    const req = messagingStore.sendRequest('user-2', 'Marie Laurent', 'https://i.pravatar.cc/150?img=1');
    if (req && req.status === 'pending') {
      Alert.alert('Demande envoyée', 'En attente d’acceptation.');
    } else {
      Alert.alert('Info', 'Une conversation existe déjà ou une demande est en cours.');
    }
    loadMessagingData();
  };

  const handleCreateCommunity = () => {
    router.push('/create-community');
  };

  const getAIResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('stress') || lower.includes('anx')) return "Je comprends que tu te sentes tendu. Essayons 3 respirations profondes ensemble.";
    if (lower.includes('triste') || lower.includes('fatigue')) return "C’est normal de se sentir comme ça parfois. Qu’est-ce qui t’aiderait le plus maintenant ?";
    if (lower.includes('bien') || lower.includes('super')) return "Génial ! Profite de cette énergie. Tu veux un défi rapide ?";
    return "Merci pour ton partage. Je suis là pour écouter. Peux-tu m’en dire un peu plus ?";
  };

  const handleSendMindSafe = () => {
    if (!message.trim()) return;
    const userMsg: MindMessage = { id: Date.now().toString(), text: message.trim(), from: 'user' };
    setMindMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setTimeout(() => {
      const aiMsg: MindMessage = { id: `${userMsg.id}-ai`, text: getAIResponse(userMsg.text), from: 'ai' };
      setMindMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  const filteredCommunities = useMemo(
    () => communities.filter((community) => community.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [communities, searchQuery]
  );

  const filteredConversations = useMemo(
    () =>
      conversations.filter(
        (conv) =>
          conv.otherParticipantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      ),
    [conversations, searchQuery]
  );

  const filteredRequests = useMemo(
    () => requests.filter((req) => req.fromName.toLowerCase().includes(searchQuery.toLowerCase())),
    [requests, searchQuery]
  );

  const renderCommunityItem = ({ item }: { item: Community }) => (
    <CommunityCard
      community={item}
      onPress={() => handleCommunityPress(item)}
      onJoinToggle={() => {
        if (communityStore.isMember(item.id)) {
          communityStore.leaveCommunity(item.id);
        } else {
          communityStore.joinCommunity(item.id);
        }
        loadCommunities();
      }}
      onInfo={() => router.push({ pathname: '/community/[id]', params: { id: item.id } } as any)}
      isMember={communityStore.isMember(item.id)}
      notificationsOn={communityStore.notificationsEnabled(item.id)}
      onToggleNotifications={() => {
        communityStore.toggleNotifications(item.id);
        loadCommunities();
      }}
    />
  );

  const renderConversationItem = ({ item }: { item: ConversationPreview }) => (
    <Swipeable
      renderRightActions={() => (
        <View style={styles.swipeActions}>
          <TouchableOpacity style={[styles.swipeButton, styles.archiveButton]} onPress={() => messagingStore.archiveConversation(item.id)} activeOpacity={0.7}>
            <Text style={styles.swipeButtonText}>Archiver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.swipeButton, styles.deleteButton]} onPress={() => messagingStore.deleteConversation(item.id)} activeOpacity={0.7}>
            <Text style={styles.swipeButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <View style={{ position: 'relative' }}>
        <EnhancedChatPreviewCard conversation={item} onPress={() => handleConversationPress(item)} />
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </Swipeable>
  );

  const renderRequestItem = ({ item }: { item: MessageRequest }) => (
    <EnhancedChatPreviewCard request={item} onAccept={() => handleAcceptRequest(item.id, item.from, item.fromName, item.fromImage)} onReject={() => handleRejectRequest(item.id)} />
  );

  const showMindSafe = activeSegment === 'mindsafe';
  const showCommunities = activeSegment === 'community';
  const showPrivate = activeSegment === 'private';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <View style={styles.segmentContainer}>
        {segments.map((seg) => {
          const selected = activeSegment === seg.key;
          return (
            <TouchableOpacity key={seg.key} style={[styles.segment, selected && styles.segmentActive]} onPress={() => setActiveSegment(seg.key)} activeOpacity={0.85}>
              <Ionicons name={seg.icon as any} size={16} color={selected ? '#fff' : '#111'} style={{ marginRight: 6 }} />
              <Text style={[styles.segmentLabel, selected && styles.segmentLabelActive]}>{seg.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une discussion"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={[]}
        renderItem={null}
        keyExtractor={(_, idx) => `placeholder-${idx}`}
        ListHeaderComponent={
          <View>
            {showMindSafe && (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Ionicons name="heart" size={18} color="#1E8A6A" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>MindSafe</Text>
                    <Text style={styles.cardSubtitle}>IA empathique • Toujours disponible</Text>
                  </View>
                </View>

                <View style={styles.mindChat}>
                  {mindMessages.map((m) => (
                    <View
                      key={m.id}
                      style={[
                        styles.bubble,
                        m.from === 'user' ? styles.bubbleUser : styles.bubbleAI,
                        m.from === 'user' ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
                      ]}
                    >
                      <Text style={m.from === 'user' ? styles.bubbleTextUser : styles.bubbleTextAI}>{m.text}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Écris ton message..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={message}
                    onChangeText={setMessage}
                  />
                  <TouchableOpacity style={styles.sendButton} activeOpacity={0.85} onPress={handleSendMindSafe}>
                    <Ionicons name="send" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.actionsRow}>
              {showPrivate && (
                <TouchableOpacity style={styles.requestButton} onPress={handleSendRequest} activeOpacity={0.85}>
                  <Text style={styles.requestButtonText}>Demande</Text>
                </TouchableOpacity>
              )}
              {showCommunities && (
                <TouchableOpacity style={styles.addButton} onPress={handleCreateCommunity} activeOpacity={0.85}>
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
              )}
            </View>

            {showCommunities && filteredCommunities.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>LES COMMUNAUTÉS</Text>
                </View>
                <FlatList
                  data={filteredCommunities}
                  renderItem={renderCommunityItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.communitiesContainer}
                />
              </>
            )}

            {showPrivate && filteredRequests.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>DEMANDES DE DISCUSSION</Text>
                </View>
                <FlatList data={filteredRequests} renderItem={renderRequestItem} keyExtractor={(item) => item.id} scrollEnabled={false} />
              </>
            )}

            {showPrivate && filteredConversations.length > 0 && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>CONVERSATIONS</Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <View style={styles.chatsContainer}>
            {showPrivate ? (
              filteredConversations.length > 0 ? (
                <FlatList data={filteredConversations} renderItem={renderConversationItem} keyExtractor={(item) => item.id} scrollEnabled={false} />
              ) : (
                searchQuery &&
                filteredCommunities.length === 0 && (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateTitle}>Aucune conversation</Text>
                    <Text style={styles.emptyStateSubtitle}>Aucune discussion ne correspond à "{searchQuery}"</Text>
                  </View>
                )
              )
            ) : null}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f5',
    paddingHorizontal: 12,
  },
  header: {
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    padding: 4,
    marginBottom: 8,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  segmentActive: {
    backgroundColor: '#6b7280',
  },
  segmentLabel: {
    color: '#111',
    fontWeight: '700',
    fontSize: 14,
  },
  segmentLabelActive: {
    color: '#fff',
  },
  searchContainer: {
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    fontSize: 15,
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E6F4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  mindChat: {
    marginTop: 12,
    marginBottom: 12,
    gap: 8,
  },
  bubble: {
    maxWidth: '85%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
  },
  bubbleAI: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  bubbleUser: {
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#1E8A6A33',
  },
  bubbleTextAI: { color: '#111827', fontSize: 14 },
  bubbleTextUser: { color: '#065f46', fontSize: 14 },
  welcome: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  welcomeText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
  },
  sendButton: {
    backgroundColor: '#1E8A6A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
  },
  requestButton: {
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.08)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  requestButtonText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#56B4FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#56B4FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f4f4f5',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6b7280',
    letterSpacing: 0.5,
  },
  communitiesContainer: {
    paddingHorizontal: 4,
    gap: 12,
  },
  chatsContainer: {
    backgroundColor: '#f4f4f5',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeButton: {
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  archiveButton: {
    backgroundColor: '#E0F2FE',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  swipeButtonText: {
    color: '#111827',
    fontWeight: '700',
    fontSize: 13,
  },
  unreadBadge: {
    position: 'absolute',
    top: 10,
    right: 16,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
});

