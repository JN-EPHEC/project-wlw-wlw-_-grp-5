import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();

  // États du profil
  const [profileData, setProfileData] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    avatar: user?.avatar || 'https://i.pravatar.cc/150?img=47',
    bio: '',
    interests: '',
  });

  const [isAnonymousMode, setIsAnonymousMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setProfileData((prev) => ({
      ...prev,
      name: user?.fullName || '',
      email: user?.email || '',
      avatar: user?.avatar || prev.avatar,
    }));
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileData({
        ...profileData,
        avatar: result.assets[0].uri,
      });
      Alert.alert('Succès', 'Photo mise à jour');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateUserProfile({
        fullName: profileData.name,
        avatar: profileData.avatar,
        bio: profileData.bio,
        interests: profileData.interests
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      Alert.alert('Succès', 'Profil mis à jour avec succès');
      router.back();
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnonymousToggle = (value: boolean) => {
    setIsAnonymousMode(value);
    if (value) {
      Alert.alert(
        'Mode Anonyme',
        'En activant ce mode, votre nom et votre photo n\'apparaîtront pas dans les communautés. Vous apparaîtrez comme "Utilisateur Anonyme".'
      );
    } else {
      Alert.alert('Mode Anonyme', 'Vous êtes maintenant visible dans les communautés.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={[theme.colors.headerGradient[0], theme.colors.headerGradient[1]]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Modifier mon profil</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Photo de profil */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
            {isAnonymousMode && (
              <View style={styles.anonymousBadge}>
                <Text style={styles.anonymousText}>Anonyme</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <IconSymbol name="camera.fill" size={20} color="#fff" />
            <Text style={styles.changePhotoButtonText}>Changer la photo</Text>
          </TouchableOpacity>
        </View>

        {/* Section Informations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMATIONS PERSONNELLES</Text>

          {/* Nom */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Nom d'utilisateur</Text>
            <TextInput
              style={styles.input}
              placeholder="Entrez votre nom"
              placeholderTextColor={theme.colors.textSecondary}
              value={profileData.name}
              onChangeText={(text) =>
                setProfileData({ ...profileData, name: text })
              }
              editable={!isAnonymousMode}
              maxLength={50}
            />
            <Text style={styles.charCount}>{profileData.name.length}/50</Text>
          </View>

          {/* Bio */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Parle un peu de toi..."
              placeholderTextColor={theme.colors.textSecondary}
              value={profileData.bio}
              onChangeText={(text) =>
                setProfileData({ ...profileData, bio: text })
              }
              multiline
              numberOfLines={3}
              maxLength={200}
            />
            <Text style={styles.charCount}>{profileData.bio.length}/200</Text>
          </View>

          {/* Centres d'intérêt */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Centres d’intérêt (séparés par des virgules)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: méditation, sport, lecture"
              placeholderTextColor={theme.colors.textSecondary}
              value={profileData.interests}
              onChangeText={(text) =>
                setProfileData({ ...profileData, interests: text })
              }
            />
          </View>

          {/* Email */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputReadOnly]}
              value={profileData.email}
              editable={false}
            />
            <Text style={styles.helperText}>Votre email ne peut pas être modifié ici</Text>
          </View>
        </View>

        {/* Section Mode Anonyme */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONFIDENTIALITÉ</Text>

          <View style={styles.card}>
            <View style={styles.anonymousModeHeader}>
              <View>
                <Text style={styles.anonymousModeLabel}>Mode Anonyme</Text>
                <Text style={styles.anonymousModeDescription}>
                  Cachez votre nom et votre photo dans les communautés
                </Text>
              </View>
              <Switch
                value={isAnonymousMode}
                onValueChange={handleAnonymousToggle}
                trackColor={{ false: '#E5E7EB', true: theme.colors.accentLight }}
                thumbColor={isAnonymousMode ? theme.colors.accent : '#F3F4F6'}
                ios_backgroundColor="#E5E7EB"
              />
            </View>

            {isAnonymousMode && (
              <View style={styles.anonymousWarning}>
                <IconSymbol name="exclamationmark.circle.fill" size={20} color={theme.colors.accent} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.warningTitle}>Mode Anonyme Activé</Text>
                  <Text style={styles.warningText}>
                    Votre nom et photo ne seront pas visibles dans les communautés. Vous apparaîtrez comme "Utilisateur Anonyme".
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Section Prévisualisation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APERÇU DE MON PROFIL</Text>

          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Apparence dans les communautés :</Text>

            <View style={styles.previewProfile}>
              <Image
                source={{ uri: isAnonymousMode ? 'https://i.pravatar.cc/150?img=99' : profileData.avatar }}
                style={styles.previewAvatar}
              />
              <View>
                <Text style={styles.previewName}>
                  {isAnonymousMode ? 'Utilisateur Anonyme' : profileData.name}
                </Text>
                {!isAnonymousMode && (
                  <Text style={styles.previewEmail}>{profileData.email}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSaveProfile}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <Text style={styles.saveButtonText}>Enregistrement...</Text>
            ) : (
              <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: theme.radius.card,
    borderBottomRightRadius: theme.radius.card,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  photoSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.accentLight,
    borderWidth: 4,
    borderColor: theme.colors.accent,
  },
  anonymousBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  anonymousText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: theme.colors.accentLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  changePhotoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  inputReadOnly: {
    backgroundColor: theme.colors.accentLight + '10',
    color: theme.colors.textSecondary,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  anonymousModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  anonymousModeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  anonymousModeDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  anonymousWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.accentLight + '10',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.accent,
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  previewProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: theme.colors.accentLight + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  previewAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accentLight,
    marginRight: 12,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  previewEmail: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    shadowColor: theme.colors.accentLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
