import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';

const ideas = [
  'Quelqu un t a souri aujourd hui ?',
  'As tu fait un petit progres ?',
  'Un moment de calme que tu as apprecie ?',
  'Quelqu un t a aide ?',
  'Tu as pris soin de toi (repos, hydratation) ?',
];

export default function ChallengeGratitude() {
  const router = useRouter();
  const { user } = useAuth();
  const [g1, setG1] = useState('');
  const [g2, setG2] = useState('');
  const [g3, setG3] = useState('');

  const fillIdea = () => {
    const idea = ideas[Math.floor(Math.random() * ideas.length)];
    if (!g1) return setG1(idea);
    if (!g2) return setG2(idea);
    if (!g3) return setG3(idea);
    setG3(idea);
  };

  const onValidate = async () => {
    if (!g1 || !g2 || !g3) {
      Alert.alert('Merci de remplir 3 choses positives');
      return;
    }
    if (!user?.id) {
      Alert.alert('Connexion requise', 'Connecte toi pour enregistrer tes gratitudes.');
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.id, 'gratitudeEntries'), {
        items: [g1, g2, g3],
        completedAt: serverTimestamp(),
      });
      await addDoc(collection(db, 'users', user.id, 'completedChallenges'), {
        challengeId: 'c2',
        title: '3 choses positives',
        completedAt: serverTimestamp(),
      });
      Alert.alert('Merci !', 'Tes 3 gratitudes sont enregistrees.');
      setG1('');
      setG2('');
      setG3('');
    } catch (e) {
      Alert.alert('Enregistrement local uniquement', 'Impossible de sauvegarder sur Firestore.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.backward" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>3 choses positives</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Prends une minute pour noter trois choses qui t ont fait du bien.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chose positive n°1</Text>
          <TextInput
            style={styles.input}
            placeholder="Ecris ici..."
            placeholderTextColor="#9CA3AF"
            value={g1}
            onChangeText={setG1}
          />

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Chose positive n°2</Text>
          <TextInput
            style={styles.input}
            placeholder="Ecris ici..."
            placeholderTextColor="#9CA3AF"
            value={g2}
            onChangeText={setG2}
          />

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Chose positive n°3</Text>
          <TextInput
            style={styles.input}
            placeholder="Ecris ici..."
            placeholderTextColor="#9CA3AF"
            value={g3}
            onChangeText={setG3}
          />

          <TouchableOpacity style={styles.secondaryButton} onPress={fillIdea} activeOpacity={0.85}>
            <IconSymbol name="sparkles" size={16} color={theme.colors.accent} />
            <Text style={styles.secondaryText}>Inspiration IA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.primaryButton, { marginTop: 14 }]} onPress={onValidate} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Valider mes 3 gratitudes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Succès</Text>
          <Text style={styles.sectionText}>
            💛 Merci d avoir cultive la gratitude. Ca booste ton bien-etre !
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
  },
  title: { fontSize: 20, fontWeight: '800', color: theme.colors.textPrimary },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 6 },
  sectionText: { color: theme.colors.textSecondary, fontSize: 14, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 12,
    color: theme.colors.textPrimary,
    backgroundColor: '#fff',
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F5F6FA',
  },
  secondaryText: { color: theme.colors.textPrimary, fontWeight: '700' },
});
