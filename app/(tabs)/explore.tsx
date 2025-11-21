import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Exercise {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'meditation' | 'mindfulness' | 'relaxation' | 'movement';
  duration: number; // en minutes
  difficulty: 'facile' | 'moyen' | 'avancé';
  isFavorite: boolean;
}

export default function ExploreScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadExercises();
    loadFavorites();
  }, []);

  const loadExercises = () => {
    const exerciseLibrary: Exercise[] = [
      {
        id: '1',
        title: 'Respiration 4-7-8',
        description: 'Technique de respiration apaisante pour réduire le stress et favoriser le sommeil. Inspirez pendant 4 secondes, retenez pendant 7, expirez pendant 8.',
        category: 'breathing',
        duration: 5,
        difficulty: 'facile',
        isFavorite: false
      },
      {
        id: '2',
        title: 'Méditation de pleine conscience',
        description: 'Exercice de méditation guidée pour développer l\'attention au moment présent et réduire l\'anxiété.',
        category: 'meditation',
        duration: 10,
        difficulty: 'moyen',
        isFavorite: false
      },
      {
        id: '3',
        title: 'Scan corporel',
        description: 'Exercice de relaxation progressive qui consiste à porter attention à chaque partie du corps pour relâcher les tensions.',
        category: 'relaxation',
        duration: 15,
        difficulty: 'facile',
        isFavorite: false
      },
      {
        id: '4',
        title: 'Marche méditative',
        description: 'Exercice de mouvement conscient qui combine marche lente et attention à l\'instant présent.',
        category: 'movement',
        duration: 20,
        difficulty: 'facile',
        isFavorite: false
      },
      {
        id: '5',
        title: 'Observation des pensées',
        description: 'Technique de mindfulness pour observer ses pensées sans jugement et développer une distance émotionnelle.',
        category: 'mindfulness',
        duration: 8,
        difficulty: 'moyen',
        isFavorite: false
      },
      {
        id: '6',
        title: 'Relaxation musculaire progressive',
        description: 'Méthode de détente profonde par contraction et relâchement successifs des groupes musculaires.',
        category: 'relaxation',
        duration: 25,
        difficulty: 'moyen',
        isFavorite: false
      },
      {
        id: '7',
        title: 'Respiration carrée',
        description: 'Exercice rythmé : inspirez 4 secondes, retenez 4 secondes, expirez 4 secondes, pause 4 secondes.',
        category: 'breathing',
        duration: 7,
        difficulty: 'facile',
        isFavorite: false
      },
      {
        id: '8',
        title: 'Méditation de gratitude',
        description: 'Pratique méditative focalisée sur la reconnaissance et l\'appréciation des aspects positifs de la vie.',
        category: 'meditation',
        duration: 12,
        difficulty: 'facile',
        isFavorite: false
      }
    ];

    setExercises(exerciseLibrary);
  };

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('mindly-exercise-favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  };

  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem('mindly-exercise-favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const toggleFavorite = async (exerciseId: string) => {
    const newFavorites = favorites.includes(exerciseId)
      ? favorites.filter(id => id !== exerciseId)
      : [...favorites, exerciseId];
    
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
  };

  const startExercise = (exercise: Exercise) => {
    Alert.alert(
      `${exercise.title}`,
      `Durée : ${exercise.duration} minutes\nDifficulté : ${exercise.difficulty}\n\n${exercise.description}\n\nÊtes-vous prêt(e) à commencer ?`,
      [
        { text: 'Plus tard', style: 'cancel' },
        { 
          text: 'Commencer', 
          onPress: () => {
            Alert.alert('Exercice démarré !', `L'exercice "${exercise.title}" est maintenant en cours. Prenez votre temps et respirez profondément.`);
          }
        }
      ]
    );
  };

  const getCategoryColor = (category: Exercise['category']) => {
    switch (category) {
      case 'breathing': return '#3b82f6';
      case 'meditation': return '#8b5cf6';
      case 'mindfulness': return '#10b981';
      case 'relaxation': return '#f59e0b';
      case 'movement': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryLabel = (category: Exercise['category']) => {
    switch (category) {
      case 'breathing': return 'Respiration';
      case 'meditation': return 'Méditation';
      case 'mindfulness': return 'Pleine conscience';
      case 'relaxation': return 'Relaxation';
      case 'movement': return 'Mouvement';
      default: return 'Autre';
    }
  };

  const getDifficultyColor = (difficulty: Exercise['difficulty']) => {
    switch (difficulty) {
      case 'facile': return '#22c55e';
      case 'moyen': return '#f59e0b';
      case 'avancé': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'breathing', label: 'Respiration' },
    { id: 'meditation', label: 'Méditation' },
    { id: 'mindfulness', label: 'Pleine conscience' },
    { id: 'relaxation', label: 'Relaxation' },
    { id: 'movement', label: 'Mouvement' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorer</Text>
        <Text style={styles.subtitle}>Exercices de bien-être</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Rechercher un exercice..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.exercisesGrid}>
          {filteredExercises.map((exercise) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={[
                  styles.categoryTag,
                  { backgroundColor: getCategoryColor(exercise.category) }
                ]}>
                  <Text style={styles.categoryTagText}>
                    {getCategoryLabel(exercise.category)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleFavorite(exercise.id)}
                  style={styles.favoriteButton}
                >
                  <Text style={styles.favoriteIcon}>
                    {favorites.includes(exercise.id) ? '❤️' : '🤍'}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.exerciseTitle}>{exercise.title}</Text>
              <Text style={styles.exerciseDescription} numberOfLines={3}>
                {exercise.description}
              </Text>

              <View style={styles.exerciseDetails}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseInfoText}>
                    ⏱️ {exercise.duration} min
                  </Text>
                  <View style={[
                    styles.difficultyTag,
                    { backgroundColor: getDifficultyColor(exercise.difficulty) }
                  ]}>
                    <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.startButton}
                onPress={() => startExercise(exercise)}
              >
                <Text style={styles.startButtonText}>Commencer</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Aucun exercice trouvé.{'\n'}
              Essayez de modifier vos critères de recherche.
            </Text>
          </View>
        )}

        <View style={styles.tip}>
          <Text style={styles.tipTitle}>💡 Conseil</Text>
          <Text style={styles.tipText}>
            Commencez par des exercices faciles de 5-10 minutes. 
            La régularité est plus importante que la durée !
          </Text>
        </View>
      </ScrollView>
    </View>
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
    backgroundColor: '#10b981',
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
  content: {
    flex: 1,
    padding: 15,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  exercisesGrid: {
    gap: 15,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseDetails: {
    marginBottom: 15,
  },
  exerciseInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseInfoText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  difficultyTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  tip: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047857',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#065f46',
    lineHeight: 20,
  },
});