import { theme } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PrivateChat, formatTimestamp } from '../data/discussions';

interface ChatPreviewCardProps {
  chat: PrivateChat;
  onPress: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

export const ChatPreviewCard: React.FC<ChatPreviewCardProps> = ({ chat, onPress, onAccept, onReject }) => {
  if (chat.isPending) {
    return (
      <View style={styles.pendingCard}>
        <View style={styles.row}>
          <Image source={{ uri: chat.profileImage }} style={styles.profileImage} />
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.contactName}>{chat.contactName}</Text>
              <View style={styles.pendingBadge}>
                <Text style={styles.pendingBadgeText}>Demande en attente</Text>
              </View>
            </View>
            <Text style={styles.pendingMessage}>Ce contact souhaite discuter avec vous.</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={onReject}>
                <Text style={styles.rejectButtonText}>Refuser</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={onAccept}>
                <Text style={styles.acceptButtonText}>Accepter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Default non-pending preview card
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Image source={{ uri: chat.profileImage }} style={styles.profileImage} />
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.contactName} numberOfLines={1}>{chat.contactName}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(chat.timestamp)}</Text>
          </View>
          <View style={styles.messageRow}>
            <Text style={[styles.lastMessage, chat.unreadCount > 0 ? styles.unreadMessage : undefined]} numberOfLines={1}>
              {chat.lastMessage}
            </Text>
            {chat.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{chat.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pendingCard: {
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
  pendingBadge: {
    backgroundColor: theme.colors.badgeBg,
    borderRadius: theme.radius.badge,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendingBadgeText: {
    color: theme.colors.badgeText,
    fontSize: 12,
    fontWeight: '600',
  },
  pendingMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
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
