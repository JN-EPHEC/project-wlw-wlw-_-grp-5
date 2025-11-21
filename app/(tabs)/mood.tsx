import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

interface MoodEntry {
  mood: number;
  stress: number;
  energy: number;
  timestamp: string;
  note?: string;
}

export default function MoodScreen() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedStress, setSelectedStress] = useState<number | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showQuickTags, setShowQuickTags] = useState<boolean>(false);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    loadMoodHistory();
  }, []);

  useEffect(() => {
    let interval: any;
    if (startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  const loadMoodHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('mindly-mood-history');
      if (stored) {
        setMoodHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  };

  const selectMood = (mood: number) => {
    setSelectedMood(mood);
    setStartTime(Date.now());
    setShowQuickTags(true);
    Vibration.vibrate(50); // Feedback tactile
  };

  const selectStress = (level: number) => {
    setSelectedStress(level);
    Vibration.vibrate(30);
  };

  const selectEnergy = (level: number) => {
    setSelectedEnergy(level);
    Vibration.vibrate(30);
  };

  const saveMoodEntry = async () => {
    if (!selectedMood || !selectedStress || !selectedEnergy) {
      Alert.alert('Attention', 'Veuillez sélectionner votre humeur, niveau de stress et d\'énergie');
      return;
    }

    const entry: MoodEntry = {
      mood: selectedMood,
      stress: selectedStress,
      energy: selectedEnergy,
      timestamp: new Date().toISOString(),
    };

    try {
      const updatedHistory = [...moodHistory, entry];
      await AsyncStorage.setItem('mindly-mood-history', JSON.stringify(updatedHistory));
      setMoodHistory(updatedHistory);
      
      // Reset form
      setSelectedMood(null);
      setSelectedStress(null);
      setSelectedEnergy(null);
      setShowQuickTags(false);
      setStartTime(null);
      setElapsedTime(0);

      Alert.alert('Succès', `Humeur enregistrée en ${elapsedTime}s !`);
      Vibration.vibrate([100, 50, 100]); // Confirmation tactile
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder votre humeur');
    }
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ['😔', '😕', '😐', '😊', '😄'];
    return emojis[mood - 1];
  };

  const getMoodLabel = (mood: number) => {
    const labels = ['Très mal', 'Mal', 'Neutre', 'Bien', 'Très bien'];
    return labels[mood - 1];
  };

  const getStressLabel = (level: number) => {
    const labels = ['Très bas', 'Bas', 'Moyen', 'Élevé', 'Très élevé'];
    return labels[level - 1];
  };

  const getEnergyLabel = (level: number) => {
    const labels = ['Épuisé', 'Fatigué', 'Normal', 'Énergique', 'Très énergique'];
    return labels[level - 1];
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Suivi d'Humeur</Text>
        <Text style={styles.subtitle}>Comment vous sentez-vous aujourd'hui ?</Text>
        {startTime && (
          <Text style={styles.timer}>Temps: {elapsedTime}s</Text>
        )}
      </View>
      
      <View style={styles.moodSelector}>
        <Text style={styles.sectionTitle}>Sélectionnez votre humeur (1-5)</Text>
        
        <View style={styles.moodGrid}>
          {[1, 2, 3, 4, 5].map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodButton,
                selectedMood === mood && styles.moodButtonSelected
              ]}
              onPress={() => selectMood(mood)}
            >
              <Text style={styles.moodIcon}>{getMoodEmoji(mood)}</Text>
              <Text style={styles.moodLabel}>{getMoodLabel(mood)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {showQuickTags && (
        <View style={styles.quickTags}>
          <Text style={styles.sectionTitle}>Niveau de stress</Text>
          <View style={styles.tagRow}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={`stress-${level}`}
                style={[
                  styles.tagButton,
                  selectedStress === level && styles.tagButtonSelected
                ]}
                onPress={() => selectStress(level)}
              >
                <Text style={styles.tagText}>{getStressLabel(level)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Niveau d'énergie</Text>
          <View style={styles.tagRow}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={`energy-${level}`}
                style={[
                  styles.tagButton,
                  selectedEnergy === level && styles.tagButtonSelected
                ]}
                onPress={() => selectEnergy(level)}
              >
                <Text style={styles.tagText}>{getEnergyLabel(level)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!selectedMood || !selectedStress || !selectedEnergy) && styles.saveButtonDisabled
            ]}
            onPress={saveMoodEntry}
            disabled={!selectedMood || !selectedStress || !selectedEnergy}
          >
            <Text style={styles.saveButtonText}>
              Sauvegarder (temps: {elapsedTime}s)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.insights}>
        <Text style={styles.sectionTitle}>Historique récent</Text>
        {moodHistory.slice(-3).reverse().map((entry, index) => (
          <View key={index} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyDate}>
                {new Date(entry.timestamp).toLocaleDateString('fr-FR')}
              </Text>
              <Text style={styles.historyMood}>
                {getMoodEmoji(entry.mood)} {getMoodLabel(entry.mood)}
              </Text>
            </View>
            <Text style={styles.historyDetails}>
              Stress: {getStressLabel(entry.stress)} • Énergie: {getEnergyLabel(entry.energy)}
            </Text>
          </View>
        ))}
        
        {moodHistory.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Aucune entrée d'humeur pour le moment. Commencez dès maintenant !
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E8',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: '#C8E6C9',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
  },
  timer: {
    fontSize: 14,
    color: '#388E3C',
    fontWeight: '600',
    marginTop: 8,
  },
  moodSelector: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#C8E6C9',
    minWidth: '18%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    backgroundColor: '#81C784',
    borderColor: '#388E3C',
    transform: [{ scale: 1.05 }],
  },
  moodIcon: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
  },
  quickTags: {
    padding: 20,
    backgroundColor: '#F1F8E9',
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  tagButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#C8E6C9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: '18%',
  },
  tagButtonSelected: {
    backgroundColor: '#66BB6A',
    borderColor: '#2E7D32',
  },
  tagText: {
    fontSize: 11,
    color: '#2E7D32',
    textAlign: 'center',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#BDBDBD',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  insights: {
    padding: 20,
  },
  historyCard: {
    padding: 16,
    backgroundColor: '#DCEDC8',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#388E3C',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  historyMood: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  historyDetails: {
    fontSize: 12,
    color: '#4A4A4A',
  },
  emptyCard: {
    padding: 20,
    backgroundColor: '#DCEDC8',
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#2E7D32',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});