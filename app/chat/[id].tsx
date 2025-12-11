import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { communityStore } from '../../data/communityStore';
import { mockCommunities } from '../../data/discussions';
import { messagingStore } from '../../data/messagingStore';

type MessageStatus = 'sent' | 'delivered' | 'seen';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isOwnMessage: boolean;
  status?: MessageStatus;
}

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const type = typeof params.type === 'string' ? params.type : id.length > 5 ? 'community' : 'private';
  const currentUserId = messagingStore.getCurrentUserId();

  let community: { id: string; name: string; coverImage: string; memberCount: string; activityStatus: string } | null = null;
  if (type === 'community' && id) {
    community = communityStore.getAllCommunities().find((c) => c.id === id) || null;
  }
  const initialName = community ? community.name : typeof params.name === 'string' ? params.name : 'Chat';
  const profileImage = type === 'private' ? 'https://i.pravatar.cc/150?img=1' : null;

  const flatListRef = useRef<FlatList<Message>>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'user-2',
      senderName: 'Marie Laurent',
      content: 'Salut ! Comment ca va ?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isOwnMessage: false,
    },
    {
      id: '2',
      senderId: currentUserId,
      senderName: 'Moi',
      content: 'Tres bien merci ! Et toi ?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      isOwnMessage: true,
      status: 'seen',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [otherUserId, setOtherUserId] = useState('');
  const [requestStatus, setRequestStatus] = useState<'accepted' | 'pending' | 'refused' | 'none'>('none');
  const [canSend, setCanSend] = useState(true);
  const [displayName, setDisplayName] = useState(initialName);

  useFocusEffect(
    useCallback(() => {
      if (type === 'private' && id) {
        const conversation = messagingStore.getConversationById(id);
        if (conversation) {
          const otherId = conversation.participants.find((p) => p !== currentUserId) || conversation.participants[0];
          const otherIndex = conversation.participants.indexOf(otherId);
          const otherName = conversation.participantNames[otherIndex] || initialName;
          setOtherUserId(otherId);
          setDisplayName(otherName);
          setRequestStatus('accepted');
          setCanSend(true);

          const messagesWithStatus = conversation.messages.map((msg) => ({
            id: msg.id,
            senderId: msg.senderId,
            senderName: msg.senderId === currentUserId ? 'Moi' : otherName,
            content: msg.content,
            timestamp: msg.createdAt,
            isOwnMessage: msg.senderId === currentUserId,
            status: msg.status as MessageStatus,
          }));
          setMessages(messagesWithStatus);
        }
      }

      const unsubscribe = messagingStore.subscribe(() => {
        if (type === 'private' && id) {
          const conversation = messagingStore.getConversationById(id);
          if (conversation) {
            const otherId = conversation.participants.find((p) => p !== currentUserId) || conversation.participants[0];
            const otherIndex = conversation.participants.indexOf(otherId);
            const otherName = conversation.participantNames[otherIndex] || displayName;
            setOtherUserId(otherId);
            setDisplayName(otherName);
            setRequestStatus('accepted');
            setCanSend(true);

            const messagesWithStatus = conversation.messages.map((msg) => ({
              id: msg.id,
              senderId: msg.senderId,
              senderName: msg.senderId === currentUserId ? 'Moi' : otherName,
              content: msg.content,
              timestamp: msg.createdAt,
              isOwnMessage: msg.senderId === currentUserId,
              status: msg.status as MessageStatus,
            }));
            setMessages(messagesWithStatus);
          }
        }
      });

      return () => unsubscribe();
    }, [id, type, initialName, currentUserId, displayName])
  );

  useEffect(() => {
    if (type !== 'private') {
      setRequestStatus('accepted');
      setCanSend(true);
      return;
    }

    const conversation = id ? messagingStore.getConversationById(id) : null;
    if (conversation) {
      const otherId = conversation.participants.find((p) => p !== currentUserId) || conversation.participants[0];
      setOtherUserId(otherId);
      setRequestStatus('accepted');
      setCanSend(true);
      return;
    }

    const paramOther = typeof params.otherUserId === 'string' ? params.otherUserId : '';
    const targetId = otherUserId || paramOther;
    if (targetId && !otherUserId) {
      setOtherUserId(targetId);
    }

    const req = targetId ? messagingStore.getRequestWith(targetId) : undefined;
    const status = req?.status ?? 'none';
    setRequestStatus(status as any);
    setCanSend(status === 'accepted');
  }, [id, type, params, otherUserId, currentUserId]);

  const formatTime = (date: Date) => date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const getStatusColor = (status?: MessageStatus) => {
    if (status === 'seen') return theme.colors.accent;
    return theme.colors.accentLight;
  };

  const getStatusIcon = (status?: MessageStatus) => {
    switch (status) {
      case 'sent':
        return 'v';
      case 'delivered':
        return 'vv';
      case 'seen':
        return 'vv';
      default:
        return '';
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !canSend) return;

    if (type === 'private' && id) {
      messagingStore.sendMessage(id, newMessage.trim());
      setNewMessage('');
    } else {
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: 'Moi',
        content: newMessage.trim(),
        timestamp: new Date(),
        isOwnMessage: true,
        status: 'sent',
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, status: 'delivered' } : m)));
      }, 700);
      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, status: 'seen' } : m)));
      }, 1500);
    }

    requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
  };

  const handleLongPress = (message: Message) => {
    if (!message.isOwnMessage) {
      setSelectedMessage(message);
      setShowReportModal(true);
    }
  };

  const handleReport = () => {
    if (reportReason.trim()) {
      Alert.alert('Message signale', 'Merci pour votre signalement. Notre equipe va examiner ce message.', [
        {
          text: 'OK',
          onPress: () => {
            setShowReportModal(false);
            setSelectedMessage(null);
            setReportReason('');
          },
        },
      ]);
    }
  };

  const handleDeleteConversation = () => {
    Alert.alert('Supprimer la conversation', 'Etes-vous sur de vouloir supprimer cette conversation ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          setShowOptionsMenu(false);
          router.back();
          Alert.alert('Conversation supprimee', 'La conversation a ete supprimee.');
        },
      },
    ]);
  };

  const handleBlockUser = () => {
    Alert.alert('Bloquer cet utilisateur', `Etes-vous sur de vouloir bloquer ${displayName} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Bloquer',
        style: 'destructive',
        onPress: () => {
          setShowOptionsMenu(false);
          router.back();
          Alert.alert('Utilisateur bloque', `${displayName} a ete bloque.`);
        },
      },
    ]);
  };

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setMessages((prev) => [
        {
          id: 'old-' + Date.now(),
          senderId: 'user-2',
          senderName: 'Marie Laurent',
          content: 'Message plus ancien...',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          isOwnMessage: false,
        },
        ...prev,
      ]);
      setIsLoadingMore(false);
    }, 700);
  };

  const reportReasons = ['Contenu inapproprie', 'Harcelement', 'Spam', 'Desinformation', 'Violence', 'Autre'];

  const headerContent = useMemo(
    () => (
      <TouchableOpacity style={{ alignSelf: 'center', padding: 8 }} onPress={loadMore} disabled={isLoadingMore}>
        <Text style={{ color: theme.colors.accent, fontWeight: '600' }}>
          {isLoadingMore ? 'Chargement...' : 'Charger plus'}
        </Text>
      </TouchableOpacity>
    ),
    [isLoadingMore]
  );

  const requestBanner =
    type === 'private' && requestStatus !== 'accepted' ? (
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: '#FFF7E6',
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}
      >
        <Text style={{ color: '#B45309', fontWeight: '700' }}>
          {requestStatus === 'pending'
            ? 'Demande en attente : envoi bloque jusqu a acceptation.'
            : requestStatus === 'refused'
            ? 'Demande refusee : vous ne pouvez pas envoyer de messages.'
            : 'Demande requise avant de discuter.'}
        </Text>
      </View>
    ) : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[theme.colors.headerGradient[0], theme.colors.headerGradient[1]]}
        start={[0, 0]}
        end={[1, 1]}
        style={{
          paddingTop: 0,
          paddingBottom: 24,
          paddingHorizontal: 0,
          borderBottomLeftRadius: theme.radius.card,
          borderBottomRightRadius: theme.radius.card,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, color: '#fff', fontWeight: '700' }}>{'<'}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            {type === 'community' && community ? (
              <View style={{ alignItems: 'center' }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, overflow: 'hidden', marginBottom: 4, backgroundColor: theme.colors.accentLight }}>
                  <Image source={{ uri: community.coverImage }} style={{ width: 44, height: 44 }} />
                </View>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }} numberOfLines={1}>
                  {community.name}
                </Text>
                <Text style={{ fontSize: 13, color: theme.colors.accentLight }}>
                  {community.memberCount} - {community.activityStatus}
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {profileImage && (
                  <View style={{ width: 44, height: 44, borderRadius: 22, overflow: 'hidden', backgroundColor: theme.colors.accentLight }}>
                    <Image source={{ uri: profileImage }} style={{ width: 44, height: 44 }} />
                  </View>
                )}
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#fff' }} numberOfLines={1}>
                    {displayName}
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View style={{ width: 40, alignItems: 'center', justifyContent: 'center' }}>
            {type === 'community' ? (
              <TouchableOpacity
                onPress={() => router.push({ pathname: '/(tabs)/community/[id]/members', params: { id } } as any)}
                activeOpacity={0.7}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colors.accent,
                  borderRadius: 20,
                  shadowColor: theme.colors.accentLight,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 4,
                }}
                accessibilityRole="button"
                accessibilityLabel="Voir les membres"
              >
                <IconSymbol name="person.2.fill" size={24} color={'#fff'} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => setShowOptionsMenu(true)}
                activeOpacity={0.7}
                style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}
                accessibilityRole="button"
                accessibilityLabel="Options"
              >
                <Text style={{ fontSize: 20, color: '#fff', fontWeight: '700' }}>•••</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {requestBanner}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <TouchableOpacity
              onLongPress={() => handleLongPress(item)}
              activeOpacity={0.7}
              style={{ marginBottom: 12, alignItems: item.isOwnMessage ? 'flex-end' : 'flex-start', marginHorizontal: 12 }}
            >
              <View
                style={{
                  maxWidth: '75%',
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: theme.radius.bubble,
                  backgroundColor: item.isOwnMessage ? theme.colors.bubbleSent : theme.colors.bubbleReceived,
                  shadowColor: theme.colors.bubbleShadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                {!item.isOwnMessage && type === 'community' && (
                  <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.accent, marginBottom: 4 }}>
                    {item.senderName}
                  </Text>
                )}
                <Text style={{ fontSize: 15, lineHeight: 20, color: item.isOwnMessage ? '#fff' : theme.colors.textPrimary }}>
                  {item.content}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, justifyContent: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: item.isOwnMessage ? theme.colors.accentLight : theme.colors.textSecondary,
                    }}
                  >
                    {formatTime(item.timestamp)}
                  </Text>
                  {item.isOwnMessage && item.status && (
                    <Text style={{ fontSize: 11, marginLeft: 4, color: getStatusColor(item.status) }}>
                      {getStatusIcon(item.status)} {item.status === 'seen' ? 'Vu' : item.status === 'delivered' ? 'Livre' : 'Envoye'}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={headerContent}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 12,
            paddingVertical: 10,
            backgroundColor: theme.colors.card,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              backgroundColor: theme.colors.background,
              borderRadius: theme.radius.input,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 16,
              color: theme.colors.textPrimary,
              maxHeight: 100,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
            placeholder={canSend ? 'Message...' : 'En attente d acceptation'}
            placeholderTextColor={theme.colors.textSecondary}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
            maxLength={500}
            editable={canSend}
          />
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: canSend && newMessage.trim() ? theme.colors.accent : theme.colors.accentLight,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 8,
              shadowColor: theme.colors.accentLight,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 2,
            }}
            onPress={handleSendMessage}
            disabled={!canSend || !newMessage.trim()}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 18, color: '#fff', fontWeight: '700' }}>Env</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showReportModal} transparent animationType="slide" onRequestClose={() => setShowReportModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Signaler ce message</Text>
            <Text style={styles.modalSubtitle}>Pourquoi signalez-vous ce message ?</Text>
            {reportReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.reasonButton, reportReason === reason && styles.reasonButtonSelected]}
                onPress={() => setReportReason(reason)}
                activeOpacity={0.7}
              >
                <Text style={[styles.reasonButtonText, reportReason === reason && styles.reasonButtonTextSelected]}>{reason}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowReportModal(false);
                  setReportReason('');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.reportButton, !reportReason && styles.reportButtonDisabled]}
                onPress={handleReport}
                disabled={!reportReason}
                activeOpacity={0.7}
              >
                <Text style={styles.reportButtonText}>Signaler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showOptionsMenu} transparent animationType="fade" onRequestClose={() => setShowOptionsMenu(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowOptionsMenu(false)}>
          <View style={styles.optionsMenuContent}>
            <TouchableOpacity style={styles.optionButton} onPress={handleDeleteConversation} activeOpacity={0.7}>
              <Text style={styles.optionIcon}>X</Text>
              <Text style={styles.optionButtonText}>Supprimer la conversation</Text>
            </TouchableOpacity>
            <View style={styles.optionDivider} />
            <TouchableOpacity style={styles.optionButton} onPress={handleBlockUser} activeOpacity={0.7}>
              <Text style={styles.optionIcon}>!</Text>
              <Text style={[styles.optionButtonText, { color: '#EF4444' }]}>Bloquer {displayName}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  modalSubtitle: { fontSize: 15, color: '#6B7280', marginBottom: 20 },
  reasonButton: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#F3F4F6', marginBottom: 10 },
  reasonButtonSelected: { backgroundColor: '#DBEAFE', borderWidth: 2, borderColor: '#3B82F6' },
  reasonButtonText: { fontSize: 16, color: '#1F2937' },
  reasonButtonTextSelected: { color: '#3B82F6', fontWeight: '600' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F3F4F6' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  reportButton: { backgroundColor: '#EF4444' },
  reportButtonDisabled: { backgroundColor: '#FCA5A5' },
  reportButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  optionsMenuContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 80,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  optionIcon: { fontSize: 18, marginRight: 12 },
  optionButtonText: { fontSize: 16, fontWeight: '500', color: '#1F2937' },
  optionDivider: { height: 1, backgroundColor: '#E5E7EB' },
});
