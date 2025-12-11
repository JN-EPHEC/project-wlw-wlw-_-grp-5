import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '@/constants/theme';
import { ConversationPreview, MessageRequest } from '../data/messagingTypes';

interface ChatPreviewCardProps {
  conversation?: ConversationPreview;
  request?: MessageRequest;
  onPress?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

export const EnhancedChatPreviewCard: React.FC<ChatPreviewCardProps> = ({
  conversation,
  request,
  onPress,
  onAccept,
  onReject,
}) => {
  if (request) {
    return (
      <View style={styles.requestCard}>
        <View style={styles.requestRow}>
          <Image source={{ uri: request.fromImage }} style={styles.profileImage} />
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.contactName} numberOfLines={1}>
                {request.fromName}
              </Text>
              <View style={styles.requestBadge}>
                <Text style={styles.requestBadgeText}>Demande</Text>
              </View>
            </View>
            <Text style={styles.requestMessage}>
              Souhaite démarrer une conversation
            </Text>
            <Text style={styles.timestamp}>
              {formatTime(request.createdAt)}
            </Text>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={onReject}
            activeOpacity={0.7}
          >
            <Text style={styles.rejectButtonText}>Refuser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={onAccept}
            activeOpacity={0.7}
          >
            <Text style={styles.acceptButtonText}>Accepter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!conversation) return null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Image
          source={{ uri: conversation.otherParticipantImage }}
          style={styles.profileImage}
        />
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.contactName} numberOfLines={1}>
              {conversation.otherParticipantName}
            </Text>
            <Text style={styles.timestamp}>
              {formatTime(conversation.lastMessageAt)}
            </Text>
          </View>
          <View style={styles.messageRow}>
            <Text
              style={[
                styles.lastMessage,
                conversation.unreadCount > 0 ? styles.unreadMessage : undefined,
              ]}
              numberOfLines={1}
            >
              {conversation.lastMessage || 'Pas de messages'}
            </Text>
            {conversation.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const formatTime = (date?: Date): string => {
  if (!date) return '';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `${diffDays}j`;

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  requestCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    shadowColor: theme.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.accentLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accentLight,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  badge: {
    backgroundColor: theme.colors.badgeBg,
    borderRadius: theme.radius.badge,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: theme.colors.badgeText,
    fontSize: 12,
    fontWeight: '600',
  },
  requestBadge: {
    backgroundColor: theme.colors.badgeBg,
    borderRadius: theme.radius.badge,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  requestBadgeText: {
    color: theme.colors.badgeText,
    fontSize: 12,
    fontWeight: '600',
  },
  requestMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: theme.colors.buttonSecondaryBg,
  },
  acceptButton: {
    backgroundColor: theme.colors.accent,
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
