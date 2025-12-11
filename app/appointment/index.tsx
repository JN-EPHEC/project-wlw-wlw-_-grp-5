import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';

export default function AppointmentScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.headerGradient[0], theme.colors.headerGradient[1]]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.header}
      >
        <Text style={styles.title}>Prendre un rendez-vous</Text>
        <Text style={styles.subtitle}>La fonctionnalite arrive bientot</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bientot disponible</Text>
          <Text style={styles.cardText}>
            Nous preparons une experience premium pour reserver un accompagnement avec nos experts bien-etre.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/')} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Revenir a l accueil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  header: {
    paddingTop: 52,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 14, color: '#E7E9FF', marginTop: 6 },
  content: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(31,42,68,0.08)',
    shadowColor: 'rgba(31,42,68,0.25)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1F2A44', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#6B6F85', lineHeight: 20, marginBottom: 16 },
  button: {
    backgroundColor: '#7268F0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
