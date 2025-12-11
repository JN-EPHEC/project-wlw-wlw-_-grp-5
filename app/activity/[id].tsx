import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';

const activities = {
  g1: {
    title: 'Yoga matinal pour la clarte mentale',
    description: 'Yoga doux pour apaiser l esprit et renforcer la concentration.',
    duration: '5-7 min',
    steps: ['Respiration d ancrage', 'Etirements doux', 'Postures fluides', 'Relaxation finale'],
    message: 'Bien joue, tu as reveille ton corps en douceur.',
    cta: 'Continuer',
  },
  g2: {
    title: 'Meditation anti-anxiete (5 min)',
    description: 'Meditation courte et guidee pour apaiser les tensions mentales.',
    duration: '5 min',
    steps: ['Respiration lente', 'Visualisation', 'Accueil des emotions', 'Affirmation finale'],
    message: 'Respiration + visualisation terminees.',
    cta: 'Commencer',
  },
  g3: {
    title: 'Boost d energie rapide',
    description: 'Routine express pour retrouver ton energie.',
    duration: '3 min',
    steps: ['Respiration dynamisante', 'Etirements rapides', 'Micro-mouvement'],
    message: 'Energie relancee.',
    cta: 'Lancer',
  },
  g4: {
    title: 'Decompression apres les cours / travail',
    description: 'Libere la pression accumulee et relache le mental.',
    duration: '6 min',
    steps: ['Respiration lente', 'Etirements nuque/epaules', 'Pause visuelle', 'Relax'],
    message: 'Tension relachee.',
    cta: 'Commencer',
  },
  g5: {
    title: 'Mini-journal guide',
    description: 'Reponds a trois questions pour clarifier ton esprit.',
    duration: '4 min',
    steps: [
      'Question 1 : Comment te sens-tu ?',
      'Question 2 : Qu est-ce qui t a fait du bien ?',
      'Question 3 : Que veux-tu pour demain ?',
    ],
    message: 'Journal complet, bravo.',
    cta: 'Ouvrir',
  },
  g6: {
    title: 'Scan corporel anti-stress',
    description: 'Relache les tensions par un scan corporel guide.',
    duration: '6 min',
    steps: ['Respiration lente', 'Scanner tete -> pieds', 'Relacher chaque zone', 'Conclusion calme'],
    message: 'Corps detendu.',
    cta: 'Commencer',
  },
} as const;

export default function ActivityDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const data = useMemo(() => activities[id as keyof typeof activities], [id]);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.pageTitle}>Activite introuvable</Text>
      </SafeAreaView>
    );
  }

  const nextStep = () => {
    if (stepIndex < data.steps.length - 1) setStepIndex(stepIndex + 1);
    else setDone(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.backward" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>{data.title}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.meta}>{data.duration}</Text>
          <Text style={styles.sectionTitle}>{data.description}</Text>
          <Text style={styles.sectionText}>Suis les etapes, avance a ton rythme.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Etapes</Text>
          {data.steps.map((s, idx) => (
            <View key={s} style={[styles.stepRow, idx === stepIndex && styles.stepActive]}>
              <View style={[styles.stepDot, idx === stepIndex && styles.stepDotActive]} />
              <Text style={[styles.stepText, idx === stepIndex && styles.stepTextActive]}>
                {idx + 1}. {s}
              </Text>
            </View>
          ))}
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={nextStep}>
            <Text style={styles.primaryButtonText}>{done ? 'Terminer' : stepIndex === 0 ? data.cta : 'Etape suivante'}</Text>
          </TouchableOpacity>
          {done && <Text style={styles.insight}>🎉 {data.message || 'Activite terminee.'}</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Call to action</Text>
          <Text style={styles.sectionText}>
            Quand tu te sens pret, lance l activite et suis les etapes. Rappelle-toi : quelques minutes suffisent pour faire du bien.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 24 },
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
  title: { fontSize: 18, fontWeight: '800', color: theme.colors.textPrimary, flex: 1, marginLeft: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  meta: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 6 },
  sectionText: { fontSize: 13, color: theme.colors.textSecondary, lineHeight: 20 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.colors.border },
  stepDotActive: { backgroundColor: theme.colors.accent },
  stepText: { color: theme.colors.textSecondary, fontSize: 13 },
  stepTextActive: { color: theme.colors.textPrimary, fontWeight: '700' },
  primaryButton: { marginTop: 12, backgroundColor: theme.colors.accent, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  insight: { color: theme.colors.textSecondary, marginTop: 8, fontSize: 13 },
});
