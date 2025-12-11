import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
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

export default function SecuritySettingsScreen() {
  const router = useRouter();

  // États
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Email
  const [currentEmail, setCurrentEmail] = useState('khalissia@mindly.app');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // Mot de passe
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Validations
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 8;
  };

  const handleChangeEmail = () => {
    if (!newEmail.trim() || !confirmEmail.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!isValidEmail(newEmail)) {
      Alert.alert('Erreur', 'Veuillez entrer un email valide');
      return;
    }

    if (newEmail !== confirmEmail) {
      Alert.alert('Erreur', 'Les emails ne correspondent pas');
      return;
    }

    if (newEmail === currentEmail) {
      Alert.alert('Erreur', 'Le nouvel email doit être différent du mail actuel');
      return;
    }

    Alert.alert(
      'Confirmation',
      `Êtes-vous sûr de vouloir changer votre email en ${newEmail} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'default',
          onPress: () => {
            setEmailLoading(true);
            setTimeout(() => {
              setEmailLoading(false);
              setCurrentEmail(newEmail);
              setNewEmail('');
              setConfirmEmail('');
              setShowChangeEmail(false);
              Alert.alert('Succès', 'Votre email a été modifié avec succès');
            }, 1500);
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!isValidPassword(newPassword)) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Erreur', 'Le nouveau mot de passe doit être différent de l\'actuel');
      return;
    }

    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir modifier votre mot de passe ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'default',
          onPress: () => {
            setPasswordLoading(true);
            setTimeout(() => {
              setPasswordLoading(false);
              setCurrentPassword('');
              setNewPassword('');
              setConfirmPassword('');
              setShowChangePassword(false);
              Alert.alert('Succès', 'Votre mot de passe a été modifié avec succès');
            }, 1500);
          },
        },
      ]
    );
  };

  const renderPasswordInput = (
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    field: 'current' | 'new' | 'confirm'
  ) => (
    <View style={styles.passwordInputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword[field]}
        maxLength={100}
      />
      <TouchableOpacity
        onPress={() =>
          setShowPassword({ ...showPassword, [field]: !showPassword[field] })
        }
        style={styles.passwordToggle}
      >
        <IconSymbol
          name={showPassword[field] ? 'eye.fill' : 'eye.slash.fill'}
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.headerTitle}>Compte & Sécurité</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Email */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EMAIL</Text>

          <View style={styles.card}>
            <View style={styles.currentInfoRow}>
              <View>
                <Text style={styles.infoLabel}>Email actuel</Text>
                <Text style={styles.infoValue}>{currentEmail}</Text>
              </View>
              <IconSymbol name="checkmark.circle.fill" size={24} color={theme.colors.accent} />
            </View>
          </View>

          {!showChangeEmail ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowChangeEmail(true)}
              activeOpacity={0.8}
            >
              <IconSymbol name="pencil.circle.fill" size={20} color={theme.colors.accent} />
              <Text style={styles.actionButtonText}>Modifier mon email</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Nouvel email</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre nouvel email"
                placeholderTextColor={theme.colors.textSecondary}
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.fieldLabel}>Confirmer l'email</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirmez votre nouvel email"
                placeholderTextColor={theme.colors.textSecondary}
                value={confirmEmail}
                onChangeText={setConfirmEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {newEmail && confirmEmail && newEmail !== confirmEmail && (
                <View style={styles.errorMessage}>
                  <IconSymbol name="exclamationmark.circle.fill" size={16} color="#EF4444" />
                  <Text style={styles.errorText}>Les emails ne correspondent pas</Text>
                </View>
              )}

              {newEmail && isValidEmail(newEmail) && confirmEmail === newEmail && (
                <View style={styles.successMessage}>
                  <IconSymbol name="checkmark.circle.fill" size={16} color={theme.colors.accent} />
                  <Text style={styles.successText}>Les emails correspondent</Text>
                </View>
              )}

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowChangeEmail(false);
                    setNewEmail('');
                    setConfirmEmail('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    emailLoading && styles.submitButtonDisabled,
                    (!newEmail || !confirmEmail || newEmail !== confirmEmail) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleChangeEmail}
                  disabled={emailLoading || !newEmail || !confirmEmail || newEmail !== confirmEmail}
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitButtonText}>
                    {emailLoading ? 'Modification...' : 'Modifier'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Section Mot de passe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MOT DE PASSE</Text>

          <View style={styles.card}>
            <View style={styles.passwordInfoRow}>
              <View>
                <Text style={styles.infoLabel}>Mot de passe</Text>
                <Text style={styles.infoValue}>••••••••••••</Text>
              </View>
              <IconSymbol name="lock.fill" size={24} color={theme.colors.accent} />
            </View>
          </View>

          {!showChangePassword ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowChangePassword(true)}
              activeOpacity={0.8}
            >
              <IconSymbol name="pencil.circle.fill" size={20} color={theme.colors.accent} />
              <Text style={styles.actionButtonText}>Modifier mon mot de passe</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Mot de passe actuel</Text>
              {renderPasswordInput(
                currentPassword,
                setCurrentPassword,
                'Entrez votre mot de passe actuel',
                'current'
              )}

              <Text style={styles.fieldLabel}>Nouveau mot de passe</Text>
              {renderPasswordInput(
                newPassword,
                setNewPassword,
                'Entrez un nouveau mot de passe',
                'new'
              )}
              <Text style={styles.helperText}>
                Minimum 8 caractères avec majuscules, minuscules et chiffres
              </Text>

              <Text style={styles.fieldLabel}>Confirmer le mot de passe</Text>
              {renderPasswordInput(
                confirmPassword,
                setConfirmPassword,
                'Confirmez votre nouveau mot de passe',
                'confirm'
              )}

              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <View style={styles.errorMessage}>
                  <IconSymbol name="exclamationmark.circle.fill" size={16} color="#EF4444" />
                  <Text style={styles.errorText}>Les mots de passe ne correspondent pas</Text>
                </View>
              )}

              {newPassword &&
                confirmPassword &&
                newPassword === confirmPassword &&
                isValidPassword(newPassword) && (
                  <View style={styles.successMessage}>
                    <IconSymbol name="checkmark.circle.fill" size={16} color={theme.colors.accent} />
                    <Text style={styles.successText}>Le mot de passe est valide</Text>
                  </View>
                )}

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowChangePassword(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    passwordLoading && styles.submitButtonDisabled,
                    (!currentPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword ||
                      !isValidPassword(newPassword)) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleChangePassword}
                  disabled={
                    passwordLoading ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    !isValidPassword(newPassword)
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.submitButtonText}>
                    {passwordLoading ? 'Modification...' : 'Modifier'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  currentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passwordInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.input,
    paddingRight: 12,
  },
  passwordToggle: {
    padding: 8,
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 6,
  },
  errorMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE8E8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    marginLeft: 8,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accentLight + '15',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
  successText: {
    fontSize: 13,
    color: theme.colors.accent,
    marginLeft: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  twoFactorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  twoFactorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accentLight + '15',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
  twoFactorInfoText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
