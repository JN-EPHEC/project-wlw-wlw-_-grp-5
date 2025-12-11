import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/firebaseConfig';

type MoodEntry = {
  mood?: string;
  emotions?: string[];
  energy?: number;
  stress?: number;
  createdAt?: Date;
  note?: string;
};

const moodWeights: Record<string, number> = {
  Super: 5,
  Bien: 4,
  Neutre: 3,
  Triste: 2,
  Anxieux: 1,
};

const moodFromScore = (score: number) => {
  if (score >= 4.5) return 'Super';
  if (score >= 3.5) return 'Bien';
  if (score >= 2.5) return 'Neutre';
  if (score >= 1.5) return 'Triste';
  return 'Anxieux';
};

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) {
        setEntries([]);
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'users', user.id, 'moodEntries'), orderBy('createdAt', 'asc'));
        const snap = await getDocs(q);
        const items: MoodEntry[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            mood: data.mood,
            emotions: data.emotions || [],
            energy: typeof data.energy === 'number' ? data.energy : undefined,
            stress: typeof data.stress === 'number' ? data.stress : undefined,
            note: data.note,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          };
        });
        setEntries(items);
      } catch (e) {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const now = new Date();

  const {
    avgMood,
    avgStress,
    avgEnergy,
    wellnessScore,
    lineData,
    emotionsShare,
    heatmap,
    quickInsights,
    triggers,
  } = useMemo(() => {
    if (!entries.length) {
      return {
        avgMood: '—',
        avgStress: '—',
        avgEnergy: '—',
        wellnessScore: 0,
        lineData: [],
        emotionsShare: [],
        heatmap: [],
        quickInsights: ['Pas encore de données.'],
        triggers: [],
      };
    }

    const last30 = entries.filter((e) => {
      const d = e.createdAt || now;
      return now.getTime() - d.getTime() <= 1000 * 60 * 60 * 24 * 30;
    });
    const last7 = entries.filter((e) => {
      const d = e.createdAt || now;
      return now.getTime() - d.getTime() <= 1000 * 60 * 60 * 24 * 7;
    });

    const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    const moodScores = last30.map((e) => moodWeights[e.mood || 'Neutre'] || 3);
    const energyScores = last30.map((e) => (typeof e.energy === 'number' ? e.energy : 0));
    const stressScores = last30.map((e) => (typeof e.stress === 'number' ? e.stress : 0));

    const moodAvg = avg(moodScores);
    const energyAvg = avg(energyScores);
    const stressAvg = avg(stressScores);

    const wellness =
      Math.round((moodAvg / 5) * 40 + (energyAvg / 10) * 30 + (1 - stressAvg / 10) * 20 + Math.min(last30.length, 7) * 1.4);

    const groupByDay = (list: MoodEntry[], days: number) => {
      const out: { label: string; mood: number; energy: number; stress: number }[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = date.toDateString();
        const dayEntries = list.filter((e) => (e.createdAt || now).toDateString() === key);
        const m = dayEntries.map((e) => moodWeights[e.mood || 'Neutre'] || 3);
        const en = dayEntries.map((e) => (typeof e.energy === 'number' ? e.energy : 0));
        const st = dayEntries.map((e) => (typeof e.stress === 'number' ? e.stress : 0));
        out.push({
          label: ['D', 'L', 'M', 'M', 'J', 'V', 'S'][date.getDay()],
          mood: m.length ? avg(m) : 0,
          energy: en.length ? avg(en) : 0,
          stress: st.length ? avg(st) : 0,
        });
      }
      return out;
    };

    const line = groupByDay(last7, 7);

    const emoCounts: Record<string, number> = {};
    last7.forEach((e) => e.emotions?.forEach((em) => (emoCounts[em] = (emoCounts[em] || 0) + 1)));
    const totalEmo = Object.values(emoCounts).reduce((a, b) => a + b, 0) || 1;
    const emoShare = Object.entries(emoCounts)
      .map(([label, value], idx) => ({
        label,
        value: Math.round((value / totalEmo) * 100),
        color: ['#7268F0', '#7BDCB5', '#F87171', '#F59E0B', '#34D399', '#94A3B8'][idx % 6],
      }))
      .slice(0, 6);

    const heat = Array.from({ length: 30 }).map((_, i) => {
      const date = new Date(now.getTime() - i * 86400000);
      const dayEntries = last30.filter((e) => (e.createdAt || now).toDateString() === date.toDateString());
      const score = dayEntries.length ? avg(dayEntries.map((e) => moodWeights[e.mood || 'Neutre'] || 3)) : 0;
      if (score >= 4) return 'high';
      if (score >= 2.5) return 'mid';
      if (score > 0) return 'low';
      return 'none';
    });

    const insights: string[] = [];
    if (line.length >= 2 && line[line.length - 1].mood >= line[0].mood) {
      insights.push('Ton humeur est plus stable cette semaine.');
    }
    if (line.length >= 2 && line[line.length - 1].energy >= line[0].energy + 0.5) {
      insights.push('Ton énergie a augmenté par rapport au début de semaine.');
    }
    const stressDrop = line.filter((v) => v.stress <= 3).length;
    if (stressDrop >= 3) insights.push('Le stress a diminué sur plusieurs jours.');
    if (!insights.length) insights.push('Continue à enregistrer pour plus d’insights.');

    const trig = [
      { label: 'Travail', value: 43, color: '#7268F0' },
      { label: 'Sommeil', value: 28, color: '#2DD4BF' },
      { label: 'Relations', value: 19, color: '#F59E0B' },
    ];

    return {
      avgMood: moodAvg ? moodFromScore(moodAvg) : '—',
      avgStress: stressAvg ? stressAvg.toFixed(1) : '—',
      avgEnergy: energyAvg ? energyAvg.toFixed(1) : '—',
      wellnessScore: Math.max(0, Math.min(100, wellness)),
      lineData: line,
      emotionsShare: emoShare,
      heatmap: heat,
      quickInsights: insights,
      triggers: trig,
    };
  }, [entries, now]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator style={{ marginTop: 32 }} color={theme.colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.backward" size={22} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Tableau de bord</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.quickGrid}>
          <View style={styles.quickCard}>
            <Text style={styles.quickLabel}>Humeur moyenne</Text>
            <Text style={styles.quickValue}>{avgMood}</Text>
          </View>
          <View style={styles.quickCard}>
            <Text style={styles.quickLabel}>Stress moyen</Text>
            <Text style={styles.quickValue}>{avgStress}</Text>
          </View>
          <View style={styles.quickCard}>
            <Text style={styles.quickLabel}>Energie moyenne</Text>
            <Text style={styles.quickValue}>{avgEnergy}</Text>
          </View>
          <View style={styles.quickCard}>
            <Text style={styles.quickLabel}>Wellness score</Text>
            <Text style={styles.quickValue}>{wellnessScore} / 100</Text>
          </View>
        </View>

        <View style={[styles.card, styles.row]}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{wellnessScore}</Text>
            <Text style={styles.scoreLabel}>/100</Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 14 }}>
            <Text style={styles.cardTitle}>Wellness score</Text>
            <Text style={styles.cardSubtitle}>Var. semaine : +6 pts (demo)</Text>
            <Text style={styles.aiText}>Basé sur humeur, énergie, stress inversé et constance des check-ins.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Evolution (7 jours)</Text>
            <Text style={styles.cardSubtitle}>Humeur · Energie · Stress</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#7268F0' }]} />
            <Text style={styles.legendText}>Humeur</Text>
            <View style={[styles.legendDot, { backgroundColor: '#2DD4BF' }]} />
            <Text style={styles.legendText}>Energie</Text>
            <View style={[styles.legendDot, { backgroundColor: '#F87171' }]} />
            <Text style={styles.legendText}>Stress</Text>
          </View>
          <View style={styles.chartMock}>
            {lineData.map((d, i) => (
              <View key={d.label + i} style={styles.chartCol}>
                <View style={[styles.lineDot, { bottom: d.mood * 8, backgroundColor: '#7268F0' }]} />
                <View style={[styles.lineDot, { bottom: d.energy * 8, backgroundColor: '#2DD4BF' }]} />
                <View style={[styles.lineDot, { bottom: d.stress * 8, backgroundColor: '#F87171' }]} />
                <Text style={styles.dayLabel}>{d.label}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.insight}>{quickInsights[0]}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Roue des émotions</Text>
            <Text style={styles.cardSubtitle}>Répartition hebdo</Text>
          </View>
          <View style={styles.pieRow}>
            <View style={styles.pieMock}>
              {emotionsShare.map((em, idx) => (
                <View key={em.label + idx} style={[styles.pieSlice, { backgroundColor: em.color }]} />
              ))}
            </View>
            <View style={{ flex: 1 }}>
              {emotionsShare.map((em) => (
                <View key={em.label} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: em.color }]} />
                  <Text style={styles.legendText}>
                    {em.label} · {em.value}%
                  </Text>
                </View>
              ))}
              <Text style={styles.insight}>
                {emotionsShare.length
                  ? `Tu as ressenti principalement ${emotionsShare[0].label} (${emotionsShare[0].value}%).`
                  : 'Enregistre des émotions pour voir la répartition.'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Heatmap d'humeur (30 jours)</Text>
          <View style={styles.heatmap}>
            {heatmap.map((v, idx) => (
              <View
                key={idx}
                style={[
                  styles.heatCell,
                  v === 'high' ? styles.heatHigh : v === 'mid' ? styles.heatMid : v === 'low' ? styles.heatLow : styles.heatNone,
                ]}
              />
            ))}
          </View>
          <Text style={styles.insight}>Couleur = humeur moyenne par jour. Continue tes check-ins !</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Statistiques clés</Text>
          <Text style={styles.statLine}>Humeur moyenne : {avgMood}</Text>
          <Text style={styles.statLine}>Stress moyen : {avgStress}</Text>
          <Text style={styles.statLine}>Energie moyenne : {avgEnergy}</Text>
          <Text style={styles.insight}>{quickInsights[0]}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Déclencheurs identifiés</Text>
          {triggers.map((t) => (
            <View key={t.label} style={styles.triggerRow}>
              <Text style={styles.triggerLabel}>{t.label}</Text>
              <View style={[styles.triggerBar, { width: `${t.value}%`, backgroundColor: t.color }]} />
              <Text style={styles.triggerValue}>{t.value}%</Text>
            </View>
          ))}
          <Text style={styles.insight}>Insight : le sommeil et le travail influencent fortement ton énergie.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ce que j’observe (IA)</Text>
          <Text style={styles.aiText}>
            • Ton stress baisse quand le sommeil est meilleur. Essaie 5 min de respiration avant de dormir. {'\n'}
            • Energie +2 pts vs semaine dernière : maintiens tes pauses actives. {'\n'}
            • Défi proposé : “Respiration 4-7-8” aujourd’hui.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16, paddingBottom: 32 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  quickCard: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#f5f7ff',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickLabel: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 },
  quickValue: { fontSize: 16, fontWeight: '800', color: theme.colors.textPrimary },
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
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.textPrimary },
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
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 6 },
  cardSubtitle: { fontSize: 13, color: theme.colors.textSecondary },
  cardValue: { fontSize: 28, fontWeight: '800', color: theme.colors.accent },
  row: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '800', color: theme.colors.textPrimary },
  divider: { width: 1, height: 50, backgroundColor: theme.colors.border },
  scoreCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 6,
    borderColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FF',
  },
  scoreValue: { fontSize: 28, fontWeight: '800', color: theme.colors.textPrimary },
  scoreLabel: { fontSize: 14, color: theme.colors.textSecondary },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: theme.colors.textSecondary },
  chartMock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    marginTop: 12,
    paddingHorizontal: 6,
  },
  chartCol: { flex: 1, alignItems: 'center', position: 'relative' },
  lineDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
  dayLabel: { marginTop: 4, color: theme.colors.textSecondary, fontSize: 12 },
  insight: { color: theme.colors.textSecondary, marginTop: 8, fontSize: 13 },
  pieRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  pieMock: { width: 70, height: 140, justifyContent: 'center' },
  pieSlice: { width: '100%', height: 18, borderRadius: 10, marginVertical: 2 },
  heatmap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  heatCell: { width: 20, height: 20, borderRadius: 6, backgroundColor: '#E5E7EB' },
  heatHigh: { backgroundColor: '#34D399' },
  heatMid: { backgroundColor: '#FCD34D' },
  heatLow: { backgroundColor: '#F87171' },
  heatNone: { backgroundColor: '#E5E7EB' },
  statLine: { color: theme.colors.textSecondary, marginTop: 4, fontSize: 13 },
  triggerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  triggerLabel: { width: 90, color: theme.colors.textSecondary, fontSize: 13 },
  triggerBar: { flex: 1, height: 8, borderRadius: 6, backgroundColor: '#7268F0' },
  triggerValue: { color: theme.colors.textSecondary, fontSize: 13 },
  aiText: { color: theme.colors.textSecondary, marginTop: 8, fontSize: 14, lineHeight: 20 },
});
