import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo et titre */}
        <View style={styles.header}>
          <Text style={styles.logo}>🧠</Text>
          <Text style={styles.title}>MINDLY</Text>
          <Text style={styles.subtitle}>Votre compagnon bien-être mental</Text>
        </View>

        {/* Description */}
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Prenez soin de votre santé mentale avec des outils personnalisés, 
            un suivi d'humeur et le soutien d'une communauté bienveillante.
          </Text>
          
          <TouchableOpacity 
            style={styles.onboardingButton}
            onPress={() => router.push('/onboarding' as any)}
          >
            <Text style={styles.onboardingText}>🌸 Découvrir l'application</Text>
          </TouchableOpacity>
        </View>

        {/* Boutons d'action */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/auth/signup' as any)}
          >
            <Text style={styles.primaryButtonText}>S'inscrire</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/auth/login' as any)}
          >
            <Text style={styles.secondaryButtonText}>Se connecter</Text>
          </TouchableOpacity>
        </View>

        {/* Option invité */}
        <TouchableOpacity 
          style={styles.guestButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.guestText}>Continuer en tant qu'invité</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9', // Vert très clair
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  descriptionText: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  onboardingButton: {
    backgroundColor: 'rgba(27, 94, 32, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  onboardingText: {
    color: '#1B5E20',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 60,
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1B5E20',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1B5E20',
  },
  secondaryButtonText: {
    color: '#1B5E20',
    fontSize: 18,
    fontWeight: '600',
  },
  guestButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  guestText: {
    color: '#757575',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});