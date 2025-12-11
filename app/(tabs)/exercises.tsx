import React, { useMemo, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { theme } from '@/constants/theme';

const filters = ['Tout', 'Anxieux', 'Sans energie', 'Stresse', 'Concentration', 'Sommeil', 'Routine du matin', 'Routine du soir'];

const guidedActivities = [
  {
    id: 'g1',
    title: 'Yoga matinal pour la clarte mentale',
    description: 'Yoga doux au lever du soleil pour apaiser l esprit et renforcer la concentration.',
    duration: '5-7 min',
    progress: 70,
    cta: 'Continuer l activite',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    steps: ['Respiration d ancrage', 'Etirements doux', 'Postures fluides', 'Relaxation finale'],
    message: 'Bien joue, tu as reveille ton corps en douceur.',
    focus: 'concentration',
  },
  {
    id: 'g2',
    title: 'Meditation anti-anxiete (5 min)',
    description: 'Une meditation courte et guidee pour apaiser les tensions mentales.',
    duration: '5 min',
    progress: 40,
    cta: 'Commencer',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    steps: ['Respiration lente', 'Visualisation', 'Accueil des emotions', 'Affirmation finale'],
    focus: 'anxieux',
  },
  {
    id: 'g3',
    title: 'Boost d energie rapide (3 min)',
    description: 'Routine express pour retrouver ton energie en quelques minutes.',
    duration: '3 min',
    progress: 20,
    cta: 'Lancer le boost',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    focus: 'sans energie',
  },
  {
    id: 'g4',
    title: 'Decompression apres les cours / travail',
    description: 'Libere la pression accumulee et relache le mental.',
    duration: '6 min',
    progress: 0,
    cta: 'Commencer',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    focus: 'stresse',
  },
  {
    id: 'g5',
    title: 'Mini-journal guide',
    description: 'Reponds a trois questions simples pour clarifier ton esprit.',
    duration: '4 min',
    progress: 0,
    cta: 'Ouvrir',
    image: 'https://images.unsplash.com/photo-1529333166433-0410f37f6e9d?auto=format&fit=crop&w=800&q=80',
    focus: 'routine du soir',
    steps: ['Question 1: Comment te sens-tu ?', 'Question 2: Qu est-ce qui t a fait du bien ?', 'Question 3: Que veux-tu pour demain ?'],
  },
  {
    id: 'g6',
    title: 'Scan corporel anti-stress',
    description: 'Relache les tensions a travers un scan corporel guide.',
    duration: '6 min',
    progress: 0,
    cta: 'Commencer',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    focus: 'stresse',
    steps: ['Respiration lente', 'Scanner tete -> pieds', 'Relacher chaque zone', 'Conclusion calme'],
  },
];

const popularVideos = [
  {
    id: 'v1',
    title: 'Les bienfaits de la pleine conscience au quotidien',
    duration: '13 min',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v2',
    title: 'Gerer l anxiete : techniques et strategies',
    duration: '22 min',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'v3',
    title: 'Retrouver de l energie naturellement',
    duration: '9 min',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
  },
];

const articles = [
  {
    id: 'art1',
    title: 'L importance de la gratitude dans votre bien-etre',
    image: 'https://images.unsplash.com/photo-1521193085-029f1163c1c1?auto=format&fit=crop&w=800&q=80',
    type: 'Article',
  },
  {
    id: 'art2',
    title: 'Marcher en pleine nature : une therapie gratuite',
    image: 'https://images.unsplash.com/photo-1506784881475-0e408bbca849?auto=format&fit=crop&w=800&q=80',
    type: 'Article',
  },
  {
    id: 'art3',
    title: 'Comprendre et apaiser la surcharge mentale',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    type: 'Article',
  },
  {
    id: 'art4',
    title: 'Construire une routine bien-etre efficace',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
    type: 'Article',
  },
];

export default function ExercisesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Tout');
  const filteredGuided = useMemo(() => {
    if (activeFilter === 'Tout') return guidedActivities;
    return guidedActivities.filter((a) => a.focus?.toLowerCase().includes(activeFilter.toLowerCase().split(' ')[0]));
  }, [activeFilter]);

  const renderFilter = (label: string) => {
    const active = activeFilter === label;
    return (
      <TouchableOpacity
        key={label}
        style={[styles.filterChip, active && styles.filterChipActive]}
        onPress={() => setActiveFilter(label)}
        activeOpacity={0.8}
      >
        <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Activites</Text>
        <Text style={styles.subtitle}>
          Explore des routines, exercices et ressources concus pour ton bien-etre. Prends soin de toi a ton rythme. 💙
        </Text>

        <View style={styles.filtersRow}>{filters.map(renderFilter)}</View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activites guidees</Text>
          <Text style={styles.sectionSubtitle}>Des exercices simples, rapides et efficaces.</Text>
        </View>
        {filteredGuided.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.meta}>{item.duration}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            {typeof item.progress === 'number' && (
              <View style={styles.progressRow}>
                <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
                <Text style={styles.progressText}>Progression : {item.progress}%</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => router.push(`/activity/${item.id}` as any)}
            >
              <Text style={styles.primaryButtonText}>{item.cta}</Text>
            </TouchableOpacity>
            {item.steps && (
              <View style={{ marginTop: 10 }}>
                {item.steps.map((s, idx) => (
                  <Text key={s} style={styles.bullet}>{`• ${s}`}</Text>
                ))}
                {item.message && <Text style={styles.insight}>{item.message}</Text>}
              </View>
            )}
          </View>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Videos populaires</Text>
          <Text style={styles.sectionSubtitle}>Apprends, decouvre, respire.</Text>
        </View>
        {popularVideos.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.meta}>Video · {item.duration}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
              <Text style={styles.secondaryText}>Ajouter a ma liste</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Articles recents</Text>
          <Text style={styles.sectionSubtitle}>Reste inspire grâce a des lectures courtes.</Text>
        </View>
        {articles.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.meta}>{item.type || 'Article'}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Suggestions pour toi</Text>
          <Text style={styles.cardDescription}>
            Tu sembles un peu stresse aujourd hui → Meditation anti-anxiete (5 min)
          </Text>
          <Text style={styles.cardDescription}>
            Tu manques d energie → Boost d energie rapide (3 min)
          </Text>
          <Text style={styles.cardDescription}>
            Tu as aime l article sur la gratitude → Mini-journal guide
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 24 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 6 },
  subtitle: { color: theme.colors.textSecondary, fontSize: 14, lineHeight: 20, marginBottom: 12 },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#fff',
  },
  filterChipActive: { backgroundColor: theme.colors.accentLight, borderColor: theme.colors.accent },
  filterText: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: theme.colors.textPrimary },
  sectionHeader: { marginTop: 6, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary },
  sectionSubtitle: { fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  image: { width: '100%', height: 150, borderRadius: 12, marginBottom: 10 },
  meta: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 6 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 4 },
  cardDescription: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: 6 },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressBar: { height: 6, borderRadius: 4, backgroundColor: theme.colors.accent },
  progressText: { fontSize: 12, color: theme.colors.textSecondary },
  primaryButton: { backgroundColor: theme.colors.accent, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  secondaryText: { color: theme.colors.textPrimary, fontWeight: '700' },
  bullet: { color: theme.colors.textSecondary, fontSize: 13 },
  insight: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 6 },
});
