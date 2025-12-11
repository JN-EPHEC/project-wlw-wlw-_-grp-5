import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function JoinCommunityScreen() {
  const { inviteCode } = useLocalSearchParams<{ inviteCode: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [communityData, setCommunityData] = useState<any>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    // Simuler la récupération des infos de la communauté depuis le code d'invitation
    setTimeout(() => {
      // En production, ceci ferait un appel API pour récupérer les infos de la communauté
      setCommunityData({
        id: inviteCode,
        name: 'Nouvelle Communauté Bien-être',
        description: 'Une communauté dédiée au développement personnel et au bien-être quotidien',
        coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
        memberCount: '127 membres',
        createdBy: 'Sophie Martin',
        isPublic: false,
      });
      setLoading(false);
    }, 1000);
  }, [inviteCode]);

  const handleJoinCommunity = async () => {
    setJoining(true);
    
    // Simuler l'adhésion à la communauté
    setTimeout(() => {
      setJoining(false);
      Alert.alert(
        'Bienvenue ! 🎉',
        `Vous avez rejoint "${communityData.name}"`,
        [
          {
            text: 'Voir la communauté',
            onPress: () => {
              router.replace({
                pathname: '/chat/[id]',
                params: { 
                  id: communityData.id, 
                  name: communityData.name, 
                  type: 'community' 
                },
              });
            },
          },
        ]
      );
    }, 1500);
  };

  const handleDecline = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Chargement de l'invitation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!communityData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Lien invalide</Text>
          <Text style={styles.errorText}>
            Ce lien d'invitation n'est pas valide ou a expiré.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={handleDecline}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Header avec icône */}
        <View style={styles.iconContainer}>
          <Text style={styles.inviteIcon}>🎉</Text>
        </View>

        <Text style={styles.title}>Invitation à rejoindre</Text>

        {/* Carte de la communauté */}
        <View style={styles.communityCard}>
          <Image
            source={{ uri: communityData.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          <View style={styles.communityInfo}>
            <Text style={styles.communityName}>{communityData.name}</Text>
            <Text style={styles.memberCount}>{communityData.memberCount}</Text>
            {communityData.description && (
              <Text style={styles.description}>{communityData.description}</Text>
            )}
            <View style={styles.creatorInfo}>
              <Text style={styles.creatorLabel}>Créé par</Text>
              <Text style={styles.creatorName}>{communityData.createdBy}</Text>
            </View>
          </View>
        </View>

        {/* Informations */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            En rejoignant cette communauté, vous pourrez :
          </Text>
          <Text style={styles.bulletPoint}>• Participer aux discussions</Text>
          <Text style={styles.bulletPoint}>• Partager du contenu</Text>
          <Text style={styles.bulletPoint}>• Rencontrer de nouveaux membres</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.declineButton}
          onPress={handleDecline}
          activeOpacity={0.7}
          disabled={joining}
        >
          <Text style={styles.declineButtonText}>Refuser</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={handleJoinCommunity}
          activeOpacity={0.7}
          disabled={joining}
        >
          {joining ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.joinButtonText}>Rejoindre</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  inviteIcon: {
    fontSize: 72,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 32,
  },
  communityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  coverImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#E5E7EB',
  },
  communityInfo: {
    padding: 20,
  },
  communityName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginRight: 6,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    paddingLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
