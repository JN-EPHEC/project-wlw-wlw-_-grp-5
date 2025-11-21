import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CommunityScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Communauté</Text>
        <Text style={styles.subtitle}>Un espace bienveillant et anonyme</Text>
      </View>

      <View style={styles.communityFeatures}>
        <View style={styles.feature}>
          <Text style={styles.featureEmoji}>🔐</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>100% Anonyme</Text>
            <Text style={styles.featureText}>Partagez en toute confidentialité</Text>
          </View>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureEmoji}>💚</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Bienveillance</Text>
            <Text style={styles.featureText}>Espace de soutien mutuel</Text>
          </View>
        </View>

        <View style={styles.feature}>
          <Text style={styles.featureEmoji}>💬</Text>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Partage d'expériences</Text>
            <Text style={styles.featureText}>Conseils et témoignages</Text>
          </View>
        </View>
      </View>

      <View style={styles.topics}>
        <Text style={styles.sectionTitle}>Sujets populaires</Text>
        
        <View style={styles.topicsList}>
          <TouchableOpacity style={styles.topicCard}>
            <Text style={styles.topicTitle}>#stress-études</Text>
            <Text style={styles.topicActivity}>42 messages • Actif maintenant</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.topicCard}>
            <Text style={styles.topicTitle}>#anxiété-sociale</Text>
            <Text style={styles.topicActivity}>28 messages • 2h</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.topicCard}>
            <Text style={styles.topicTitle}>#motivation</Text>
            <Text style={styles.topicActivity}>15 messages • 5h</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.topicCard}>
            <Text style={styles.topicTitle}>#bien-être</Text>
            <Text style={styles.topicActivity}>38 messages • 1j</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.guidelines}>
        <Text style={styles.guidelinesEmoji}>ℹ️</Text>
        <Text style={styles.guidelinesText}>
          Respectons la bienveillance et l'entraide dans nos échanges
        </Text>
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
  communityFeatures: {
    padding: 20,
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#C8E6C9',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureEmoji: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
    gap: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  featureText: {
    fontSize: 14,
    color: '#000000',
  },
  topics: {
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  topicsList: {
    gap: 12,
  },
  topicCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#DCEDC8',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1B5E20',
  },
  topicActivity: {
    fontSize: 14,
    color: '#000000',
  },
  guidelines: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    margin: 20,
    borderRadius: 12,
    backgroundColor: '#A5D6A7',
  },
  guidelinesEmoji: {
    fontSize: 16,
  },
  guidelinesText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
    fontWeight: '500',
  },
});