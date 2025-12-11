import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';
import { db } from '@/firebaseConfig';
import { useAuth } from '@/contexts/AuthContext';

const TOTAL_SECONDS = 10 * 60; // 10 minutes

export default function ChallengePause() {
  const router = useRouter();
  const { user } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const circleAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  useEffect(() => {
    if (running) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(circleAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
          Animated.timing(circleAnim, { toValue: 0, duration: 4000, useNativeDriver: true }),
        ])
      ).start();
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setRunning(false);
            setDone(true);
            clearInterval(intervalRef.current as NodeJS.Timeout);
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
      Alert.alert('Connexion requise', 'Connecte-toi pour enregistrer la pause.');
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.id, 'completedChallenges'), {
        challengeId: 'c3',
        title: 'Pause 10 minutes',
        completedAt: serverTimestamp(),
      });
    } catch (_) {
      // ignore errors
    }
  };

  const suggestions = [
    'Bois un verre d’eau',
    'Étire ton dos',
    'Regarde dehors une minute',
    'Respire lentement',
    'Marche 1 minute dans la pièce',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.backward" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Pause 10 minutes</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Fais une pause sans écran et respire.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Minuteur</Text>
          <View style={styles.timerBox}>
            <Animated.View
              style={[
                styles.timerCircle,
                {
                  transform: [
                    {
                      scale: circleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.1] }),
                    },
                  ],
                },
              ]}
            />
            <Text style={styles.timerText}>
              {minutes}:{seconds}
            </Text>
          </View>
          <TouchableOpacity style={[styles.primaryButton, { marginTop: 12 }]} onPress={onStart} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>{done ? 'Recommencer' : running ? 'En cours...' : 'Commencer la pause'}</Text>
          </TouchableOpacity>
          {done && <Text style={styles.congrats}>🌿 Bien joué ! Prendre une pause améliore ton calme et ta concentration.</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Suggestions pendant la pause</Text>
          {suggestions.map((sug) => (
            <View key={sug} style={styles.suggestionRow}>
              <View style={styles.suggestionDot} />
              <Text style={styles.suggestionText}>{sug}</Text>
            </View>
          ))}
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
  timerBox: { alignItems: 'center', justifyContent: 'center', marginVertical: 12 },
  timerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(114,104,240,0.12)',
    borderWidth: 3,
    borderColor: '#7268F0',
  },
  timerText: { position: 'absolute', fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary },
  primaryButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  congrats: { marginTop: 10, textAlign: 'center', color: theme.colors.textPrimary, fontWeight: '700' },
  suggestionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  suggestionDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7268F0' },
  suggestionText: { color: theme.colors.textSecondary, fontSize: 14 },
});
