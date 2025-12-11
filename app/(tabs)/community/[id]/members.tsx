import { theme } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { communityStore } from '../../../../data/communityStore';
import { Member, mockCommunities } from '../../../../data/discussions';
import { dmStore } from '../../../../data/dmStore';

export default function MembersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [communityName, setCommunityName] = useState<string>('');

  useEffect(() => {
    const created = communityStore.getCommunities();
    const community = created.find(c => String(c.id) === String(id)) || mockCommunities.find(c => String(c.id) === String(id));
    setCommunityName(community?.name ?? '');
    if (community?.members && community.members.length > 0) {
      setMembers(community.members);
    } else {
      setMembers([
        { id: 'u1', name: 'Alice', profileImage: 'https://i.pravatar.cc/150?img=11' },
        { id: 'u2', name: 'Bob', profileImage: 'https://i.pravatar.cc/150?img=12' },
        { id: 'u3', name: 'Charlie', profileImage: 'https://i.pravatar.cc/150?img=13' },
      ]);
    }
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        Membres • {communityName} ({members.length})
      </Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <Image 
              source={{ uri: item.profileImage }} 
              style={styles.profileImage}
            />
            <Text style={styles.memberName}>{item.name}</Text>
            <TouchableOpacity
              onPress={() => {
                dmStore.addRequest({
                  contactName: item.name,
                  profileImage: item.profileImage,
                  lastMessage: 'Nouvelle demande de discussion',
                });
                router.back();
              }}
              style={styles.dmButton}
            >
              <Text style={styles.dmButtonText}>Demander DM</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F6FA',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1F2A44',
  },
  memberCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 8,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  memberName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2A44',
  },
  dmButton: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
