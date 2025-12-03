import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ExternalLink } from '../components/external-link';

interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  image?: string;
  progress?: number; // 0..100
  category?: string;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration?: string;
}

export default function ActivitiesVideosStandalone() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tout');

  useEffect(() => {
    loadLibrary();
    loadFavorites();
  }, []);

  const loadLibrary = () => {
    setActivities([
      {
        id: 'a1',
        title: 'Série de yoga matinal pour la clarté mentale',
        description: "Commencez votre journée avec cette série de yoga douce conçue pour apaiser l'esprit et renforcer la concentration.",
        duration: 15,
        image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=60',
        progress: 70,
        category: 'zen'
      },
      {
        id: 'a2',
        title: 'Méditation guidée pour le sommeil profond',
        description: "Une méditation apaisante pour vous aider à vous détendre et glisser vers un sommeil réparateur.",
        duration: 12,
        image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=1200&q=60',
        progress: 30,
        category: 'sans énergie'
      },
      {
        id: 'a3',
        title: 'Respiration 4-7-8 (exercice rapide)',
        description: 'Technique simple pour réduire l\'anxiété en quelques minutes.',
        duration: 5,
        image: 'https://images.unsplash.com/photo-1526403224745-9b3a6b3d1b98?auto=format&fit=crop&w=1200&q=60',
        progress: 10,
        category: 'anxieux'
      }
    ]);

    setVideos([
      {
        id: 'v1',
        title: 'Les bienfaits de la pleine conscience au quotidien',
        description: 'Découvrez comment intégrer des pratiques de pleine conscience pour réduire le stress et améliorer la qualité de vie.',
        youtubeId: 'pVHUv2sZ8k8',
        duration: '15 min'
      },
      {
        id: 'v2',
        title: "Gérer l'anxiété : techniques et stratégies",
        description: "Apprenez des techniques efficaces pour faire face à l'anxiété et retrouver un sentiment de contrôle.",
        youtubeId: 'ZToicYcHIOU',
        duration: '22 min'
      }
    ]);
  };

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('mindly-activities-favorites');
      if (stored) setFavorites(JSON.parse(stored));
    } catch (e) {
      console.error('Erreur chargement favoris:', e);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
      setFavorites(next);
      await AsyncStorage.setItem('mindly-activities-favorites', JSON.stringify(next));
    } catch (e) {
      console.error('Erreur sauvegarde favoris:', e);
    }
  };

  const startActivity = (activity: Activity) => {
    Alert.alert(activity.title, `${activity.description}\n\nDurée : ${activity.duration} min`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Commencer', onPress: () => Alert.alert('Démarré', `Activité "${activity.title}" lancée.`) }
    ]);
  };

  const openYoutube = (youtubeId: string) => {
    const url = `https://www.youtube.com/watch?v=${youtubeId}`;
    return (
      <ExternalLink href={url} style={styles.openButton}>
        <Text style={styles.openButtonText}>Voir</Text>
      </ExternalLink>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activités & Vidéos</Text>
        <Text style={styles.subtitle}>Petites actions pour votre bien-être</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchWrap}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher des activités ou vidéos..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {['Tout', 'anxieux', 'sans énergie', 'triste', 'zen'].map(chip => (
            <TouchableOpacity
              key={chip}
              style={[styles.chip, selectedFilter === chip && styles.chipActive]}
              onPress={() => setSelectedFilter(chip)}
            >
              <Text style={[styles.chipText, selectedFilter === chip && styles.chipTextActive]}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Activités guidées</Text>
        <View style={{ gap: 12 }}>
          {activities
            .filter(a => selectedFilter === 'Tout' ? true : (a.category ?? '').toLowerCase() === selectedFilter.toLowerCase())
            .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(act => (
            <View key={act.id} style={styles.activityCard}>
              {act.image ? (
                <Image source={{ uri: act.image }} style={styles.activityImage} />
              ) : null}
              <View style={styles.activityBody}>
                <Text style={styles.activityTitle}>{act.title}</Text>
                <Text style={styles.activityDesc} numberOfLines={3}>{act.description}</Text>

                <View style={styles.progressRow}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${act.progress ?? 0}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{act.progress ?? 0}%</Text>
                </View>

                <TouchableOpacity style={styles.continueBtn} onPress={() => startActivity(act)}>
                  <Text style={styles.continueBtnText}>{(act.progress ?? 0) > 0 ? "Continuer l'activité" : "Commencer l'activité"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Vidéos populaires</Text>
        <View style={{ gap: 12 }}>
          {videos
            .filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.description.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(video => (
            <View key={video.id} style={styles.videoListCard}>
              <Image source={{ uri: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg` }} style={styles.videoThumb} />
              <View style={styles.videoMeta}>
                <Text style={styles.videoTag}>🎬 Vidéo • {video.duration ?? '—'}</Text>
                <Text style={styles.videoTitleList}>{video.title}</Text>
                <Text style={styles.videoDescList} numberOfLines={2}>{video.description}</Text>
                <View style={styles.videoActionsRow}>
                  {openYoutube(video.youtubeId)}
                  <TouchableOpacity onPress={() => toggleFavorite(video.id)}>
                    <Text style={styles.favorite}>{favorites.includes(video.id) ? '❤️' : '🤍'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Articles récents</Text>
        <View style={{ gap: 12, marginBottom: 30 }}>
          <View style={styles.articleCard}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=60' }} style={styles.articleImage} />
            <View style={styles.articleBody}>
              <Text style={styles.articleTag}>📝 Article</Text>
              <Text style={styles.articleTitle}>L'importance de la gratitude dans votre bien-être</Text>
              <Text style={styles.articleDesc} numberOfLines={2}>Un article explorant comment la pratique de la gratitude peut transformer votre perspective et améliorer votre santé mentale.</Text>
            </View>
          </View>

          <View style={styles.articleCard}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1200&q=60' }} style={styles.articleImage} />
            <View style={styles.articleBody}>
              <Text style={styles.articleTag}>📝 Article</Text>
              <Text style={styles.articleTitle}>Marcher en pleine nature : une thérapie gratuite</Text>
              <Text style={styles.articleDesc} numberOfLines={2}>Découvrez les multiples vertus des promenades en nature pour apaiser l'esprit et revitaliser le corps.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#4f46e5',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  content: { flex: 1, padding: 15 },
  searchWrap: { marginBottom: 12 },
  searchInput: { backgroundColor: 'white', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 },
  chips: { marginBottom: 12 },
  chip: { backgroundColor: 'white', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  chipActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
  chipText: { color: '#6b7280', fontWeight: '500' },
  chipTextActive: { color: 'white' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 10, marginBottom: 10, color: '#111827' },
  activityCard: { backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2, flexDirection: 'row' },
  activityImage: { width: 120, height: 120 },
  activityBody: { flex: 1, padding: 12 },
  activityTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  activityDesc: { color: '#6b7280', marginTop: 6 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  progressBar: { flex: 1, height: 8, backgroundColor: '#e6eef7', borderRadius: 8, marginRight: 8, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#10b981' },
  progressText: { width: 40, color: '#6b7280' },
  continueBtn: { marginTop: 10, backgroundColor: '#10b981', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  continueBtnText: { color: 'white', fontWeight: '700' },
  videoListCard: { backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2, flexDirection: 'row' },
  videoThumb: { width: 140, height: 90 },
  videoMeta: { flex: 1, padding: 12 },
  videoTag: { color: '#6b7280', fontSize: 12 },
  videoTitleList: { fontSize: 15, fontWeight: '700', marginTop: 6, color: '#111827' },
  videoDescList: { color: '#6b7280', marginTop: 6 },
  videoActionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  openButton: { backgroundColor: '#4f46e5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 12 },
  openButtonText: { color: 'white', fontWeight: '600' },
  favorite: { fontSize: 18 },
  articleCard: { backgroundColor: 'white', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 2, flexDirection: 'row' },
  articleImage: { width: 120, height: 100 },
  articleBody: { flex: 1, padding: 12 },
  articleTag: { color: '#6b7280', fontSize: 12 },
  articleTitle: { fontSize: 15, fontWeight: '700', marginTop: 6 },
  articleDesc: { color: '#6b7280', marginTop: 6 }
});
