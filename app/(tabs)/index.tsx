import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';

interface DashboardData {
  todayMood: number | null;
  streakDays: number;
  lastJournalEntry: string | null;
  weeklyGoal: number;
  completedToday: string[];
}

export default function HomeScreen() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    todayMood: null,
    streakDays: 5,
    lastJournalEntry: null,
    weeklyGoal: 7,
    completedToday: []
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
    
    // Mettre à jour l'heure toutes les minutes
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Charger l'humeur du jour
      const moodData = await AsyncStorage.getItem('mindly-mood-entries');
      if (moodData) {
        const moods = JSON.parse(moodData);
        const today = new Date().toDateString();
        const todayMood = moods.find((mood: any) => 
          new Date(mood.timestamp).toDateString() === today
        );
        
        if (todayMood) {
          setDashboardData(prev => ({ ...prev, todayMood: todayMood.mood }));
        }
      }

      // Charger la dernière entrée de journal
      const journalData = await AsyncStorage.getItem('mindly-journal-entries');
      if (journalData) {
        const journals = JSON.parse(journalData);
        if (journals.length > 0) {
          const lastEntry = journals[journals.length - 1];
          setDashboardData(prev => ({ 
            ...prev, 
            lastJournalEntry: new Date(lastEntry.timestamp).toLocaleDateString('fr-FR')
          }));
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Chaque petit pas compte 🌱",
      "Vous êtes plus fort(e) que vous ne le pensez 💪",
      "Prenez soin de vous aujourd'hui 💜",
      "Votre bien-être est une priorité ⭐",
      "Respirez profondément, tout va bien 🌸"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getMoodEmoji = (mood: number | null) => {
    if (!mood) return '❓';
    if (mood >= 5) return '😊';
    if (mood >= 4) return '🙂';
    if (mood >= 3) return '😐';
    if (mood >= 2) return '😔';
    return '😢';
  };

  const navigateToMood = () => {
    Vibration.vibrate(50);
    router.push('/mood');
  };

  const navigateToJournal = () => {
    Vibration.vibrate(50);
    router.push('/journal');
  };

  const navigateToChat = () => {
    Vibration.vibrate(50);
    router.push('/chat');
  };

  const navigateToExplore = () => {
    Vibration.vibrate(50);
    router.push('/explore');
  };

  const navigateToCommunity = () => {
    Vibration.vibrate(50);
    router.push('/community');
  };

  const quickMoodEntry = (moodValue: number) => {
    Vibration.vibrate(100);
    // Simuler l'enregistrement rapide d'humeur
    setDashboardData(prev => ({ ...prev, todayMood: moodValue }));
    Alert.alert('Humeur enregistrée !', `Merci d'avoir partagé votre humeur (${moodValue}/5)`);
    // Ici on pourrait vraiment sauvegarder dans AsyncStorage
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec heure et salutation */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{getGreeting()} ! 👋</Text>
            <Text style={styles.tagline}>Comment allez-vous aujourd'hui ?</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {currentTime.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
            <Text style={styles.dateText}>
              {currentTime.toLocaleDateString('fr-FR', { 
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Widgets de statut rapide */}
      <View style={styles.statusWidgets}>
        <View style={styles.widgetRow}>
          <View style={styles.moodWidget}>
            <Text style={styles.widgetTitle}>Humeur du jour</Text>
            <View style={styles.moodDisplay}>
              <Text style={styles.moodEmoji}>{getMoodEmoji(dashboardData.todayMood)}</Text>
              <Text style={styles.moodText}>
                {dashboardData.todayMood ? `${dashboardData.todayMood}/5` : 'Non définie'}
              </Text>
            </View>
            <TouchableOpacity style={styles.widgetButton} onPress={navigateToMood}>
              <Text style={styles.widgetButtonText}>
                {dashboardData.todayMood ? 'Modifier' : 'Définir'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.streakWidget}>
            <Text style={styles.widgetTitle}>Série</Text>
            <View style={styles.streakDisplay}>
              <Text style={styles.streakNumber}>{dashboardData.streakDays}</Text>
              <Text style={styles.streakEmoji}>🔥</Text>
            </View>
            <Text style={styles.streakText}>jours consécutifs</Text>
          </View>
        </View>

        <View style={styles.journalWidget}>
          <View style={styles.journalHeader}>
            <Text style={styles.widgetTitle}>Journal</Text>
            <TouchableOpacity onPress={navigateToJournal}>
              <Text style={styles.journalAction}>Écrire ✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.journalText}>
            {dashboardData.lastJournalEntry 
              ? `Dernière entrée: ${dashboardData.lastJournalEntry}`
              : 'Aucune entrée récente'
            }
          </Text>
        </View>
      </View>

      {/* Humeur rapide */}
      <View style={styles.quickMoodSection}>
        <Text style={styles.sectionTitle}>Humeur express</Text>
        <View style={styles.quickMoodGrid}>
          {[1, 2, 3, 4, 5].map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.quickMoodCard,
                dashboardData.todayMood === mood && styles.selectedMoodCard
              ]}
              onPress={() => quickMoodEntry(mood)}
            >
              <Text style={styles.quickMoodEmoji}>{getMoodEmoji(mood)}</Text>
              <Text style={styles.quickMoodNumber}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Actions rapides */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={navigateToChat}>
            <Text style={styles.actionEmoji}>💬</Text>
            <Text style={styles.actionTitle}>MindSafe</Text>
            <Text style={styles.actionSubtitle}>Chat IA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={navigateToExplore}>
            <Text style={styles.actionEmoji}>🧘‍♀️</Text>
            <Text style={styles.actionTitle}>Exercices</Text>
            <Text style={styles.actionSubtitle}>Bien-être</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={navigateToCommunity}>
            <Text style={styles.actionEmoji}>👥</Text>
            <Text style={styles.actionTitle}>Communauté</Text>
            <Text style={styles.actionSubtitle}>Partager</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => Alert.alert('SOS', 'Numéros d\'urgence:\n🇫🇷 3114 (Prévention suicide)\n🆘 15 (SAMU)\n👮 17 (Police)')}>
            <Text style={styles.actionEmoji}>🆘</Text>
            <Text style={styles.actionTitle}>Urgence</Text>
            <Text style={styles.actionSubtitle}>Aide</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Message motivationnel */}
      <View style={styles.motivationCard}>
        <Text style={styles.motivationIcon}>✨</Text>
        <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
      </View>

      {/* Raccourcis vers les outils */}
      <View style={styles.toolsSection}>
        <Text style={styles.sectionTitle}>Mes outils</Text>
        
        <TouchableOpacity style={styles.toolCard} onPress={navigateToMood}>
          <View style={styles.toolIcon}>
            <Text style={styles.toolEmoji}>📊</Text>
          </View>
          <View style={styles.toolContent}>
            <Text style={styles.toolTitle}>Suivi d'humeur détaillé</Text>
            <Text style={styles.toolDescription}>Analysez vos émotions avec précision</Text>
          </View>
          <Text style={styles.toolArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolCard} onPress={navigateToJournal}>
          <View style={styles.toolIcon}>
            <Text style={styles.toolEmoji}>�</Text>
          </View>
          <View style={styles.toolContent}>
            <Text style={styles.toolTitle}>Journal guidé</Text>
            <Text style={styles.toolDescription}>Réflexions quotidiennes structurées</Text>
          </View>
          <Text style={styles.toolArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolCard} onPress={navigateToExplore}>
          <View style={styles.toolIcon}>
            <Text style={styles.toolEmoji}>🎯</Text>
          </View>
          <View style={styles.toolContent}>
            <Text style={styles.toolTitle}>Exercices personnalisés</Text>
            <Text style={styles.toolDescription}>Programmes adaptés à vos besoins</Text>
          </View>
          <Text style={styles.toolArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>MINDLY • Votre compagnon de bien-être</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#4f46e5',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statusWidgets: {
    padding: 20,
    gap: 15,
  },
  widgetRow: {
    flexDirection: 'row',
    gap: 15,
  },
  moodWidget: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  streakWidget: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 10,
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  moodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  widgetButton: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  widgetButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  streakDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ef4444',
    marginRight: 5,
  },
  streakEmoji: {
    fontSize: 20,
  },
  streakText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  journalWidget: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  journalAction: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600',
  },
  journalText: {
    fontSize: 14,
    color: '#6b7280',
  },
  quickMoodSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  quickMoodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickMoodCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMoodCard: {
    backgroundColor: '#ddd6fe',
    borderWidth: 2,
    borderColor: '#4f46e5',
  },
  quickMoodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickMoodNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  motivationCard: {
    margin: 20,
    backgroundColor: '#fef3c7',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  motivationIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 16,
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  toolsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  toolCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  toolEmoji: {
    fontSize: 20,
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  toolDescription: {
    fontSize: 13,
    color: '#6b7280',
  },
  toolArrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
});
