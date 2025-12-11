import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const palette = {
  background: theme.colors.background,
  card: theme.colors.card,
  textPrimary: theme.colors.textPrimary,
  textSecondary: theme.colors.textSecondary,
  accent: theme.colors.accent,
  accentDark: theme.colors.accentDark,
  accentLight: theme.colors.accentLight,
  border: theme.colors.border,
  shadow: theme.colors.bubbleShadow,
};

const moodOptions = [
  { key: 'Anxieux', label: 'Anxieux', icon: 'sad-outline', color: '#dc2626' },
  { key: 'Triste', label: 'Triste', icon: 'sad-outline', color: '#111827' },
  { key: 'Neutre', label: 'Neutre', icon: 'remove-outline', color: '#111827' },
  { key: 'Bien', label: 'Bien', icon: 'happy-outline', color: '#15803d' },
  { key: 'Super', label: 'Super', icon: 'sparkles-outline', color: '#15803d' },
] as const;

const emotionsList = ['Irritabilite', 'Sensibilite', 'Tristesse', 'Joie', 'Confiance', 'Colere'] as const;

const dailyChallenges = [
  {
    id: 'c1',
    title: '5 min de respiration',
    description: 'Respiration guidee pour calmer le stress',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=400&q=80', // respiration calme
  },
  {
    id: 'c2',
    title: '3 choses positives',
    description: 'Note trois gratitudes de ta journee',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1529333166433-0410f37f6e9d?auto=format&fit=crop&w=400&q=80', // journal/ecriture
  },
  {
    id: 'c3',
    title: 'Pause 10 minutes',
    description: 'Fais une pause sans ecran et respire',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80', // pause/detente
  },
];

const weeklyProgress = [
  { day: 'L', done: true, key: 'L1' },
  { day: 'Ma', done: true, key: 'Ma2' },
  { day: 'Me', done: false, key: 'Me3' },
  { day: 'J', done: true, key: 'J4' },
  { day: 'V', done: false, key: 'V5' },
  { day: 'S', done: false, key: 'S6' },
  { day: 'D', done: false, key: 'D7' },
];

const exerciseLibrary: Record<string, { id: string; title: string; duration: string; icon: string }[]> = {
  Tristesse: [
    { id: 'e1', title: 'Meditation douce', duration: '6 min', icon: 'sparkles' },
    { id: 'e2', title: 'Respiration 4-7-8', duration: '4 min', icon: 'wind' },
  ],
  Irritabilite: [
    { id: 'e3', title: 'Relachement musculaire', duration: '5 min', icon: 'figure.cooldown' },
    { id: 'e4', title: 'Balayage corporel', duration: '7 min', icon: 'waveform.path.ecg' },
  ],
  Joie: [{ id: 'e5', title: 'Journal de gratitude', duration: '5 min', icon: 'book' }],
  Confiance: [{ id: 'e6', title: 'Affirmations positives', duration: '4 min', icon: 'chatbubble' }],
  Colere: [{ id: 'e7', title: 'Exercice dancrage', duration: '6 min', icon: 'leaf' }],
  Sensibilite: [{ id: 'e8', title: 'Respiration coherente', duration: '5 min', icon: 'pulse' }],
};

const recommendedActivities = [
  { id: 'r1', title: 'Respiration 4-7-8', description: 'Apaise le stress en 3 minutes', tag: 'Rapide', icon: 'wind' },
  { id: 'r2', title: 'Meditation douce', description: 'Retrouve ton calme', tag: 'Focus', icon: 'sparkles' },
  { id: 'r3', title: 'Marche mindful', description: 'Ancrage et mouvement', tag: 'Energie', icon: 'walk' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, addMoodEntry, addAnxietyEntry } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string>('Bien');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [moodHistory, setMoodHistory] = useState<string[]>([]);
  const [averageMood, setAverageMood] = useState<string>('A calculer');
  const [streakText, setStreakText] = useState<string>('Streak en cours...');
  const [trendNote, setTrendNote] = useState<string>('Tendance a suivre');
  const [personalMessage, setPersonalMessage] = useState<string>('');
  const [badges, setBadges] = useState<string[]>([]);
  const [moodScore, setMoodScore] = useState<number>(7);
  const [energyScore, setEnergyScore] = useState<number>(6);
  const [stressScore, setStressScore] = useState<number>(3);
  const [journalNote, setJournalNote] = useState<string>('');

  const firstName = (user?.fullName || user?.displayName || 'Invite').split(' ')[0];
  const completedThisWeek = weeklyProgress.filter((d) => d.done).length;
  const communityActivity = 3; // placeholder
  const messagesSent = 12; // placeholder

  const exercises = useMemo(() => {
    const items: { id: string; title: string; duration: string; icon: string }[] = [];
    selectedEmotions.forEach((emotion) => {
      const list = exerciseLibrary[emotion];
      if (list) {
        list.forEach((ex) => {
          if (!items.find((i) => i.id === ex.id)) items.push(ex);
        });
      }
    });
    return items.slice(0, 4);
  }, [selectedEmotions]);

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions((prev) => (prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]));
  };

  const computeAverageMood = (history: string[]) => {
    if (history.length === 0) return 'A calculer';
    const weights: Record<string, number> = { Heureux: 5, Bien: 4, Neutre: 3, Triste: 2, Anxieux: 1 };
    const sum = history.reduce((acc, mood) => acc + (weights[mood] || 3), 0);
    const avg = sum / history.length;
    if (avg >= 4.5) return 'Heureux';
    if (avg >= 3.5) return 'Bien';
    if (avg >= 2.5) return 'Neutre';
    if (avg >= 1.5) return 'Triste';
    return 'Anxieux';
  };

  const computeStreak = (history: string[]) => {
    if (history.length === 0) return 'Commence une serie de bien-etre !';
    const last = history[history.length - 1];
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i] === last) streak += 1;
      else break;
    }
    return `Tu t es senti(e) ${last.toLowerCase()} ${streak} jour(s) de suite`;
  };

  const computeTrend = (mood: string) => {
    if (mood === 'Anxieux' || mood === 'Triste') return 'Tu sembles plus stresse(e) que d habitude';
    if (mood === 'Neutre') return 'Humeur stable, reste a l ecoute';
    return 'Belle dynamique, continue comme ca';
  };

  const computePersonalMessage = (mood: string) => {
    if (mood === 'Heureux' || mood === 'Bien') {
      return 'Genial ! Continue sur cette lancee. Voici une affirmation positive du jour.';
    }
    if (mood === 'Neutre') {
      return 'Une journee calme, c est OK. Souhaites-tu une activite pour ameliorer ton mood ?';
    }
    return 'Tu n es pas seul. Voici une suggestion pour apaiser ton esprit : respiration guidee, message a Mindly Assistant, routine anti-stress...';
  };

  const computeBadges = (history: string[], streakLabel: string) => {
    const list: string[] = [];
    if (history.length >= 5) list.push('5 jours daffilee');
    if (history.length >= 7) list.push('Premiere semaine Mindly');
    const match = streakLabel.match(/(\\d+)/);
    const streakCount = match ? parseInt(match[1], 10) : 0;
    if (streakLabel.toLowerCase().includes('bien') && streakCount >= 4) list.push('Bien 4 jours de suite');
    list.push('Tu prends soin de toi aujourdhui');
    return list.slice(0, 3);
  };


  const handleSaveMood = async () => {
    if (!user?.id) {
      Alert.alert('Connexion requise', 'Connecte-toi pour enregistrer ton humeur.');
      return;
    }

    const newHistory = [...moodHistory, selectedMood].slice(-14);
    const newAverage = computeAverageMood(newHistory);
    const newStreak = computeStreak(newHistory);
    const newTrend = computeTrend(selectedMood);
    const newPersonal = computePersonalMessage(selectedMood);
    const newBadges = computeBadges(newHistory, newStreak);

    setMoodHistory(newHistory);
    setAverageMood(newAverage);
    setStreakText(newStreak);
    setTrendNote(newTrend);
    setPersonalMessage(newPersonal);
    setBadges(newBadges);
    try {
      await addMoodEntry({
        mood: selectedMood,
        emotions: selectedEmotions,
        energy: energyScore,
        stress: stressScore,
        note: journalNote,
      });
      Alert.alert('Suivi enregistre', `Ton ressenti (${selectedMood}) est sauvegarde.`);
    } catch (err) {
      Alert.alert('Sauvegarde locale', 'Enregistrement local uniquement (mode demo).');
    }
  };

  const navigateTo = (path: string) => router.push(path as any);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Bonjour, {firstName}</Text>
            <Text style={styles.subtitle}>Aujourdhui, prends soin de toi</Text>
            <Text style={styles.dateText}>Mardi 18 mars</Text>
          </View>
          <TouchableOpacity style={styles.historyButton} onPress={() => navigateTo('/mood-history')}>
            <IconSymbol name="bell.fill" size={18} color={palette.accent} />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>

        {/* Mood Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Comment te sens-tu aujourdhui ?</Text>
          <Text style={styles.moodPrompt}>Comment vous sentez-vous ?</Text>
          <View style={styles.moodRow}>
            {moodOptions.map((mood) => {
              const active = selectedMood === mood.key;
              return (
                <TouchableOpacity
                  key={mood.key}
                  style={[styles.moodItem, active && styles.moodItemActive]}
                  onPress={() => setSelectedMood(mood.key)}
                  activeOpacity={0.85}
                >
                  <View style={[styles.moodIconWrap, active && styles.moodIconWrapActive]}>
                    <Ionicons name={mood.icon as any} size={26} color={active ? mood.color : '#374151'} />
                  </View>
                  <Text style={[styles.moodLabel, active && styles.moodLabelActive, active && { color: mood.color }]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Emotions du moment</Text>
          <View style={styles.emotionsGrid}>
            {emotionsList.map((emotion) => {
              const active = selectedEmotions.includes(emotion);
              return (
                <TouchableOpacity
                  key={emotion}
                  style={[styles.emotionPill, active && styles.emotionPillActive]}
                  onPress={() => toggleEmotion(emotion)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.emotionText, active && styles.emotionTextActive]}>{emotion}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSaveMood} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Enregistrer mon ressenti</Text>
          </TouchableOpacity>
        </View>

        {/* Journal de bien-être (sliders) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Journal de bien-être</Text>
          <MoodSlider label="Anxiété" value={moodScore} onChange={setMoodScore} />
          <MoodSlider label="Energie" value={energyScore} onChange={setEnergyScore} />
          <MoodSlider label="Stress" value={stressScore} onChange={setStressScore} />
          <Text style={[styles.label, { marginTop: 14 }]}>Que ressens-tu ?</Text>
          <TextInput
            style={styles.journalInput}
            multiline
            placeholder="Ecris tes pensees et sentiments..."
            placeholderTextColor="#9CA3AF"
            value={journalNote}
            onChangeText={setJournalNote}
          />
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 12 }]}
            activeOpacity={0.85}
            onPress={() => {
              addAnxietyEntry({ anxiety: moodScore, energy: energyScore, stress: stressScore, note: journalNote }).catch(() => {});
              Alert.alert('Journal enregistre', 'Merci pour ton partage.');
            }}
          >
            <Text style={styles.primaryButtonText}>Valider</Text>
          </TouchableOpacity>
        </View>

        {/* Insights */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Insights humeur</Text>
          <Text style={styles.statLine}>Humeur moyenne de la semaine : {averageMood}</Text>
          <Text style={styles.statLine}>{streakText}</Text>
          <Text style={styles.statLine}>{trendNote}</Text>
          {personalMessage ? <Text style={styles.statLine}>{personalMessage}</Text> : null}
        </View>

        {/* Badges */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mes badges ({badges.length}/6)</Text>
          <View style={styles.badgeGrid}>
            {[
              { id: 'Debutant', label: 'Debutant', desc: 'Premier check-in' },
              { id: '7 jours', label: '7 jours', desc: 'Serie de 7 jours' },
              { id: 'Courage', label: 'Courage', desc: '10 defis completes' },
              { id: 'Zen', label: 'Zen', desc: '5 seances de respiration' },
              { id: 'Super Star', label: 'Super Star', desc: '30 jours consecutifs' },
              { id: 'Bienveillant', label: 'Bienveillant', desc: 'Aide 10 personnes' },
            ].map((b) => {
              const unlocked = badges.includes(b.id);
              return (
                <View key={b.id} style={[styles.badgeCard, unlocked ? styles.badgeCardActive : styles.badgeCardDisabled]}>
                  <Text style={[styles.badgeIcon, unlocked ? styles.badgeIconActive : styles.badgeIconDisabled]}>★</Text>
                  <Text style={[styles.badgeName, unlocked ? styles.badgeNameActive : styles.badgeNameDisabled]}>{b.label}</Text>
                  <Text style={[styles.badgeDesc, unlocked ? styles.badgeDescActive : styles.badgeDescDisabled]}>{b.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Ton aperçu du jour */}
        <TouchableOpacity style={styles.resultsCard} onPress={() => navigateTo('/dashboard')} activeOpacity={0.85}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>Ton apercu du jour</Text>
            <Text style={styles.resultsSubtitle}>Apercu rapide du tableau de bord</Text>
          </View>
          <View style={styles.resultsGrid}>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Humeur du jour</Text>
              <Text style={styles.resultValue}>{selectedMood}</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Semaine</Text>
              <Text style={styles.resultValue}>{completedThisWeek}/7 defis</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Communautes</Text>
              <Text style={styles.resultValue}>{communityActivity} actives</Text>
            </View>
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Messages envoyes</Text>
              <Text style={styles.resultValue}>{messagesSent}</Text>
            </View>
          </View>
          <View style={styles.resultsCTA}>
            <Text style={styles.resultsLink}>Acceder a mon tableau de bord complet</Text>
            <IconSymbol name="arrow.right" size={18} color={palette.accent} />
          </View>
        </TouchableOpacity>

        {/* Challenges */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tes defis du jour</Text>
            <TouchableOpacity onPress={() => navigateTo('/challenges')}>
              <Text style={styles.link}>Voir plus</Text>
            </TouchableOpacity>
          </View>
          {dailyChallenges.map((challenge, idx) => (
            <Pressable
              key={challenge.id}
              style={({ pressed }) => [
                styles.challengeRow,
                pressed && styles.challengeRowPressed,
                idx === dailyChallenges.length - 1 && { borderBottomWidth: 0 },
              ]}
              android_ripple={{ color: 'rgba(114,104,240,0.08)' }}
              onPress={() => {
                const target =
                  challenge.id === 'c1'
                    ? '/challenge-details'
                    : challenge.id === 'c2'
                    ? '/challenge-gratitude'
                    : '/challenge-pause';
                navigateTo(target);
              }}
            >
              {challenge.image ? (
                <Image source={{ uri: challenge.image }} style={styles.challengeImage} />
              ) : (
                <View style={styles.challengeIcon}>
                  <IconSymbol name="sparkles" size={18} color={palette.accent} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDescription}>{challenge.description}</Text>
              </View>
              {challenge.isNew && <Text style={styles.badge}>Nouveau</Text>}
            </Pressable>
          ))}
        </View>

        {/* Weekly progress */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tes defis realises cette semaine</Text>
            <Text style={styles.sectionValue}>{weeklyProgress.filter((d) => d.done).length}/7</Text>
          </View>
          <View style={styles.weekRow}>
            {weeklyProgress.map((day) => (
              <View key={day.key} style={styles.dayItem}>
                <View style={[styles.dayCircle, day.done && styles.dayCircleDone]} />
                <Text style={styles.dayLabel}>{day.day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommended activities */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activites recommandees</Text>
            <TouchableOpacity onPress={() => navigateTo('/(tabs)/exercises')}>
              <Text style={styles.link}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedActivities}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.activityCard} activeOpacity={0.85} onPress={() => navigateTo('/(tabs)/exercises')}>
                <View style={styles.activityIcon}>
                  <IconSymbol name={item.icon as any} size={20} color={palette.accent} />
                </View>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityDescription}>{item.description}</Text>
                <Text style={styles.activityTag}>{item.tag}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Emotion exercises */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercices adaptes a tes emotions</Text>
            <TouchableOpacity onPress={() => navigateTo('/exercise')}>
              <Text style={styles.link}>Explorer</Text>
            </TouchableOpacity>
          </View>
          {exercises.length === 0 ? (
            <Text style={styles.emptyText}>Choisis des emotions pour voir des exercices.</Text>
          ) : (
            exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseRow}
                activeOpacity={0.85}
                onPress={() => navigateTo('/exercise')}
              >
                <View style={styles.exerciseIcon}>
                  <IconSymbol name={exercise.icon as any} size={18} color={palette.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                  <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
                </View>
                <Text style={styles.exerciseCta}>Commencer</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* CTA community / IA */}
        <View style={[styles.card, styles.communityCard]}>
          <Text style={styles.sectionTitle}>Tu n es pas seul(e) 💙</Text>
          <Text style={styles.sectionDescription}>Rejoins la communaute ou discute avec l IA.</Text>
          <View style={styles.communityButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigateTo('/(tabs)/discussions')}>
              <IconSymbol name="person.2.fill" size={16} color={palette.accent} />
              <Text style={styles.secondaryText}>Communaute</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigateTo('/chat/ai')}>
              <IconSymbol name="sparkles" size={16} color={palette.accent} />
              <Text style={styles.secondaryText}>IA MindSafe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inspiration */}
        <LinearGradient colors={[palette.accentLight, '#E8F5E9']} start={[0, 0]} end={[1, 1]} style={[styles.card, styles.inspirationCard]}>
          <Text style={styles.sectionTitle}>Inspiration du jour</Text>
          <Text style={styles.inspirationQuote}>Prends une grande inspiration, laisse partir ce que tu ne controles pas.</Text>
          <Text style={styles.inspirationAuthor}>- Mindly</Text>
        </LinearGradient>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  greeting: { fontSize: 18, fontWeight: '700', color: palette.textPrimary },
  subtitle: { fontSize: 14, color: palette.textSecondary, marginTop: 4 },
  dateText: { fontSize: 12, color: palette.textSecondary, marginTop: 2 },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  dot: { position: 'absolute', right: 6, top: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#F87171' },
  card: {
    backgroundColor: palette.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 14,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: isTablet ? 18 : 16, fontWeight: '700', color: palette.textPrimary },
  sectionValue: { fontSize: 14, fontWeight: '700', color: palette.accent },
  label: { marginTop: 12, marginBottom: 8, color: palette.textSecondary, fontSize: 13 },
  moodPrompt: { textAlign: 'center', fontSize: 16, fontWeight: '600', color: palette.textPrimary, marginVertical: 12 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 10 },
  moodItem: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F6FA',
    borderWidth: 1,
    borderColor: palette.border,
  },
  moodItemActive: {
    backgroundColor: palette.accentLight,
    borderColor: palette.accent,
  },
  moodIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: palette.border,
  },
  moodIconWrapActive: {
    backgroundColor: '#fff',
    borderColor: palette.accent,
  },
  moodLabel: { fontSize: 12, color: palette.textPrimary },
  moodLabelActive: { fontWeight: '700' },
  emotionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emotionPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F3F8',
    borderWidth: 1,
    borderColor: palette.border,
  },
  emotionPillActive: { backgroundColor: palette.accent, borderColor: palette.accent },
  emotionText: { color: palette.textPrimary, fontSize: 13 },
  emotionTextActive: { color: '#fff', fontWeight: '700' },
  primaryButton: {
    marginTop: 14,
    backgroundColor: palette.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  statLine: { color: palette.textSecondary, marginTop: 4, fontSize: 13 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 },
  badgeCard: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  badgeCardActive: { backgroundColor: '#E9F7EF', borderColor: '#34D399' },
  badgeCardDisabled: { backgroundColor: '#F6F7FB', borderColor: palette.border },
  badgeIcon: { fontSize: 18, marginBottom: 6 },
  badgeIconActive: { color: '#34D399' },
  badgeIconDisabled: { color: '#9CA3AF' },
  badgeName: { fontWeight: '700', color: palette.textPrimary },
  badgeNameActive: { color: '#065F46' },
  badgeNameDisabled: { color: '#6B7280' },
  badgeDesc: { fontSize: 12, color: palette.textSecondary, marginTop: 2 },
  badgeDescActive: { color: '#047857' },
  badgeDescDisabled: { color: '#9CA3AF' },
  resultsCard: {
    backgroundColor: '#EEF1FF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 14,
  },
  resultsHeader: { marginBottom: 10 },
  resultsTitle: { fontSize: 17, fontWeight: '800', color: palette.textPrimary },
  resultsSubtitle: { fontSize: 13, color: palette.textSecondary, marginTop: 2 },
  resultsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  resultItem: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F6F7FF',
    borderWidth: 1,
    borderColor: palette.border,
  },
  resultLabel: { fontSize: 12, color: palette.textSecondary },
  resultValue: { fontSize: 16, fontWeight: '800', color: palette.textPrimary },
  resultsCTA: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  resultsLink: { color: palette.accent, fontWeight: '700' },
  link: { color: palette.accent, fontWeight: '700' },
  challengeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31,42,68,0.06)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  challengeRowPressed: {
    backgroundColor: 'rgba(114,104,240,0.04)',
    transform: [{ scale: 0.98 }],
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeImage: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#ccc' },
  challengeTitle: { fontWeight: '700', color: '#1F2A44', fontSize: 14 },
  challengeDescription: { color: '#6B6F85', fontSize: 12, marginTop: 4 },
  badge: {
    backgroundColor: '#A5C9FF',
    color: '#1F2A44',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    fontWeight: '700',
    fontSize: 12,
  },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  dayItem: { alignItems: 'center', flex: 1 },
  dayCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: palette.border, marginBottom: 6 },
  dayCircleDone: { backgroundColor: palette.accent, borderColor: palette.accent },
  dayLabel: { fontSize: 12, color: palette.textSecondary },
  activityCard: {
    width: isTablet ? 200 : 170,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F6F7FF',
    borderWidth: 1,
    borderColor: palette.border,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activityTitle: { fontWeight: '700', color: palette.textPrimary, fontSize: 14 },
  activityDescription: { color: palette.textSecondary, fontSize: 12, marginTop: 4 },
  activityTag: { marginTop: 6, color: palette.accent, fontWeight: '700', fontSize: 12 },
  emptyText: { color: palette.textSecondary, fontSize: 13, marginTop: 6 },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  exerciseIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseTitle: { fontWeight: '700', color: palette.textPrimary, fontSize: 14 },
  exerciseDuration: { color: palette.textSecondary, fontSize: 12, marginTop: 2 },
  exerciseCta: { color: palette.accent, fontWeight: '700' },
  communityCard: { backgroundColor: '#F8FBFF' },
  sectionDescription: { color: palette.textSecondary, marginTop: 4 },
  communityButtons: { flexDirection: 'row', gap: 10, marginTop: 12 },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  secondaryText: { color: palette.textPrimary, fontWeight: '700' },
  inspirationCard: { borderWidth: 0, overflow: 'hidden' },
  inspirationQuote: { color: palette.textPrimary, marginTop: 8, fontSize: 14 },
  inspirationAuthor: { color: palette.textSecondary, marginTop: 4, fontSize: 12 },
  journalInput: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    color: palette.textPrimary,
    backgroundColor: '#fff',
  },
  sliderTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  sliderTouch: {
    paddingVertical: 8,
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#34D399',
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#34D399',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  sliderMinMax: { color: palette.textSecondary, fontSize: 12 },
});

type MoodSliderProps = { label: string; value: number; onChange: (v: number) => void };

const MoodSlider = ({ label, value, onChange }: MoodSliderProps) => {
  const [trackWidth, setTrackWidth] = useState(0);

  const updateValueFromX = (x: number) => {
    if (!trackWidth) return;
    const ratio = Math.min(Math.max(x / trackWidth, 0), 1);
    const newValue = Math.round(1 + ratio * 9);
    onChange(newValue);
  };

  const handleTouch = (evt: any) => {
    updateValueFromX(evt.nativeEvent.locationX);
  };

  const thumbLeft = trackWidth ? ((value - 1) / 9) * trackWidth : 0;

  return (
    <View style={{ marginTop: 10, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ color: palette.textPrimary, fontWeight: '700' }}>{label}</Text>
        <Text style={{ color: palette.accent, fontWeight: '800' }}>{value}</Text>
      </View>
      <View
        style={styles.sliderTouch}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderMove={handleTouch}
        onResponderRelease={handleTouch}
        onResponderGrant={handleTouch}
      >
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, trackWidth ? { width: thumbLeft } : null]} />
          <View style={[styles.sliderThumb, { left: thumbLeft - 10 }]} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Text style={styles.sliderMinMax}>1</Text>
        <Text style={styles.sliderMinMax}>10</Text>
      </View>
    </View>
  );
};
