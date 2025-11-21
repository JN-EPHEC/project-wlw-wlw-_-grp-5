import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: '1',
    title: 'Bienvenue dans MINDLY',
    subtitle: 'Votre compagnon bien-être',
    description: 'Découvrez une approche personnalisée pour prendre soin de votre santé mentale et émotionnelle.',
    icon: '🌸',
    color: '#E8F5E8'
  },
  {
    id: '2',
    title: 'Suivez votre humeur',
    subtitle: 'Jour après jour',
    description: 'Enregistrez vos émotions quotidiennes et observez les tendances pour mieux vous comprendre.',
    icon: '🌿',
    color: '#F0F8F0'
  },
  {
    id: '3',
    title: 'Communauté bienveillante',
    subtitle: 'Vous n\'êtes pas seul(e)',
    description: 'Échangez de manière anonyme avec une communauté qui vous comprend et vous soutient.',
    icon: '🤝',
    color: '#F8FCF8'
  },
  {
    id: '4',
    title: 'MindSafe IA',
    subtitle: 'Votre assistant personnel',
    description: 'Recevez des conseils personnalisés et un soutien disponible 24h/24 grâce à notre IA bienveillante.',
    icon: '🤖',
    color: '#E8F5E8'
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < onboardingSteps.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      // Dernier écran, aller à l'inscription
      router.push('/auth/signup' as any);
    }
  };

  const handleSkip = () => {
    router.push('/welcome' as any);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const renderOnboardingStep = ({ item }: { item: OnboardingStep }) => (
    <View style={[styles.stepContainer, { backgroundColor: item.color }]}>
      <View style={styles.stepContent}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingSteps.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            { backgroundColor: index === currentIndex ? '#1B5E20' : '#C8E6C9' }
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec bouton Skip */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <FlatList
        ref={flatListRef}
        data={onboardingSteps}
        renderItem={renderOnboardingStep}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />

      {/* Footer avec navigation */}
      <View style={styles.footer}>
        {renderDots()}
        
        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <TouchableOpacity 
              style={[styles.button, styles.previousButton]}
              onPress={handlePrevious}
            >
              <Text style={styles.previousButtonText}>Précédent</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingSteps.length - 1 ? 'Commencer' : 'Suivant'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },
  skipText: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '500',
  },
  stepContainer: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContent: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 40,
  },
  icon: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  previousButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1B5E20',
  },
  previousButtonText: {
    color: '#1B5E20',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#1B5E20',
    flex: 1,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});