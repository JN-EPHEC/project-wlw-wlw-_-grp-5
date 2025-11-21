import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers l'écran de bienvenue
    // Plus tard, vous pourrez ajouter ici la logique pour vérifier 
    // si l'utilisateur est déjà connecté
    router.replace('/welcome' as any);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F8E9' }}>
      <ActivityIndicator size="large" color="#1B5E20" />
    </View>
  );
}