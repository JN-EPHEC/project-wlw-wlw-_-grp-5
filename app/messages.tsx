import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

const segments = [
  { key: 'mindsafe', label: 'MindSafe', icon: 'shield-checkmark-outline' },
  { key: 'community', label: 'Communauté', icon: 'people-outline' },
  { key: 'private', label: 'Privés', icon: 'lock-closed-outline' },
];

export default function MessagesScreen() {
  const [active, setActive] = useState<'mindsafe' | 'community' | 'private'>('mindsafe');
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <View style={styles.segmentContainer}>
        {segments.map((seg) => {
          const selected = active === seg.key;
          return (
            <TouchableOpacity
              key={seg.key}
              style={[styles.segment, selected && styles.segmentActive]}
              onPress={() => setActive(seg.key as any)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={seg.icon as any}
                size={16}
                color={selected ? '#fff' : '#111'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.segmentLabel, selected && styles.segmentLabelActive]}>{seg.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Ionicons name="heart" size={18} color="#1E8A6A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>MindSafe</Text>
            <Text style={styles.cardSubtitle}>IA empathique • Toujours disponible</Text>
          </View>
        </View>

        <View style={styles.welcome}>
          <View style={styles.welcomeIcon}>
            <Ionicons name="heart-outline" size={26} color="#1E8A6A" />
          </View>
          <Text style={styles.welcomeTitle}>Bienvenue !</Text>
          <Text style={styles.welcomeText} numberOfLines={3}>
            Je suis MindSafe, ton compagnon bienveillant. N’hésite pas à me parler de ce qui te préoccupe.
          </Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Écris ton message..."
            placeholderTextColor={theme.colors.textSecondary}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} activeOpacity={0.85}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
  },
  header: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    padding: 4,
    marginVertical: 8,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  segmentActive: {
    backgroundColor: '#4b5563',
  },
  segmentLabel: {
    color: '#111',
    fontWeight: '700',
    fontSize: 14,
  },
  segmentLabelActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E6F4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  welcome: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  welcomeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F4EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  welcomeText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
  },
  sendButton: {
    backgroundColor: '#1E8A6A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

