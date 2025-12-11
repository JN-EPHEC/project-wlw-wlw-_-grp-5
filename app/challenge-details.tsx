import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';

const TOTAL_SECONDS = 5 * 60; // 5 minutes

export default function ChallengeDetails() {
  const router = useRouter();
  const { user } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  const startBreathAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
      ])
    ).start();
  };

  useEffect(() => {
    if (running) {
      startBreathAnimation();
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setRunning(false);
            setDone(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            recordCompletion();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const onStart = () => {
    setDone(false);
    setSecondsLeft(TOTAL_SECONDS);
    setRunning(true);
  };

  const recordCompletion = async () => {
    if (!user?.id) {
      Alert.alert('Connexion requise', 'Connecte-toi pour enregistrer la complétion du défi.');
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.id, 'completedChallenges'), {
        challengeId: 'c1',
        title: '5 min de respiration',
        completedAt: serverTimestamp(),
      });
    } catch (e) {
      // Sans blocage si Firestore échoue
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.backward" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>5 min de respiration</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Respiration guidée pour calmer le stress</Text>
          <Text style={styles.sectionText}>
            Concentre-toi sur ta respiration pendant 5 minutes. Suis les étapes ci-dessous pour une respiration carrée apaisante.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Étapes guidées</Text>
          {[
            {
              title: 'Étape 1 — Prépare-toi (20 sec)',
              desc: 'Assieds-toi confortablement, relâche tes épaules.',
            },
            {
              title: 'Étape 2 — Respiration carrée (4 min)',
              desc: 'Inspire 4 sec · Garde 4 sec · Expire 4 sec · Garde 4 sec.',
            },
            {
              title: 'Étape 3 — Retour au calme (40 sec)',
              desc: 'Observe comment ton corps se sent.',
            },
          ].map((step, idx) => (
            <View key={step.title} style={[styles.stepCard, idx === 2 && { borderBottomWidth: 0 }]}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Animation respiratoire</Text>
          <View style={styles.breathContainer}>
            <Animated.View style={[styles.breathCircle, { transform: [{ scale: scaleAnim }] }]} />
          </View>
          <Text style={styles.timer}>{minutes}:{seconds}</Text>
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 12 }]}
            onPress={onStart}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>{done ? 'Recommencer' : running ? 'En cours...' : 'Commencer la séance'}</Text>
          </TouchableOpacity>
          {done && <Text style={styles.congrats}>🎉 Bravo ! Tu as terminé ton exercice de respiration.</Text>}
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
  stepCard: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 10,
  },
  stepTitle: { fontWeight: '700', color: theme.colors.textPrimary, fontSize: 14 },
  stepDesc: { color: theme.colors.textSecondary, marginTop: 4, fontSize: 13 },
  breathContainer: { alignItems: 'center', marginVertical: 12 },
  breathCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(114,104,240,0.12)',
    borderWidth: 2,
    borderColor: '#7268F0',
  },
  timer: { textAlign: 'center', fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, marginTop: 8 },
  primaryButton: {
    marginTop: 10,
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  congrats: { color: theme.colors.textPrimary, textAlign: 'center', marginTop: 10, fontWeight: '700' },
});
