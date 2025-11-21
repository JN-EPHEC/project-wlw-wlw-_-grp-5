import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  category: string;
  content: string;
  wordCount: number;
  timestamp: string;
}

const { width } = Dimensions.get('window');

const journalPrompts = {
  gratitude: [
    "Pour quoi êtes-vous le plus reconnaissant aujourd'hui?",
    "Décrivez un moment récent qui vous a apporté de la joie.",
    "Quelles sont trois petites choses qui ont rendu votre journée meilleure?",
    "Comment quelqu'un vous a-t-il aidé récemment?",
    "Quel aspect de votre vie prenez-vous parfois pour acquis?"
  ],
  reflection: [
    "Qu'avez-vous appris sur vous-même cette semaine?",
    "Comment avez-vous grandi en tant que personne ce mois-ci?",
    "Quel défi récent vous a rendu plus fort?",
    "Comment vos priorités ont-elles évolué cette année?",
    "Qu'est-ce qui vous motive vraiment dans la vie?"
  ],
  goals: [
    "Quel objectif aimeriez-vous atteindre ce mois-ci?",
    "Comment pourriez-vous améliorer une habitude quotidienne?",
    "Qu'est-ce qui vous empêche d'atteindre vos objectifs?",
    "Comment définiriez-vous le succès pour vous?",
    "Quelle compétence aimeriez-vous développer?"
  ],
  emotions: [
    "Comment vous sentez-vous vraiment en ce moment?",
    "Quelle émotion avez-vous eu du mal à gérer récemment?",
    "Qu'est-ce qui vous procure le plus de paix intérieure?",
    "Comment exprimez-vous vos émotions de manière saine?",
    "Quel sentiment aimeriez-vous ressentir plus souvent?"
  ],
  relationships: [
    "Comment pourriez-vous améliorer une relation importante?",
    "Qu'appréciez-vous le plus chez les personnes qui vous entourent?",
    "Comment montrez-vous votre affection aux autres?",
    "Quelle conversation difficile devriez-vous avoir?",
    "Comment construisez-vous la confiance dans vos relations?"
  ],
  growth: [
    "Dans quel domaine souhaitez-vous vous améliorer?",
    "Quel conseil donneriez-vous à votre moi d'il y a un an?",
    "Comment sortez-vous de votre zone de confort?",
    "Qu'est-ce qui vous inspire à continuer à grandir?",
    "Comment mesurez-vous votre développement personnel?"
  ]
};

export default function JournalScreen() {
  const [currentPrompt, setCurrentPrompt] = useState<{text: string, category: string}>({
    text: "", category: ""
  });
  const [journalText, setJournalText] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('gratitude');
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<any>(null);

  useEffect(() => {
    loadJournalEntries();
    generateDailyPrompt();
  }, []);

  useEffect(() => {
    const words = journalText.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    // Auto-save après 2 secondes d'inactivité
    if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    if (journalText.trim()) {
      setAutoSaveTimeout(setTimeout(autoSaveEntry, 2000));
    }
  }, [journalText]);

  const loadJournalEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem('mindly-journal-entries');
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des entrées:', error);
    }
  };

  const generateDailyPrompt = () => {
    const categories = Object.keys(journalPrompts);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    generatePromptFromCategory(randomCategory);
  };

  const generatePromptFromCategory = (category: string) => {
    const prompts = journalPrompts[category as keyof typeof journalPrompts];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt({ text: randomPrompt, category });
    setSelectedCategory(category);
  };

  const autoSaveEntry = async () => {
    if (!journalText.trim() || !currentPrompt.text) return;
    
    try {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        prompt: currentPrompt.text,
        category: currentPrompt.category,
        content: journalText,
        wordCount: wordCount,
        timestamp: new Date().toISOString()
      };

      const updatedEntries = [...entries, entry];
      await AsyncStorage.setItem('mindly-journal-entries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
    }
  };

  const saveEntry = async () => {
    if (!journalText.trim()) {
      Alert.alert('Attention', 'Veuillez écrire quelque chose avant de sauvegarder');
      return;
    }

    if (!currentPrompt.text) {
      Alert.alert('Attention', 'Aucun prompt sélectionné');
      return;
    }

    try {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        prompt: currentPrompt.text,
        category: currentPrompt.category,
        content: journalText,
        wordCount: wordCount,
        timestamp: new Date().toISOString()
      };

      const updatedEntries = [...entries, entry];
      await AsyncStorage.setItem('mindly-journal-entries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
      
      // Reset form
      setJournalText("");
      generateDailyPrompt();
      
      Alert.alert('Succès', 'Entrée sauvegardée avec succès!');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder votre entrée');
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      gratitude: '🙏',
      reflection: '🤔',
      goals: '🎯',
      emotions: '❤️',
      relationships: '👥',
      growth: '🌱'
    };
    return icons[category as keyof typeof icons] || '📝';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      gratitude: '#FFE0B2',
      reflection: '#E1BEE7',
      goals: '#BBDEFB',
      emotions: '#FFCDD2',
      relationships: '#C8E6C9',
      growth: '#F8BBD9'
    };
    return colors[category as keyof typeof colors] || '#E8F5E8';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal Guidé</Text>
        <Text style={styles.subtitle}>Réflexion et développement personnel</Text>
      </View>

      {/* Current Prompt */}
      <View style={[styles.promptCard, { backgroundColor: getCategoryColor(currentPrompt.category) }]}>
        <View style={styles.promptHeader}>
          <Text style={styles.promptIcon}>{getCategoryIcon(currentPrompt.category)}</Text>
          <View style={styles.promptMeta}>
            <Text style={styles.promptCategory}>{currentPrompt.category}</Text>
            <TouchableOpacity onPress={generateDailyPrompt} style={styles.newPromptBtn}>
              <Text style={styles.newPromptText}>Nouveau prompt</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.promptText}>{currentPrompt.text}</Text>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {Object.keys(journalPrompts).map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected,
                { backgroundColor: getCategoryColor(category) }
              ]}
              onPress={() => generatePromptFromCategory(category)}
            >
              <Text style={styles.categoryIcon}>{getCategoryIcon(category)}</Text>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Writing Area */}
      <View style={styles.writingSection}>
        <Text style={styles.sectionTitle}>Votre réflexion</Text>
        <TextInput
          style={styles.textInput}
          value={journalText}
          onChangeText={setJournalText}
          placeholder="Commencez votre réflexion ici..."
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
        />
        <View style={styles.writingMeta}>
          <Text style={styles.wordCount}>{wordCount} mots</Text>
          <Text style={styles.autoSave}>Sauvegarde automatique</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
          <Text style={styles.saveButtonText}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Entries */}
      <View style={styles.entriesSection}>
        <Text style={styles.sectionTitle}>Entrées récentes</Text>
        {entries.slice(-3).reverse().map((entry) => (
          <View key={entry.id} style={[styles.entryCard, { backgroundColor: getCategoryColor(entry.category) }]}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryDate}>{new Date(entry.timestamp).toLocaleDateString('fr-FR')}</Text>
              <Text style={styles.entryCategory}>{getCategoryIcon(entry.category)} {entry.category}</Text>
            </View>
            <Text style={styles.entryPreview} numberOfLines={2}>
              {entry.content}
            </Text>
            <Text style={styles.entryWords}>{entry.wordCount} mots</Text>
          </View>
        ))}
        
        {entries.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Aucune entrée pour le moment. Commencez votre première réflexion !
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
  promptCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  promptIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  promptMeta: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    textTransform: 'capitalize',
  },
  newPromptBtn: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  newPromptText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  promptText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoryButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonSelected: {
    borderColor: '#388E3C',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  writingSection: {
    margin: 20,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    fontSize: 16,
    color: '#000000',
    borderWidth: 2,
    borderColor: '#C8E6C9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  writingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  wordCount: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  autoSave: {
    fontSize: 12,
    color: '#4CAF50',
    fontStyle: 'italic',
  },
  actions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  entriesSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  entryCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#388E3C',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  entryCategory: {
    fontSize: 12,
    color: '#2E7D32',
    textTransform: 'capitalize',
  },
  entryPreview: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 8,
  },
  entryWords: {
    fontSize: 12,
    color: '#666',
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