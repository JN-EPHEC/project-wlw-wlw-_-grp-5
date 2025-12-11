import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

type Category = 'Tous' | 'Psychologue' | 'Coach de vie' | 'Thérapeute' | 'Conseiller';

interface Expert {
  id: string;
  name: string;
  role: Category;
  description: string;
}

const categories: Category[] = ['Tous', 'Psychologue', 'Coach de vie', 'Thérapeute', 'Conseiller'];

const experts: Expert[] = []; // Liste vide pour reproduire l'état "Aucun coach trouvé"

export default function CoachesScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>('Tous');
  const [search, setSearch] = useState('');

  const filteredExperts = useMemo(() => {
    return experts.filter((exp) => {
      const matchCategory = activeCategory === 'Tous' || exp.role === activeCategory;
      const matchSearch = exp.name.toLowerCase().includes(search.toLowerCase()) || exp.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, search]);

  const renderExpert = ({ item }: { item: Expert }) => (
    <View style={styles.expertCard}>
      <View style={styles.expertInfo}>
        <Text style={styles.expertName}>{item.name}</Text>
        <Text style={styles.expertRole}>{item.role}</Text>
        <Text style={styles.expertDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <TouchableOpacity style={styles.contactButton} activeOpacity={0.85}>
        <Text style={styles.contactButtonText}>Contacter</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Coachs &amp; Experts</Text>
        <Text style={styles.subtitle}>Trouvez le professionnel qui vous correspond</Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#6b7280" style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un coach..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.chipsRow}>
        {categories.map((cat) => {
          const selected = cat === activeCategory;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, selected && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.85}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {filteredExperts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Aucun coach trouvé</Text>
        </View>
      ) : (
        <FlatList
          data={filteredExperts}
          keyExtractor={(item) => item.id}
          renderItem={renderExpert}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 12,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#111827',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  chipActive: {
    backgroundColor: '#1E8A6A',
    borderColor: '#1E8A6A',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  chipTextActive: {
    color: '#fff',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  emptyText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  expertCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  expertInfo: {
    marginBottom: 10,
  },
  expertName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  expertRole: {
    fontSize: 13,
    color: '#1E8A6A',
    marginTop: 2,
  },
  expertDesc: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 4,
  },
  contactButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#1E8A6A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});

