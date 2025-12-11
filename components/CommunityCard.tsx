import { theme } from '@/constants/theme';
import React from 'react';
import { Image, ImageStyle, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Community } from '../data/discussions';

interface CommunityCardProps {
  community: Community;
  onPress: () => void;
  onJoinToggle?: () => void;
  onInfo?: () => void;
  isMember?: boolean;
  notificationsOn?: boolean;
  onToggleNotifications?: () => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onPress,
  onJoinToggle,
  onInfo,
  isMember,
  notificationsOn,
  onToggleNotifications,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Image source={{ uri: community.coverImage }} style={styles.thumbnail} resizeMode="cover" />
        <View style={styles.contentContainer}>
          <Text style={styles.communityName} numberOfLines={1}>
            {community.name}
          </Text>
          <Text style={styles.memberInfo} numberOfLines={1}>
            {community.memberCount} • {community.activityStatus}
          </Text>
          {community.tags && (
            <Text style={styles.tags} numberOfLines={1}>
              {community.tags.join(' · ')}
            </Text>
          )}
        </View>

        {onJoinToggle && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onJoinToggle();
            }}
            style={[styles.joinButton, isMember ? styles.joined : styles.notJoined]}
            activeOpacity={0.7}
          >
            <Text style={isMember ? styles.joinedText : styles.notJoinedText}>{isMember ? 'Quitter' : 'Rejoindre'}</Text>
          </TouchableOpacity>
        )}

        {onInfo && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onInfo();
            }}
            style={styles.infoButton}
            activeOpacity={0.7}
          >
            <Text style={styles.infoText}>i</Text>
          </TouchableOpacity>
        )}

        {notificationsOn !== undefined && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onToggleNotifications && onToggleNotifications();
            }}
            style={styles.notifButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.notifText, notificationsOn && styles.notifTextOn]}>
              {notificationsOn ? 'Notif' : 'Off'}
            </Text>
            <View style={[styles.statusDot, notificationsOn ? styles.statusOn : styles.statusOff]} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    marginHorizontal: 16,
    marginBottom: 10,
    height: 95,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: theme.colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: theme.colors.accentLight,
    marginRight: 12,
  } as ImageStyle,
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  communityName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  } as TextStyle,
  memberInfo: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  } as TextStyle,
  tags: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  } as TextStyle,
  joinButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  joined: {
    backgroundColor: '#E0F2FE',
  },
  notJoined: {
    backgroundColor: theme.colors.accent,
  },
  joinedText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  notJoinedText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  infoButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginLeft: 8,
  },
  infoText: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  notifButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginLeft: 6,
  },
  notifText: { fontSize: 11, fontWeight: '700', color: theme.colors.textSecondary },
  notifTextOn: { color: theme.colors.accent },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: theme.colors.card,
  },
  statusOn: {
    backgroundColor: theme.colors.accent,
  },
  statusOff: {
    backgroundColor: theme.colors.border,
  },
});
