import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';

const challenges = [
  {
    id: 'c1',
    title: '5 min de respiration',
    description: 'Respiration guidee pour calmer le stress',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'c2',
    title: '3 choses positives',
    description: 'Note trois gratitudes de ta journee',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1529333166433-0410f37f6e9d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'c3',
    title: 'Pause 10 minutes',
    description: 'Fais une pause sans ecran et respire',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80',
  },
];

export default function ChallengesScreen() {
  const router = useRouter();

  const goTo = (id: string) => {
    const target = id === 'c1' ? '/challenge-details' : id === 'c2' ? '/challenge-gratitude' : '/challenge-pause';
    router.push(target as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.backward" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Tous les defis</Text>
          <View style={{ width: 40 }} />
        </View>

        {challenges.map((c, idx) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.challengeRow, idx === challenges.length - 1 && { borderBottomWidth: 0 }]}
            activeOpacity={0.85}
            onPress={() => goTo(c.id)}
          >
            <Image source={{ uri: c.image }} style={styles.challengeImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.challengeTitle}>{c.title}</Text>
              <Text style={styles.challengeDescription}>{c.description}</Text>
            </View>
            {c.isNew && <Text style={styles.badge}>Nouveau</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 24 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
  },
  title: { fontSize: 20, fontWeight: '800', color: theme.colors.textPrimary },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31,42,68,0.06)',
  },
  challengeImage: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#ccc' },
  challengeTitle: { fontWeight: '700', color: theme.colors.textPrimary, fontSize: 15 },
  challengeDescription: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 },
  badge: {
    backgroundColor: '#A5C9FF',
    color: '#1F2A44',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '700',
    fontSize: 12,
  },
});
