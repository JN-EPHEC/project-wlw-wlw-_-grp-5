import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  
  // Demander permission pour les notifications
  static async requestPermissions(): Promise<boolean> {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Permission refusée pour les notifications');
        return false;
      }
      
      // Configuration pour Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('mindly-reminders', {
          name: 'Rappels MINDLY',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4f46e5',
        });
      }
      
      return true;
    } else {
      console.log('Les notifications ne fonctionnent que sur un appareil physique');
      return false;
    }
  }

  // Programmer rappel quotidien
  static async scheduleDailyReminder(hour: number = 20, minute: number = 0): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      // Annuler les anciennes notifications
      await this.cancelDailyReminder();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌸 MINDLY - Moment pour vous',
          body: 'Prenez quelques minutes pour noter votre humeur et réfléchir à votre journée.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
          badge: 1,
        },
        trigger: {
          type: 'calendar',
          hour,
          minute,
          repeats: true,
        },
      });

      // Sauvegarder l'ID de notification
      await AsyncStorage.setItem('mindly-daily-reminder-id', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Erreur lors de la programmation du rappel:', error);
      return null;
    }
  }

  // Annuler rappel quotidien
  static async cancelDailyReminder(): Promise<void> {
    try {
      const reminderId = await AsyncStorage.getItem('mindly-daily-reminder-id');
      if (reminderId) {
        await Notifications.cancelScheduledNotificationAsync(reminderId);
        await AsyncStorage.removeItem('mindly-daily-reminder-id');
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rappel:', error);
    }
  }

  // Notification de félicitations pour série
  static async sendStreakCongratulations(streakDays: number): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      let title = '';
      let body = '';

      if (streakDays === 7) {
        title = '🎉 Une semaine complète !';
        body = 'Félicitations ! Vous avez utilisé MINDLY pendant 7 jours consécutifs.';
      } else if (streakDays === 30) {
        title = '🏆 Un mois de bien-être !';
        body = 'Incroyable ! Vous prenez soin de votre santé mentale depuis 30 jours.';
      } else if (streakDays % 10 === 0) {
        title = `🔥 ${streakDays} jours de suite !`;
        body = 'Votre régularité est inspirante. Continuez comme ça !';
      } else {
        return; // Pas de notification pour les autres jalons
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Notification immédiate
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de félicitations:', error);
    }
  }

  // Notification de motivation basée sur l'humeur
  static async sendMoodMotivation(averageMood: number): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      let title = '';
      let body = '';

      if (averageMood >= 4) {
        title = '😊 Excellent moral !';
        body = 'Votre humeur est au top ! Continuez à cultiver cette énergie positive.';
      } else if (averageMood >= 3) {
        title = '🙂 Progression positive';
        body = 'Votre bien-être s\'améliore. Peut-être essayer un exercice de gratitude ?';
      } else if (averageMood < 2.5) {
        title = '💜 Prenez soin de vous';
        body = 'Vous traversez une période difficile. N\'hésitez pas à parler à MindSafe ou faire un exercice de respiration.';
      }

      if (title && body) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.DEFAULT,
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de motivation:', error);
    }
  }

  // Rappel d'exercice personnalisé
  static async scheduleExerciseReminder(exerciseName: string, delayMinutes: number = 30): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧘‍♀️ Temps d\'exercice',
          body: `Il est temps de faire votre exercice "${exerciseName}". Quelques minutes suffisent !`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger: {
          type: 'timeInterval',
          seconds: delayMinutes * 60,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la programmation d\'exercice:', error);
    }
  }

  // Obtenir toutes les notifications programmées
  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return [];
    }
  }

  // Annuler toutes les notifications
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem('mindly-daily-reminder-id');
    } catch (error) {
      console.error('Erreur lors de l\'annulation des notifications:', error);
    }
  }

  // Notification d'urgence (si mots-clés détectés)
  static async sendEmergencySupport(): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🆘 Ressources d\'aide',
          body: 'Des professionnels sont là pour vous aider. Numéros d\'urgence disponibles dans l\'app.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi d\'aide d\'urgence:', error);
    }
  }
}

// Fonction d'utilité pour obtenir le token de notification (pour les notifications push serveur)
export async function getNotificationToken(): Promise<string | null> {
  try {
    if (Device.isDevice) {
      const token = await Notifications.getExpoPushTokenAsync();
      return token.data;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token:', error);
    return null;
  }
}

// Configuration des rappels intelligents
export const ReminderScheduler = {
  // Rappels basés sur l'utilisation
  async setupSmartReminders() {
    try {
      // Analyser les patterns d'usage
      const moodData = await AsyncStorage.getItem('mindly-mood-entries');
      const journalData = await AsyncStorage.getItem('mindly-journal-entries');

      if (moodData || journalData) {
        const moods = moodData ? JSON.parse(moodData) : [];
        const journals = journalData ? JSON.parse(journalData) : [];

        // Trouver les heures les plus fréquentes d'utilisation
        const usageHours = [...moods, ...journals].map(entry => 
          new Date(entry.timestamp).getHours()
        );

        if (usageHours.length > 0) {
          // Calculer l'heure moyenne d'utilisation
          const averageHour = Math.round(
            usageHours.reduce((sum, hour) => sum + hour, 0) / usageHours.length
          );

          // Programmer un rappel 1 heure avant l'heure habituelle
          const reminderHour = Math.max(9, Math.min(21, averageHour - 1));
          await NotificationService.scheduleDailyReminder(reminderHour, 0);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la configuration des rappels intelligents:', error);
    }
  }
};