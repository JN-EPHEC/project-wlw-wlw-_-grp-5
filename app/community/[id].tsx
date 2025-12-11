import { theme } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { communityStore } from '../../data/communityStore';
import { Community } from '../../data/discussions';

export default function CommunityDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = typeof params.id === 'string' ? params.id : '';
  const community: Community | undefined = id ? communityStore.getCommunityById(id) : undefined;

  const isMember = id ? communityStore.isMember(id) : false;
  const notificationsOn = id ? communityStore.notificationsEnabled(id) : false;

  const handleJoinToggle = () => {
    if (!id) return;
    if (isMember) {
      communityStore.leaveCommunity(id);
    } else {
      communityStore.joinCommunity(id);
    }
  };

  const handleToggleNotifications = () => {
    if (!id) return;
    communityStore.toggleNotifications(id);
  };

  if (!community) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Communauté</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Communauté introuvable</Text>
          <Text style={styles.emptySubtitle}>Retournez à la liste et réessayez.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{community.name}</Text>
        <TouchableOpacity onPress={handleToggleNotifications} style={styles.notifButton}>
          <Text style={[styles.notifText, notificationsOn && styles.notifTextOn]}>
            {notificationsOn ? 'Notif on' : 'Notif off'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.coverWrapper}>
        <Image source={{ uri: community.coverImage }} style={styles.coverImage} />
        <View style={styles.coverOverlay}>
          <Text style={styles.coverTitle}>{community.name}</Text>
          <Text style={styles.coverSubtitle}>
            {community.memberCount} • {community.activityStatus}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {community.description && <Text style={styles.description}>{community.description}</Text>}
        {community.tags && community.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {community.tags.map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.joinButton, isMember ? styles.joined : styles.notJoined]}
          onPress={handleJoinToggle}
          activeOpacity={0.7}
        >
          <Text style={isMember ? styles.joinedText : styles.notJoinedText}>{isMember ? 'Quitter la communauté' : 'Rejoindre la communauté'}</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Membres</Text>
        </View>
        <FlatList
          data={community.members || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.memberRow}>
              <Image source={{ uri: item.profileImage }} style={styles.memberAvatar} />
              <Text style={styles.memberName}>{item.name}</Text>
              <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptySubtitle}>Aucun membre pour le moment.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backButtonText: { fontSize: 22, color: theme.colors.textPrimary },
  headerTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.textPrimary },
  notifButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: theme.colors.background },
  notifText: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary },
  notifTextOn: { color: theme.colors.accent },
  coverWrapper: { margin: 16, borderRadius: 16, overflow: 'hidden' },
  coverImage: { width: '100%', height: 160, backgroundColor: theme.colors.accentLight },
  coverOverlay: { position: 'absolute', bottom: 12, left: 12 },
  coverTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  coverSubtitle: { color: '#F1F5F9', fontSize: 13, marginTop: 4 },
  content: { flex: 1, paddingHorizontal: 16 },
  description: { fontSize: 15, color: theme.colors.textPrimary, marginBottom: 12, lineHeight: 20 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tagPill: { backgroundColor: theme.colors.accentLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  tagText: { color: theme.colors.textPrimary, fontWeight: '600', fontSize: 12 },
  joinButton: { borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 20 },
  joined: { backgroundColor: '#E0F2FE' },
  notJoined: { backgroundColor: theme.colors.accent },
  joinedText: { color: theme.colors.textPrimary, fontWeight: '800' },
  notJoinedText: { color: '#fff', fontWeight: '800' },
  sectionHeader: { marginBottom: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  memberAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: theme.colors.accentLight },
  memberName: { flex: 1, fontSize: 15, color: theme.colors.textPrimary, fontWeight: '600' },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  emptyState: { padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center' },
});
