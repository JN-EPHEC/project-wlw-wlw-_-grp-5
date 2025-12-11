import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';

const faqList = [
  { question: 'Comment Mindly protège mes données ?', answer: 'Nous chiffrons vos données et respectons le RGPD.' },
  { question: 'Puis-je utiliser Mindly gratuitement ?', answer: 'Oui, les fonctionnalités essentielles sont gratuites.' },
  { question: 'Comment contacter un professionnel ?', answer: 'Depuis l’appli, vous pouvez demander un rendez-vous sécurisé.' },
];

export default function FAQScreen() {
  const [userQuestion, setUserQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const handleAsk = () => {
    if (!userQuestion.trim()) return;
    // Simulation d’une réponse IA (à remplacer par un appel backend/IA)
    setAiAnswer("Merci pour ta question ! Notre IA travaille dessus. En attendant : Mindly reste confidentiel et anonyme pour protéger tes échanges.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>FAQ</Text>
        <Text style={styles.subtitle}>Questions fréquentes et réponses rapides.</Text>

        <View style={styles.list}>
          {faqList.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.questionRow}>
                <IconSymbol name="questionmark.circle.fill" size={18} color={theme.colors.accent} />
                <Text style={styles.question}>{item.question}</Text>
              </View>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.askCard}>
          <Text style={styles.sectionTitle}>Poser une question</Text>
          <TextInput
            style={styles.input}
            placeholder="Écris ta question ici..."
            placeholderTextColor={theme.colors.textSecondary}
            value={userQuestion}
            onChangeText={setUserQuestion}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleAsk} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Envoyer</Text>
          </TouchableOpacity>
          {aiAnswer && (
            <View style={styles.aiAnswer}>
              <Text style={styles.aiTitle}>Réponse de l’IA</Text>
              <Text style={styles.aiText}>{aiAnswer}</Text>
            </View>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  question: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  answer: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  askCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.card,
  },
  button: {
    marginTop: 10,
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  aiAnswer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.accentLight + '40',
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  aiText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
});
