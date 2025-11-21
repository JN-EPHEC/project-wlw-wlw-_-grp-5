import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    Share,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    Vibration,
    View
} from 'react-native';

// Service de notification simplifié
const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    return true;
  },
  async scheduleDailyReminder(hour: number, minute: number): Promise<void> {
    console.log(`Rappel programmé pour ${hour}:${minute}`);
  },
  async cancelDailyReminder(): Promise<void> {
    console.log('Rappel annulé');
  },
  async cancelAllNotifications(): Promise<void> {
    console.log('Toutes les notifications annulées');
  }
};

interface UserProfile {
  name: string;
  joinDate: Date;
  streakDays: number;
  totalMoodEntries: number;
  totalJournalEntries: number;
  favoriteExercises: number;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
  reminderTime: string;
}

interface UserStats {
  weeklyMoodAverage: number;
  monthlyJournalCount: number;
  mostUsedCategory: string;
  longestStreak: number;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Utilisateur',
    joinDate: new Date(),
    streakDays: 7,
    totalMoodEntries: 45,
    totalJournalEntries: 23,
    favoriteExercises: 3,
    notificationsEnabled: true,
    darkModeEnabled: false,
    reminderTime: '20:00'
  });

  const [stats, setStats] = useState<UserStats>({
    weeklyMoodAverage: 3.8,
    monthlyJournalCount: 12,
    mostUsedCategory: 'Gratitude',
    longestStreak: 14
  });

  useEffect(() => {
    loadUserData();
    calculateStats();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('mindly-user-profile');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setProfile({
          ...parsedData,
          joinDate: new Date(parsedData.joinDate)
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const saveUserData = async (newProfile: UserProfile) => {
    try {
      await AsyncStorage.setItem('mindly-user-profile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const calculateStats = async () => {
    try {
      // Calculer les statistiques à partir des données existantes
      const moodData = await AsyncStorage.getItem('mindly-mood-entries');
      const journalData = await AsyncStorage.getItem('mindly-journal-entries');
      
      if (moodData) {
        const moods = JSON.parse(moodData);
        const recentMoods = moods.slice(-7); // 7 derniers jours
        const average = recentMoods.reduce((sum: number, mood: any) => sum + mood.mood, 0) / recentMoods.length;
        
        setStats(prev => ({
          ...prev,
          weeklyMoodAverage: Math.round(average * 10) / 10
        }));
      }

      if (journalData) {
        const journals = JSON.parse(journalData);
        const thisMonth = journals.filter((entry: any) => {
          const entryDate = new Date(entry.timestamp);
          const now = new Date();
          return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
        });
        
        setStats(prev => ({
          ...prev,
          monthlyJournalCount: thisMonth.length
        }));
      }
    } catch (error) {
      console.error('Erreur lors du calcul des stats:', error);
    }
  };

  const toggleNotifications = async (value: boolean) => {
    Vibration.vibrate(50);
    
    if (value) {
      // Activer les notifications
      const hasPermission = await NotificationService.requestPermissions();
      if (hasPermission) {
        await NotificationService.scheduleDailyReminder(20, 0); // 20h00 par défaut
        Alert.alert('Notifications activées', 'Vous recevrez des rappels quotidiens à 20h00');
      } else {
        Alert.alert('Permission refusée', 'Impossible d\'activer les notifications');
        return;
      }
    } else {
      // Désactiver les notifications
      await NotificationService.cancelDailyReminder();
      Alert.alert('Notifications désactivées', 'Les rappels quotidiens ont été annulés');
    }
    
    const newProfile = { ...profile, notificationsEnabled: value };
    saveUserData(newProfile);
  };

  const toggleDarkMode = (value: boolean) => {
    Vibration.vibrate(50);
    const newProfile = { ...profile, darkModeEnabled: value };
    saveUserData(newProfile);
  };

  const exportData = async () => {
    try {
      const allData = {
        profile,
        stats,
        exportDate: new Date().toISOString()
      };
      
      await Share.share({
        message: `Mes données MINDLY - Exportées le ${new Date().toLocaleDateString('fr-FR')}`,
        title: 'Export de mes données MINDLY'
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les données');
    }
  };

  const configureReminderTime = () => {
    Alert.alert(
      'Heure des rappels',
      'Choisissez l\'heure de vos rappels quotidiens',
      [
        { text: 'Matin (9h00)', onPress: () => setReminderTime(9, 0) },
        { text: 'Midi (12h00)', onPress: () => setReminderTime(12, 0) },
        { text: 'Après-midi (17h00)', onPress: () => setReminderTime(17, 0) },
        { text: 'Soir (20h00)', onPress: () => setReminderTime(20, 0) },
        { text: 'Annuler', style: 'cancel' }
      ]
    );
  };

  const setReminderTime = async (hour: number, minute: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const newProfile = { ...profile, reminderTime: timeString };
    
    // Si les notifications sont activées, reprogrammer avec la nouvelle heure
    if (profile.notificationsEnabled) {
      await NotificationService.cancelDailyReminder();
      await NotificationService.scheduleDailyReminder(hour, minute);
      Alert.alert('Rappel modifié', `Vous recevrez maintenant des rappels à ${timeString}`);
    }
    
    saveUserData(newProfile);
  };

  const resetData = () => {
    Alert.alert(
      'Réinitialiser les données',
      'Êtes-vous sûr(e) de vouloir supprimer toutes vos données ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'mindly-mood-entries',
                'mindly-journal-entries',
                'mindly-exercise-favorites',
                'mindly-chat-history',
                'mindly-community-posts',
                'mindly-user-profile'
              ]);
              await NotificationService.cancelAllNotifications();
              Alert.alert('Succès', 'Toutes les données ont été supprimées');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer les données');
            }
          }
        }
      ]
    );
  };

  const getDaysJoined = () => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - profile.joinDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMoodEmoji = (average: number) => {
    if (average >= 4.5) return '�';
    if (average >= 3.5) return '🙂';
    if (average >= 2.5) return '😐';
    if (average >= 1.5) return '😔';
    return '😢';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon Profil</Text>
        <Text style={styles.subtitle}>Suivez votre parcours de bien-être</Text>
      </View>

      {/* Profil utilisateur */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>🌸</Text>
        </View>
        <Text style={styles.userName}>{profile.name}</Text>
        <Text style={styles.joinDate}>
          Membre depuis {getDaysJoined()} jours
        </Text>
      </View>

      {/* Statistiques principales */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Mes statistiques</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{profile.streakDays}</Text>
            <Text style={styles.statLabel}>Jours consécutifs</Text>
            <Text style={styles.statEmoji}>🔥</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{profile.totalMoodEntries}</Text>
            <Text style={styles.statLabel}>Humeurs notées</Text>
            <Text style={styles.statEmoji}>💝</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{profile.totalJournalEntries}</Text>
            <Text style={styles.statLabel}>Entrées journal</Text>
            <Text style={styles.statEmoji}>📝</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{profile.favoriteExercises}</Text>
            <Text style={styles.statLabel}>Exercices favoris</Text>
            <Text style={styles.statEmoji}>⭐</Text>
          </View>
        </View>
      </View>

      {/* Statistiques détaillées */}
      <View style={styles.detailedStats}>
        <Text style={styles.sectionTitle}>Analyse détaillée</Text>
        
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>Humeur moyenne (7 jours)</Text>
            <Text style={styles.detailEmoji}>{getMoodEmoji(stats.weeklyMoodAverage)}</Text>
          </View>
          <Text style={styles.detailValue}>{stats.weeklyMoodAverage}/5</Text>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>Entrées ce mois</Text>
            <Text style={styles.detailEmoji}>📅</Text>
          </View>
          <Text style={styles.detailValue}>{stats.monthlyJournalCount} entrées</Text>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>Catégorie préférée</Text>
            <Text style={styles.detailEmoji}>🏆</Text>
          </View>
          <Text style={styles.detailValue}>{stats.mostUsedCategory}</Text>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>Plus longue série</Text>
            <Text style={styles.detailEmoji}>🎯</Text>
          </View>
          <Text style={styles.detailValue}>{stats.longestStreak} jours</Text>
        </View>
      </View>

      {/* Paramètres */}
      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Paramètres</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={profile.notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#d1d5db', true: '#34d399' }}
            thumbColor={profile.notificationsEnabled ? '#059669' : '#9ca3af'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🌙</Text>
            <Text style={styles.settingLabel}>Mode sombre</Text>
          </View>
          <Switch
            value={profile.darkModeEnabled}
            onValueChange={toggleDarkMode}
            trackColor={{ false: '#d1d5db', true: '#6366f1' }}
            thumbColor={profile.darkModeEnabled ? '#4f46e5' : '#9ca3af'}
          />
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={configureReminderTime}>
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>⏰</Text>
            <Text style={styles.settingLabel}>Rappels quotidiens</Text>
          </View>
          <Text style={styles.settingValue}>{profile.reminderTime}</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={exportData}>
          <Text style={styles.actionIcon}>�</Text>
          <Text style={styles.actionText}>Exporter mes données</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Aide', 'Centre d\'aide et FAQ bientôt disponible')}>
          <Text style={styles.actionIcon}>❓</Text>
          <Text style={styles.actionText}>Aide et support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('À propos', 'MINDLY v1.0\nVotre compagnon de bien-être mental')}>
          <Text style={styles.actionIcon}>ℹ️</Text>
          <Text style={styles.actionText}>À propos de MINDLY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.dangerButton]} onPress={resetData}>
          <Text style={styles.actionIcon}>🗑️</Text>
          <Text style={[styles.actionText, styles.dangerText]}>Réinitialiser les données</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Merci d'utiliser MINDLY pour prendre soin de votre bien-être mental 💚
        </Text>
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
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#ec4899',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fce7f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatar: {
    fontSize: 40,
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  statEmoji: {
    fontSize: 20,
  },
  detailedStats: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  detailCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailEmoji: {
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  settingsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  settingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  dangerText: {
    color: '#dc2626',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});