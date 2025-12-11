import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { theme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';

interface SettingItem {
  icon: string;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
}

interface ToggleItem {
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();

  // Etats pour les toggles
  const [notifications, setNotifications] = useState({
    communities: true,
    messages: true,
    requests: true,
    wellness: true,
  });

  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>('light');

  // Profil depuis Firestore/Auth
  const profileName = user?.fullName || user?.displayName || 'Utilisateur';
  const profileEmail = user?.email || '---';
  const avatarUri = user?.avatar || 'https://i.pravatar.cc/150?img=47';

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer mon compte',
      'Cette action est irréversible. Toutes vos données seront définitivement supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Compte supprimé', 'Votre compte a été supprimé.');
          },
        },
      ]
    );
  };

  const renderSectionTitle = (title: string) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const renderSettingItem = ({ icon, label, onPress, showChevron = true }: SettingItem) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingItemLeft}>
        <View style={styles.iconContainer}>
          <IconSymbol name={icon as any} size={20} color={theme.colors.accent} />
        </View>
        <Text style={styles.settingItemLabel}>{label}</Text>
      </View>
      {showChevron && (
        <IconSymbol name="chevron.right" size={18} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const renderToggleItem = ({ label, value, onToggle }: ToggleItem) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingItemLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E5E7EB', true: theme.colors.accentLight }}
        thumbColor={value ? theme.colors.accent : '#F3F4F6'}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );

  const renderThemeOption = (themeType: 'light' | 'dark' | 'auto', label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.themeOption,
        selectedTheme === themeType && styles.themeOptionSelected,
      ]}
      onPress={() => setSelectedTheme(themeType)}
      activeOpacity={0.7}
    >
      <View style={styles.themeOptionLeft}>
        <View style={[
          styles.iconContainer,
          selectedTheme === themeType && styles.iconContainerSelected,
        ]}>
          <IconSymbol
            name={icon as any}
            size={20}
            color={selectedTheme === themeType ? '#fff' : theme.colors.accent}
          />
        </View>
        <Text style={[
          styles.themeOptionLabel,
          selectedTheme === themeType && styles.themeOptionLabelSelected,
        ]}>
          {label}
        </Text>
      </View>
      {selectedTheme === themeType && (
        <View style={styles.checkmark}>
          <IconSymbol name="checkmark.circle.fill" size={22} color={theme.colors.accent} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header avec dégradé */}
      <LinearGradient
        colors={[theme.colors.headerGradient[0], theme.colors.headerGradient[1]]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Paramètres</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bloc 1 : Profil utilisateur */}
        <View style={styles.card}>
          <View style={styles.profileSection}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profileName}</Text>
              <Text style={styles.profileEmail}>{profileEmail}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push('/profile-edit')}
            activeOpacity={0.8}
          >
            <Text style={styles.editProfileButtonText}>Modifier mon profil</Text>
            <IconSymbol name="chevron.right" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Bloc 2 : Compte & sécurité */}
        {renderSectionTitle('COMPTE & SÉCURITÉ')}
        <View style={styles.card}>
          {renderSettingItem({
            icon: 'envelope.fill',
            label: 'Modifier l\'email',
            onPress: () => router.push('/security-settings'),
          })}
          <View style={styles.divider} />
          {renderSettingItem({
            icon: 'lock.fill',
            label: 'Modifier le mot de passe',
            onPress: () => router.push('/security-settings'),
          })}
        </View>

        {/* Bloc 3 : Notifications */}
        {renderSectionTitle('NOTIFICATIONS')}
        <View style={styles.card}>
          {renderToggleItem({
            label: 'Notifications des communautés',
            value: notifications.communities,
            onToggle: (value) => setNotifications({ ...notifications, communities: value }),
          })}
          <View style={styles.divider} />
          {renderToggleItem({
            label: 'Notifications des messages',
            value: notifications.messages,
            onToggle: (value) => setNotifications({ ...notifications, messages: value }),
          })}
          <View style={styles.divider} />
          {renderToggleItem({
            label: 'Demandes de discussions',
            value: notifications.requests,
            onToggle: (value) => setNotifications({ ...notifications, requests: value }),
          })}
          <View style={styles.divider} />
          {renderToggleItem({
            label: 'Notifications bien-être',
            value: notifications.wellness,
            onToggle: (value) => setNotifications({ ...notifications, wellness: value }),
          })}
        </View>

        {/* Bloc 4 : Apparence */}
        {renderSectionTitle('APPARENCE')}
        <View style={styles.card}>
          {renderThemeOption('light', 'Mode clair', 'sun.max.fill')}
          <View style={styles.divider} />
          {renderThemeOption('dark', 'Mode sombre', 'moon.fill')}
          <View style={styles.divider} />
          {renderThemeOption('auto', 'Mode automatique', 'circle.lefthalf.filled')}
        </View>

        {/* Bloc 5 : Confidentialité */}
        {renderSectionTitle('CONFIDENTIALITÉ')}
        <View style={styles.card}>
          {renderSettingItem({
            icon: 'shield.fill',
            label: 'Gérer mes données',
            onPress: () => Alert.alert('Navigation', 'Gérer mes données'),
          })}
          <View style={styles.divider} />
          {renderSettingItem({
            icon: 'arrow.down.doc.fill',
            label: 'Télécharger mes données',
            onPress: () => Alert.alert('Téléchargement', 'Préparation de vos données...'),
          })}
          <View style={styles.divider} />
          {renderSettingItem({
            icon: 'trash.fill',
            label: 'Supprimer mon compte',
            onPress: handleDeleteAccount,
          })}
          <View style={styles.divider} />
          {renderSettingItem({
            icon: 'doc.text.fill',
            label: 'Politique de confidentialité',
            onPress: () => Alert.alert('Navigation', 'Politique de confidentialité'),
          })}
        </View>

        {/* Bloc 6 : À propos / Support */}
        {renderSectionTitle('À PROPOS & SUPPORT')}
        <View style={styles.card}>
          {renderSettingItem({
            icon: 'info.circle.fill',
            label: 'À propos de Mindly',
            onPress: () => Alert.alert('Mindly', 'Version 1.0.0\n© 2025 Mindly'),
          })}
          <View style={styles.divider} />
          {renderSettingItem({
            icon: 'doc.plaintext.fill',
            label: 'Conditions générales',
            onPress: () => Alert.alert('Navigation', 'Conditions générales'),
          })}
          <View style={styles.divider} />
          {renderSettingItem({
            icon: 'questionmark.circle.fill',
            label: 'Centre d\'aide',
            onPress: () => Alert.alert('Navigation', 'Centre d\'aide'),
          })}
          <View style={styles.divider} />
          {renderSettingItem({
            icon: 'questionmark.circle.fill',
            label: 'FAQ',
            onPress: () => router.push('/faq'),
          })}
          <View style={styles.divider} />
          {renderSettingItem({
            icon: 'envelope.badge.fill',
            label: 'Contacter le support',
            onPress: () => Alert.alert('Support', 'support@mindly.app'),
          })}
        </View>

        {/* Bloc 7 : Déconnexion */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <IconSymbol name="arrow.right.square.fill" size={20} color="#D9534F" />
          <Text style={styles.logoutButtonText}>Déconnexion</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Mindly v1.0.0</Text>
        </View>
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
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: theme.radius.card,
    borderBottomRightRadius: theme.radius.card,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: theme.colors.bubbleShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.accentLight,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: theme.colors.accentLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editProfileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.accentLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconContainerSelected: {
    backgroundColor: theme.colors.accent,
  },
  settingItemLabel: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 4,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  themeOptionSelected: {
    // Style appliqué quand sélectionné
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeOptionLabel: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  themeOptionLabelSelected: {
    fontWeight: '600',
    color: theme.colors.accent,
  },
  checkmark: {
    // Container pour l'icône de checkmark
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE8E8',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 24,
    shadowColor: '#D9534F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D9534F',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});





